/**
 * 错题本数据管理
 * 记录用户在语法练习中的错题,支持复习和重做
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WrongQuestion {
  id: string;
  grammarPointId: string;  // 关联的语法点ID
  grammarPointTitle: string;  // 语法点标题
  question: string;  // 题目内容
  userAnswer: string;  // 用户的错误答案
  correctAnswer: string;  // 正确答案
  explanation: string;  // 解析
  timestamp: number;  // 错误时间戳
  reviewCount: number;  // 复习次数
  lastReviewTime?: number;  // 最后复习时间
  mastered: boolean;  // 是否已掌握
  // 新增字段
  category?: string;  // 错误类型（时态变化、主谓一致、冠词误用、搭配错误等）
  topicId?: string;  // 主题ID（关联到具体的语法知识点）
  masteryLevel: number;  // 掌握度 0-100，根据复习次数和正确率计算
}

const STORAGE_KEY = '@wrong_book';

/**
 * 获取所有错题
 */
export async function getAllWrongQuestions(): Promise<WrongQuestion[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('获取错题失败:', error);
    return [];
  }
}

/**
 * 添加错题
 */
export async function addWrongQuestion(question: Omit<WrongQuestion, 'id' | 'timestamp' | 'reviewCount' | 'mastered' | 'masteryLevel'>): Promise<void> {
  try {
    const questions = await getAllWrongQuestions();
    const newQuestion: WrongQuestion = {
      ...question,
      id: `wrong_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      reviewCount: 0,
      mastered: false,
      masteryLevel: 0  // 初始掌握度为0
    };
    questions.unshift(newQuestion);  // 新错题放在最前面
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (error) {
    console.error('添加错题失败:', error);
  }
}

/**
 * 根据语法点ID获取错题
 */
export async function getWrongQuestionsByGrammarPoint(grammarPointId: string): Promise<WrongQuestion[]> {
  const questions = await getAllWrongQuestions();
  return questions.filter(q => q.grammarPointId === grammarPointId && !q.mastered);
}

/**
 * 标记错题为已掌握
 */
export async function markQuestionAsMastered(questionId: string): Promise<void> {
  try {
    const questions = await getAllWrongQuestions();
    const index = questions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      questions[index].mastered = true;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    }
  } catch (error) {
    console.error('标记错题失败:', error);
  }
}

/**
 * 更新错题复习记录
 */
export async function updateReviewRecord(questionId: string): Promise<void> {
  try {
    const questions = await getAllWrongQuestions();
    const index = questions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      questions[index].reviewCount += 1;
      questions[index].lastReviewTime = Date.now();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    }
  } catch (error) {
    console.error('更新复习记录失败:', error);
  }
}

/**
 * 删除错题
 */
export async function deleteWrongQuestion(questionId: string): Promise<void> {
  try {
    const questions = await getAllWrongQuestions();
    const filtered = questions.filter(q => q.id !== questionId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('删除错题失败:', error);
  }
}

/**
 * 清空错题本
 */
export async function clearWrongBook(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('清空错题本失败:', error);
  }
}

/**
 * 获取错题统计
 */
export async function getWrongBookStats() {
  const questions = await getAllWrongQuestions();
  const total = questions.length;
  const mastered = questions.filter(q => q.mastered).length;
  const unmastered = total - mastered;
  
  // 按语法点分组统计
  const byGrammarPoint: Record<string, { count: number; title: string }> = {};
  questions.forEach(q => {
    if (!q.mastered) {
      if (!byGrammarPoint[q.grammarPointId]) {
        byGrammarPoint[q.grammarPointId] = {
          count: 0,
          title: q.grammarPointTitle
        };
      }
      byGrammarPoint[q.grammarPointId].count += 1;
    }
  });

  return {
    total,
    mastered,
    unmastered,
    byGrammarPoint: Object.entries(byGrammarPoint)
      .map(([id, data]) => ({ grammarPointId: id, ...data }))
      .sort((a, b) => b.count - a.count)  // 按错题数量降序
  };
}

/**
 * 按分类获取错题
 */
export async function getWrongQuestionsByCategory(category: string): Promise<WrongQuestion[]> {
  const questions = await getAllWrongQuestions();
  return questions.filter(q => q.category === category && !q.mastered);
}

/**
 * 获取所有错误分类及统计
 */
export async function getWrongCategories() {
  const questions = await getAllWrongQuestions();
  const categories: Record<string, { count: number; avgMasteryLevel: number }> = {};
  
  questions.forEach(q => {
    if (!q.mastered && q.category) {
      if (!categories[q.category]) {
        categories[q.category] = { count: 0, avgMasteryLevel: 0 };
      }
      categories[q.category].count += 1;
      categories[q.category].avgMasteryLevel += q.masteryLevel;
    }
  });

  // 计算平均掌握度
  Object.keys(categories).forEach(cat => {
    if (categories[cat].count > 0) {
      categories[cat].avgMasteryLevel = Math.round(
        categories[cat].avgMasteryLevel / categories[cat].count
      );
    }
  });

  return Object.entries(categories)
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.count - a.count);  // 按错题数量降序
}

/**
 * 更新错题掌握度
 * @param questionId 错题ID
 * @param isCorrect 本次复习是否正确
 */
export async function updateMasteryLevel(questionId: string, isCorrect: boolean): Promise<void> {
  try {
    const questions = await getAllWrongQuestions();
    const index = questions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      const question = questions[index];
      
      // 更新复习记录
      question.reviewCount += 1;
      question.lastReviewTime = Date.now();
      
      // 计算新的掌握度
      // 正确: +20分, 错误: -10分, 范围0-100
      if (isCorrect) {
        question.masteryLevel = Math.min(100, question.masteryLevel + 20);
      } else {
        question.masteryLevel = Math.max(0, question.masteryLevel - 10);
      }
      
      // 如果掌握度达到80以上且复习次数>=3次,自动标记为已掌握
      if (question.masteryLevel >= 80 && question.reviewCount >= 3) {
        question.mastered = true;
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    }
  } catch (error) {
    console.error('更新掌握度失败:', error);
  }
}

/**
 * 获取需要复习的错题(根据间隔重复算法)
 * @param limit 返回数量限制
 */
export async function getQuestionsForReview(limit: number = 10): Promise<WrongQuestion[]> {
  const questions = await getAllWrongQuestions();
  const now = Date.now();
  
  // 筛选未掌握的错题
  const unmastered = questions.filter(q => !q.mastered);
  
  // 计算每个错题的优先级
  const withPriority = unmastered.map(q => {
    const daysSinceError = (now - q.timestamp) / (1000 * 60 * 60 * 24);
    const daysSinceReview = q.lastReviewTime 
      ? (now - q.lastReviewTime) / (1000 * 60 * 60 * 24)
      : daysSinceError;
    
    // 优先级计算:
    // 1. 掌握度越低优先级越高
    // 2. 距离上次复习时间越长优先级越高
    // 3. 复习次数越少优先级越高
    const priority = 
      (100 - q.masteryLevel) * 2 +  // 掌握度权重
      daysSinceReview * 10 +         // 时间间隔权重
      (5 - Math.min(q.reviewCount, 5)) * 5;  // 复习次数权重
    
    return { ...q, priority };
  });
  
  // 按优先级排序并返回前N个
  return withPriority
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}
