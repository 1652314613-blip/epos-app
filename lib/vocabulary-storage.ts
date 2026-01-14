import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Definition {
  partOfSpeech: string; // 词性：noun, verb, adjective等
  meaning: string; // 中文释义
  exampleSentence?: string; // 例句
}

export interface Word {
  id: string;
  word: string; // 单词
  phonetic: string; // 音标
  definitions: Definition[]; // 释义列表
  examples: string[]; // 例句
  addedAt: number; // 添加时间戳
  lastReviewedAt: number; // 最后复习时间
  nextReviewAt: number; // 下次复习时间
  reviewCount: number; // 复习次数
  masteryLevel: "new" | "learning" | "familiar" | "mastered"; // 掌握程度
  easeFactor: number; // 难度系数（用于SRS算法）
  interval: number; // 复习间隔（天）
}

const VOCABULARY_KEY = "vocabulary_book";
const STATS_KEY = "vocabulary_stats";

export interface VocabularyStats {
  totalWords: number;
  newWords: number;
  learningWords: number;
  familiarWords: number;
  masteredWords: number;
  todayLearned: number;
  todayReviewed: number;
  streak: number; // 连续学习天数
  lastStudyDate: string; // 最后学习日期（YYYY-MM-DD）
}

/**
 * 获取所有单词
 */
export async function getAllWords(): Promise<Word[]> {
  try {
    const data = await AsyncStorage.getItem(VOCABULARY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading vocabulary:", error);
    return [];
  }
}

/**
 * 添加单词到单词本
 */
export async function addWord(word: Omit<Word, "id" | "addedAt" | "lastReviewedAt" | "nextReviewAt" | "reviewCount" | "masteryLevel" | "easeFactor" | "interval">): Promise<Word> {
  const words = await getAllWords();
  
  // 检查是否已存在
  const existing = words.find((w) => w.word.toLowerCase() === word.word.toLowerCase());
  if (existing) {
    return existing;
  }

  const newWord: Word = {
    ...word,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    addedAt: Date.now(),
    lastReviewedAt: 0,
    nextReviewAt: Date.now(), // 立即可复习
    reviewCount: 0,
    masteryLevel: "new",
    easeFactor: 2.5, // SM-2算法默认值
    interval: 0,
  };

  words.push(newWord);
  await AsyncStorage.setItem(VOCABULARY_KEY, JSON.stringify(words));
  await updateStats();
  return newWord;
}

/**
 * 删除单词
 */
export async function deleteWord(wordId: string): Promise<void> {
  const words = await getAllWords();
  const filtered = words.filter((w) => w.id !== wordId);
  await AsyncStorage.setItem(VOCABULARY_KEY, JSON.stringify(filtered));
  await updateStats();
}

/**
 * 更新单词复习记录（SM-2算法）
 * @param wordId 单词ID
 * @param quality 质量评分 0-5：0=完全不记得，3=勉强记得，5=完美记得
 */
export async function updateWordReview(wordId: string, quality: number): Promise<void> {
  const words = await getAllWords();
  const word = words.find((w) => w.id === wordId);
  if (!word) return;

  const now = Date.now();
  word.lastReviewedAt = now;
  word.reviewCount += 1;

  // SM-2算法
  if (quality < 3) {
    // 不记得，重置
    word.interval = 1;
    word.masteryLevel = "learning";
  } else {
    // 记得，增加间隔
    if (word.interval === 0) {
      word.interval = 1;
    } else if (word.interval === 1) {
      word.interval = 3;
    } else {
      word.interval = Math.round(word.interval * word.easeFactor);
    }

    // 更新难度系数
    word.easeFactor = word.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    word.easeFactor = Math.max(1.3, word.easeFactor); // 最小值1.3

    // 更新掌握程度
    if (word.reviewCount >= 10 && word.interval >= 30) {
      word.masteryLevel = "mastered";
    } else if (word.reviewCount >= 5 && word.interval >= 7) {
      word.masteryLevel = "familiar";
    } else {
      word.masteryLevel = "learning";
    }
  }

  // 计算下次复习时间
  word.nextReviewAt = now + word.interval * 24 * 60 * 60 * 1000;

  await AsyncStorage.setItem(VOCABULARY_KEY, JSON.stringify(words));
  await updateStats();
}

/**
 * 获取需要复习的单词
 */
export async function getWordsToReview(): Promise<Word[]> {
  const words = await getAllWords();
  const now = Date.now();
  return words.filter((w) => w.nextReviewAt <= now).sort((a, b) => a.nextReviewAt - b.nextReviewAt);
}

/**
 * 获取新单词（未复习过的）
 */
export async function getNewWords(limit: number = 10): Promise<Word[]> {
  const words = await getAllWords();
  return words.filter((w) => w.reviewCount === 0).slice(0, limit);
}

/**
 * 更新统计数据
 */
async function updateStats(): Promise<void> {
  const words = await getAllWords();
  const today = new Date().toISOString().split("T")[0];

  const stats: VocabularyStats = {
    totalWords: words.length,
    newWords: words.filter((w) => w.masteryLevel === "new").length,
    learningWords: words.filter((w) => w.masteryLevel === "learning").length,
    familiarWords: words.filter((w) => w.masteryLevel === "familiar").length,
    masteredWords: words.filter((w) => w.masteryLevel === "mastered").length,
    todayLearned: words.filter((w) => {
      const addedDate = new Date(w.addedAt).toISOString().split("T")[0];
      return addedDate === today;
    }).length,
    todayReviewed: words.filter((w) => {
      const reviewedDate = new Date(w.lastReviewedAt).toISOString().split("T")[0];
      return reviewedDate === today && w.reviewCount > 0;
    }).length,
    streak: 0, // TODO: 计算连续天数
    lastStudyDate: today,
  };

  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

/**
 * 获取统计数据
 */
export async function getVocabularyStats(): Promise<VocabularyStats> {
  try {
    const data = await AsyncStorage.getItem(STATS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading stats:", error);
  }

  // 返回默认值
  return {
    totalWords: 0,
    newWords: 0,
    learningWords: 0,
    familiarWords: 0,
    masteredWords: 0,
    todayLearned: 0,
    todayReviewed: 0,
    streak: 0,
    lastStudyDate: new Date().toISOString().split("T")[0],
  };
}
