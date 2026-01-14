/**
 * Score Improvement Service - 提分报告生成服务
 * 结合错题本和语法点数据,生成个性化的提分报告
 */

import { getAllWrongQuestions } from "@/lib/wrong-book";
import { grammarPoints } from "@/lib/grammar-points-data";
import { getCheckHistory } from "@/lib/storage";

export interface ScoreImprovementReport {
  // 总体情况
  currentLevel: string; // 当前水平 (初级/中级/高级)
  overallScore: number; // 综合分数 (0-100)
  
  // 提分空间
  potentialGain: number; // 预计可提升分数
  targetScore: number; // 目标分数
  
  // 知识点掌握情况
  grammarMastery: GrammarMasteryItem[];
  
  // 薄弱点分析
  weakPoints: WeakPoint[];
  
  // 学习建议
  recommendations: Recommendation[];
  
  // 学习进度
  progressStats: ProgressStats;
}

export interface GrammarMasteryItem {
  id: string;
  title: string;
  category: string;
  masteryLevel: number; // 0-100
  errorCount: number; // 错误次数
  examTag?: string; // 考点标签
  estimatedScore: number; // 预估分值
  status: "mastered" | "learning" | "weak"; // 掌握状态
}

export interface WeakPoint {
  category: string;
  errorCount: number;
  masteryLevel: number;
  affectedGrammarPoints: string[];
  estimatedScoreLoss: number; // 预估失分
  priority: "high" | "medium" | "low";
}

export interface Recommendation {
  title: string;
  description: string;
  actionText: string;
  actionRoute: string;
  priority: number;
  estimatedImpact: number; // 预估提分效果
}

export interface ProgressStats {
  totalChecks: number;
  totalErrors: number;
  correctedErrors: number;
  averageScore: number;
  improvementRate: number; // 进步率 (%)
  studyDays: number;
  streak: number;
}

/**
 * 生成提分报告
 */
export async function generateScoreImprovementReport(): Promise<ScoreImprovementReport> {
  const [wrongQuestions, checkHistory] = await Promise.all([
    getAllWrongQuestions(),
    getCheckHistory(),
  ]);

  // 1. 计算综合分数
  const overallScore = calculateOverallScore(checkHistory, wrongQuestions);
  
  // 2. 分析知识点掌握情况
  const grammarMastery = analyzeGrammarMastery(wrongQuestions);
  
  // 3. 识别薄弱点
  const weakPoints = identifyWeakPoints(wrongQuestions, grammarMastery);
  
  // 4. 计算提分空间
  const potentialGain = calculatePotentialGain(weakPoints);
  
  // 5. 生成学习建议
  const recommendations = generateRecommendations(weakPoints, grammarMastery);
  
  // 6. 统计学习进度
  const progressStats = calculateProgressStats(checkHistory, wrongQuestions);
  
  // 7. 确定当前水平
  const currentLevel = determineLevel(overallScore);

  return {
    currentLevel,
    overallScore,
    potentialGain,
    targetScore: Math.min(overallScore + potentialGain, 100),
    grammarMastery,
    weakPoints,
    recommendations,
    progressStats,
  };
}

/**
 * 计算综合分数
 */
function calculateOverallScore(checkHistory: any[], wrongQuestions: any[]): number {
  if (checkHistory.length === 0) return 0;
  
  // 最近10次检查的平均分
  const recentChecks = checkHistory.slice(-10);
  const avgCheckScore = recentChecks.reduce((sum, check) => sum + check.result.overallScore, 0) / recentChecks.length;
  
  // 错题掌握度
  const avgMasteryLevel = wrongQuestions.length > 0
    ? wrongQuestions.reduce((sum, q) => sum + (q.masteryLevel || 0), 0) / wrongQuestions.length
    : 100;
  
  // 综合分数 = 检查平均分 * 0.6 + 掌握度 * 0.4
  return Math.round(avgCheckScore * 0.6 + avgMasteryLevel * 0.4);
}

/**
 * 分析语法点掌握情况
 */
function analyzeGrammarMastery(wrongQuestions: any[]): GrammarMasteryItem[] {
  const masteryMap = new Map<string, GrammarMasteryItem>();
  
  // 初始化所有语法点
  grammarPoints.forEach(point => {
    masteryMap.set(point.id, {
      id: point.id,
      title: point.title,
      category: point.category,
      masteryLevel: 100, // 默认满分
      errorCount: 0,
      examTag: point.examTags?.[0],
      estimatedScore: estimateGrammarScore(point),
      status: "mastered",
    });
  });
  
  // 根据错题更新掌握度
  wrongQuestions.forEach(q => {
    if (q.topicId && masteryMap.has(q.topicId)) {
      const item = masteryMap.get(q.topicId)!;
      item.errorCount++;
      item.masteryLevel = Math.min(item.masteryLevel, q.masteryLevel || 0);
      
      // 更新状态
      if (item.masteryLevel >= 80) {
        item.status = "mastered";
      } else if (item.masteryLevel >= 50) {
        item.status = "learning";
      } else {
        item.status = "weak";
      }
    }
  });
  
  return Array.from(masteryMap.values()).sort((a, b) => a.masteryLevel - b.masteryLevel);
}

/**
 * 识别薄弱点
 */
function identifyWeakPoints(wrongQuestions: any[], grammarMastery: GrammarMasteryItem[]): WeakPoint[] {
  const categoryMap = new Map<string, WeakPoint>();
  
  wrongQuestions.forEach(q => {
    if (!q.category) return;
    
    if (!categoryMap.has(q.category)) {
      categoryMap.set(q.category, {
        category: q.category,
        errorCount: 0,
        masteryLevel: 100,
        affectedGrammarPoints: [],
        estimatedScoreLoss: 0,
        priority: "low",
      });
    }
    
    const weakPoint = categoryMap.get(q.category)!;
    weakPoint.errorCount++;
    weakPoint.masteryLevel = Math.min(weakPoint.masteryLevel, q.masteryLevel || 0);
    
    if (q.topicId && !weakPoint.affectedGrammarPoints.includes(q.topicId)) {
      weakPoint.affectedGrammarPoints.push(q.topicId);
    }
  });
  
  // 计算预估失分和优先级
  categoryMap.forEach(weakPoint => {
    // 失分 = 错误次数 * (100 - 掌握度) / 100 * 2
    weakPoint.estimatedScoreLoss = Math.round(weakPoint.errorCount * (100 - weakPoint.masteryLevel) / 100 * 2);
    
    // 优先级
    if (weakPoint.masteryLevel < 50) {
      weakPoint.priority = "high";
    } else if (weakPoint.masteryLevel < 70) {
      weakPoint.priority = "medium";
    } else {
      weakPoint.priority = "low";
    }
  });
  
  return Array.from(categoryMap.values()).sort((a, b) => b.estimatedScoreLoss - a.estimatedScoreLoss);
}

/**
 * 计算提分空间
 */
function calculatePotentialGain(weakPoints: WeakPoint[]): number {
  // 提分空间 = 所有薄弱点的预估失分总和 * 0.7 (保守估计)
  const totalLoss = weakPoints.reduce((sum, wp) => sum + wp.estimatedScoreLoss, 0);
  return Math.round(totalLoss * 0.7);
}

/**
 * 生成学习建议
 */
function generateRecommendations(weakPoints: WeakPoint[], grammarMastery: GrammarMasteryItem[]): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // 1. 针对高优先级薄弱点的建议
  const highPriorityWeakPoints = weakPoints.filter(wp => wp.priority === "high").slice(0, 3);
  highPriorityWeakPoints.forEach((wp, index) => {
    recommendations.push({
      title: `攻克${getCategoryLabel(wp.category)}`,
      description: `你在${getCategoryLabel(wp.category)}方面还有较大提升空间,已错${wp.errorCount}次,掌握度${wp.masteryLevel}%`,
      actionText: "开始专项练习",
      actionRoute: `/grammar-exercise?category=${wp.category}`,
      priority: index + 1,
      estimatedImpact: wp.estimatedScoreLoss,
    });
  });
  
  // 2. 针对考点的建议
  const examGrammarPoints = grammarMastery.filter(gm => gm.examTag && gm.status !== "mastered").slice(0, 2);
  examGrammarPoints.forEach((gm, index) => {
    recommendations.push({
      title: `重点突破${gm.title}`,
      description: `这是${gm.examTag}重点,预估分值${gm.estimatedScore}分,建议优先掌握`,
      actionText: "查看知识点",
      actionRoute: `/grammar-point-detail?id=${gm.id}`,
      priority: highPriorityWeakPoints.length + index + 1,
      estimatedImpact: gm.estimatedScore,
    });
  });
  
  // 3. 通用建议
  if (recommendations.length < 5) {
    recommendations.push({
      title: "每日坚持练习",
      description: "保持每天至少完成3道语法练习,巩固已学知识",
      actionText: "去练习",
      actionRoute: "/grammar-exercise",
      priority: 99,
      estimatedImpact: 5,
    });
  }
  
  return recommendations.sort((a, b) => a.priority - b.priority);
}

/**
 * 计算学习进度统计
 */
function calculateProgressStats(checkHistory: any[], wrongQuestions: any[]): ProgressStats {
  const totalChecks = checkHistory.length;
  const totalErrors = checkHistory.reduce((sum, check) => sum + check.result.errors.length, 0);
  const correctedErrors = wrongQuestions.filter(q => (q.masteryLevel || 0) >= 80).length;
  
  const avgScore = totalChecks > 0
    ? checkHistory.reduce((sum, check) => sum + check.result.overallScore, 0) / totalChecks
    : 0;
  
  // 计算进步率 (最近5次 vs 之前5次)
  let improvementRate = 0;
  if (totalChecks >= 10) {
    const recent5 = checkHistory.slice(-5);
    const previous5 = checkHistory.slice(-10, -5);
    const recentAvg = recent5.reduce((sum, check) => sum + check.result.overallScore, 0) / 5;
    const previousAvg = previous5.reduce((sum, check) => sum + check.result.overallScore, 0) / 5;
    improvementRate = Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
  }
  
  // 计算学习天数
  const uniqueDays = new Set(checkHistory.map(check => check.timestamp.split("T")[0]));
  const studyDays = uniqueDays.size;
  
  // 计算连续天数 (简化版)
  const streak = calculateStreak(checkHistory);
  
  return {
    totalChecks,
    totalErrors,
    correctedErrors,
    averageScore: Math.round(avgScore),
    improvementRate,
    studyDays,
    streak,
  };
}

/**
 * 确定当前水平
 */
function determineLevel(score: number): string {
  if (score >= 85) return "高级";
  if (score >= 70) return "中级";
  if (score >= 50) return "初级";
  return "入门";
}

/**
 * 估算语法点分值
 */
function estimateGrammarScore(point: any): number {
  // 根据考点标签估算分值
  if (point.examTags?.includes("高考考点")) return 10;
  if (point.examTags?.includes("中考频次")) return 8;
  return 5;
}

/**
 * 获取分类标签
 */
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "tense": "时态",
    "voice": "语态",
    "clause": "从句",
    "agreement": "主谓一致",
    "article": "冠词",
    "preposition": "介词",
    "pronoun": "代词",
    "modal": "情态动词",
    "infinitive": "不定式",
    "gerund": "动名词",
  };
  return labels[category] || category;
}

/**
 * 计算连续学习天数
 */
function calculateStreak(checkHistory: any[]): number {
  if (checkHistory.length === 0) return 0;
  
  const dates = checkHistory.map(check => check.timestamp.split("T")[0]).reverse();
  const uniqueDates = Array.from(new Set(dates));
  
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  let currentDate = new Date(today);
  
  for (const dateStr of uniqueDates) {
    const checkDate = new Date(dateStr);
    const diffDays = Math.floor((currentDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
