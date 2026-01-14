import AsyncStorage from "@react-native-async-storage/async-storage";
import type { QuizResult } from "./vocabulary-quiz";

const QUIZ_HISTORY_KEY = "quiz_history";

export interface QuizHistoryItem extends QuizResult {
  id: string;
  unitTitle: string;
}

/**
 * 保存测试结果到历史记录
 */
export async function saveQuizHistory(
  result: QuizResult,
  unitTitle: string
): Promise<void> {
  try {
    const history = await getQuizHistory();
    
    const historyItem: QuizHistoryItem = {
      ...result,
      id: `${result.quizId}_${Date.now()}`,
      unitTitle,
    };
    
    history.unshift(historyItem); // 最新的放在前面
    
    // 只保留最近100条记录
    const trimmedHistory = history.slice(0, 100);
    
    await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("保存测试历史失败", error);
  }
}

/**
 * 获取所有测试历史记录
 */
export async function getQuizHistory(): Promise<QuizHistoryItem[]> {
  try {
    const data = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
    if (!data) return [];
    
    const history = JSON.parse(data) as QuizHistoryItem[];
    
    // 转换日期字符串为Date对象
    return history.map(item => ({
      ...item,
      completedAt: new Date(item.completedAt),
    }));
  } catch (error) {
    console.error("读取测试历史失败", error);
    return [];
  }
}

/**
 * 获取指定单元的测试历史
 */
export async function getQuizHistoryByUnit(
  grade: number,
  book: string,
  unit: number
): Promise<QuizHistoryItem[]> {
  const history = await getQuizHistory();
  return history.filter(
    item => item.grade === grade && item.book === book && item.unit === unit
  );
}

/**
 * 获取测试统计数据
 */
export async function getQuizStatistics(): Promise<{
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalTimeSpent: number; // 秒
  recentTrend: "improving" | "declining" | "stable";
}> {
  const history = await getQuizHistory();
  
  if (history.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      totalTimeSpent: 0,
      recentTrend: "stable",
    };
  }
  
  const scores = history.map(item => item.score);
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const averageScore = Math.round(totalScore / scores.length);
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);
  const totalTimeSpent = history.reduce((sum, item) => sum + item.timeSpent, 0);
  
  // 计算最近趋势（比较最近5次和之前5次的平均分）
  let recentTrend: "improving" | "declining" | "stable" = "stable";
  if (history.length >= 10) {
    const recent5 = history.slice(0, 5).map(item => item.score);
    const previous5 = history.slice(5, 10).map(item => item.score);
    
    const recentAvg = recent5.reduce((sum, score) => sum + score, 0) / 5;
    const previousAvg = previous5.reduce((sum, score) => sum + score, 0) / 5;
    
    if (recentAvg > previousAvg + 5) {
      recentTrend = "improving";
    } else if (recentAvg < previousAvg - 5) {
      recentTrend = "declining";
    }
  }
  
  return {
    totalQuizzes: history.length,
    averageScore,
    highestScore,
    lowestScore,
    totalTimeSpent,
    recentTrend,
  };
}

/**
 * 获取最近7天的测试数据（用于图表）
 */
export async function getRecentQuizData(): Promise<
  Array<{
    date: string;
    count: number;
    averageScore: number;
  }>
> {
  const history = await getQuizHistory();
  const now = new Date();
  const last7Days: Array<{ date: string; count: number; averageScore: number }> = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    
    const dayQuizzes = history.filter(item => {
      const itemDate = new Date(item.completedAt);
      return (
        itemDate.getFullYear() === date.getFullYear() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getDate() === date.getDate()
      );
    });
    
    const count = dayQuizzes.length;
    const averageScore =
      count > 0
        ? Math.round(
            dayQuizzes.reduce((sum, item) => sum + item.score, 0) / count
          )
        : 0;
    
    last7Days.push({ date: dateStr, count, averageScore });
  }
  
  return last7Days;
}

/**
 * 清除所有测试历史
 */
export async function clearQuizHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(QUIZ_HISTORY_KEY);
  } catch (error) {
    console.error("清除测试历史失败", error);
  }
}
