/**
 * Ability Radar Service - Calculate user ability scores across 5 dimensions
 * Dimensions: Vocabulary (词汇), Grammar (语法), Authenticity (地道度), Perseverance (毅力), Difficulty (难度)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWrongBook, getCollectionBook } from "@/lib/storage";
import { getAllUnitProgress } from "./unit-progress-service";

export interface AbilityScores {
  vocabulary: number; // 0-100
  grammar: number; // 0-100
  authenticity: number; // 0-100
  perseverance: number; // 0-100
  difficulty: number; // 0-100
}

const GRAMMAR_CHECK_HISTORY_KEY = "grammar_check_history";

interface GrammarCheckRecord {
  date: string;
  score: number;
  errorCount: number;
}

/**
 * Calculate user's ability scores across all dimensions
 */
export async function calculateAbilityScores(): Promise<AbilityScores> {
  const [vocabularyScore, grammarScore, authenticityScore, perseveranceScore, difficultyScore] = await Promise.all([
    calculateVocabularyScore(),
    calculateGrammarScore(),
    calculateAuthenticityScore(),
    calculatePerseveranceScore(),
    calculateDifficultyScore(),
  ]);

  return {
    vocabulary: vocabularyScore,
    grammar: grammarScore,
    authenticity: authenticityScore,
    perseverance: perseveranceScore,
    difficulty: difficultyScore,
  };
}

/**
 * Vocabulary Score (词汇)
 * Based on vocabulary book size and textbook progress
 */
async function calculateVocabularyScore(): Promise<number> {
  try {
    const collectionBook = await getCollectionBook();
    const unitProgress = await getAllUnitProgress();

    // 积累本中的词汇数量（最多100个算满分）
    const vocabBookScore = Math.min((collectionBook.length / 100) * 50, 50);

    // 教材单元词汇学习进度
    const unitScores = Object.values(unitProgress).map((progress) => {
      if (progress.vocabularyTotal === 0) return 0;
      return (progress.vocabularyLearned / progress.vocabularyTotal) * 100;
    });
    const avgUnitScore = unitScores.length > 0 ? unitScores.reduce((a, b) => a + b, 0) / unitScores.length : 0;
    const unitProgressScore = (avgUnitScore / 100) * 50;

    return Math.round(vocabBookScore + unitProgressScore);
  } catch (error) {
    console.error("Failed to calculate vocabulary score:", error);
    return 0;
  }
}

/**
 * Grammar Score (语法)
 * Based on grammar check history and error correction rate
 */
async function calculateGrammarScore(): Promise<number> {
  try {
    const historyData = await AsyncStorage.getItem(GRAMMAR_CHECK_HISTORY_KEY);
    
    // 使用新的错题本系统
    const { getAllWrongQuestions } = await import('@/lib/wrong-book');
    const wrongQuestions = await getAllWrongQuestions();
    
    let grammarScore = 0;
    
    // 如果有语法检查历史，计算平均分
    if (historyData) {
      const history: GrammarCheckRecord[] = JSON.parse(historyData);
      if (history.length > 0) {
        const recentChecks = history.slice(-10);
        const avgScore = recentChecks.reduce((sum, record) => sum + record.score, 0) / recentChecks.length;
        grammarScore = avgScore * 0.6;  // 60%权重
      }
    }
    
    // 错题本掌握率：30%权重
    if (wrongQuestions.length > 0) {
      // 使用平均掌握度代替简单的已掌握比率
      const avgMasteryLevel = wrongQuestions.reduce((sum, q) => sum + (q.masteryLevel || 0), 0) / wrongQuestions.length;
      grammarScore += avgMasteryLevel * 0.3;  // 30%权重
    }
    
    // 练习活跃度：10%权重
    const totalReviews = wrongQuestions.reduce((sum, q) => sum + q.reviewCount, 0);
    const activityScore = Math.min((totalReviews / 20) * 10, 10);  // 每20次复习满10分
    grammarScore += activityScore;

    return Math.round(Math.min(grammarScore, 100));
  } catch (error) {
    console.error("Failed to calculate grammar score:", error);
    return 0;
  }
}

/**
 * Authenticity Score (地道度)
 * Based on usage of advanced expressions and polish suggestions
 */
async function calculateAuthenticityScore(): Promise<number> {
  try {
    // 基于积累本中的高级表达数量
    const COLLECTION_KEY = "collection_book";
    const data = await AsyncStorage.getItem(COLLECTION_KEY);
    if (!data) return 0;

    const collections = JSON.parse(data);
    const collectionCount = collections.length;

    // 每收藏5个高级表达，地道度+10分（最多100分）
    return Math.min(Math.round((collectionCount / 5) * 10), 100);
  } catch (error) {
    console.error("Failed to calculate authenticity score:", error);
    return 0;
  }
}

/**
 * Perseverance Score (毅力)
 * Based on learning streak and consistency
 */
async function calculatePerseveranceScore(): Promise<number> {
  try {
    const historyData = await AsyncStorage.getItem(GRAMMAR_CHECK_HISTORY_KEY);
    if (!historyData) return 0;

    const history: GrammarCheckRecord[] = JSON.parse(historyData);
    if (history.length === 0) return 0;

    // 学习天数（去重）
    const uniqueDays = new Set(history.map((record) => record.date.split("T")[0]));
    const learningDays = uniqueDays.size;

    // 每学习1天，毅力+5分（最多100分）
    const daysScore = Math.min(learningDays * 5, 70);

    // 最近7天的连续性（最多30分）
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentDays = Array.from(uniqueDays).filter((day) => new Date(day) >= sevenDaysAgo);
    const consistencyScore = Math.min((recentDays.length / 7) * 30, 30);

    return Math.round(daysScore + consistencyScore);
  } catch (error) {
    console.error("Failed to calculate perseverance score:", error);
    return 0;
  }
}

/**
 * Difficulty Score (难度)
 * Based on complexity of sentences checked and advanced features used
 */
async function calculateDifficultyScore(): Promise<number> {
  try {
    const historyData = await AsyncStorage.getItem(GRAMMAR_CHECK_HISTORY_KEY);
    if (!historyData) return 0;

    const history: GrammarCheckRecord[] = JSON.parse(historyData);
    if (history.length === 0) return 0;

    // 检查次数（最多50分）
    const checkCountScore = Math.min((history.length / 20) * 50, 50);

    // 错误复杂度（基于错误数量的平均值，最多50分）
    const avgErrors = history.reduce((sum, record) => sum + record.errorCount, 0) / history.length;
    const complexityScore = Math.min((avgErrors / 5) * 50, 50);

    return Math.round(checkCountScore + complexityScore);
  } catch (error) {
    console.error("Failed to calculate difficulty score:", error);
    return 0;
  }
}

/**
 * Record a grammar check for ability calculation
 */
export async function recordGrammarCheck(score: number, errorCount: number): Promise<void> {
  try {
    const historyData = await AsyncStorage.getItem(GRAMMAR_CHECK_HISTORY_KEY);
    const history: GrammarCheckRecord[] = historyData ? JSON.parse(historyData) : [];

    history.push({
      date: new Date().toISOString(),
      score,
      errorCount,
    });

    // Keep last 100 records
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }

    await AsyncStorage.setItem(GRAMMAR_CHECK_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to record grammar check:", error);
  }
}
