import { getCheckHistory, CheckHistoryItem } from "./storage";
import { getAllWords, getVocabularyStats, VocabularyStats, Word } from "./vocabulary-storage";

export type LearningTrendData = {
  date: string;
  grammarChecks: number;
  vocabularyLearned: number;
};

export type VocabularyMasteryData = {
  level: string;
  count: number;
  percentage: number;
  color: string;
};

export type ErrorTypeData = {
  type: string;
  count: number;
  percentage: number;
};

export class ChartDataService {
  /**
   * 获取最近N天的学习趋势数据
   */
  static async getLearningTrendData(days: number = 7): Promise<LearningTrendData[]> {
    const history = await getCheckHistory();
    const words = await getAllWords();

    // 生成日期范围
    const dates: string[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }

    // 统计每天的数据
    const trendData: LearningTrendData[] = dates.map((date) => {
      // 统计当天的语法检查次数
      const grammarChecks = history.filter((item: any) => {
        const itemDate = new Date(item.timestamp).toISOString().split("T")[0];
        return itemDate === date;
      }).length;

      // 统计当天学习的单词数
      const vocabularyLearned = words.filter((word: any) => {
        const wordDate = new Date(word.addedAt).toISOString().split("T")[0];
        return wordDate === date;
      }).length;

      return {
        date,
        grammarChecks,
        vocabularyLearned,
      };
    });

    return trendData;
  }

  /**
   * 获取单词掌握度分布数据
   */
  static async getVocabularyMasteryData(): Promise<VocabularyMasteryData[]> {
    const words = await getAllWords();

    if (words.length === 0) {
      return [
        { level: "新词", count: 0, percentage: 0, color: "#EF4444" },
        { level: "学习中", count: 0, percentage: 0, color: "#F59E0B" },
        { level: "熟悉", count: 0, percentage: 0, color: "#3B82F6" },
        { level: "已掌握", count: 0, percentage: 0, color: "#22C55E" },
      ];
    }

    // 统计各级别单词数量
    const newWords = words.filter((w: any) => w.masteryLevel === "new").length;
    const learning = words.filter((w: any) => w.masteryLevel === "learning").length;
    const familiar = words.filter((w: any) => w.masteryLevel === "familiar").length;
    const mastered = words.filter((w: any) => w.masteryLevel === "mastered").length;

    const total = words.length;

    return [
      {
        level: "新词",
        count: newWords,
        percentage: Math.round((newWords / total) * 100),
        color: "#EF4444",
      },
      {
        level: "学习中",
        count: learning,
        percentage: Math.round((learning / total) * 100),
        color: "#F59E0B",
      },
      {
        level: "熟悉",
        count: familiar,
        percentage: Math.round((familiar / total) * 100),
        color: "#3B82F6",
      },
      {
        level: "已掌握",
        count: mastered,
        percentage: Math.round((mastered / total) * 100),
        color: "#22C55E",
      },
    ];
  }

  /**
   * 获取错误类型分布数据
   */
  static async getErrorTypeData(): Promise<ErrorTypeData[]> {
    const history = await getCheckHistory();

    // 统计所有错误类型
    const errorTypeCounts: Record<string, number> = {};
    let totalErrors = 0;

    history.forEach((item: any) => {
      if (item.result && item.result.errors) {
        item.result.errors.forEach((error: any) => {
          const type = error.type || "其他";
          errorTypeCounts[type] = (errorTypeCounts[type] || 0) + 1;
          totalErrors++;
        });
      }
    });

    if (totalErrors === 0) {
      return [];
    }

    // 转换为数组并排序
    const errorTypeData: ErrorTypeData[] = Object.entries(errorTypeCounts)
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / totalErrors) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // 只取前5个最常见的错误类型

    return errorTypeData;
  }

  /**
   * 格式化日期为简短显示（如 "1/15"）
   */
  static formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  /**
   * 获取学习统计摘要
   */
  static async getLearningSummary() {
    const history = await getCheckHistory();
    const words = await getAllWords();
    const stats = await getVocabularyStats();

    // 计算总错误数
    let totalErrors = 0;
    let totalCorrect = 0;
    history.forEach((item: any) => {
      if (item.result && item.result.errors) {
        totalErrors += item.result.errors.length;
      }
      if (item.result && item.result.errors && item.result.errors.length === 0) {
        totalCorrect++;
      }
    });

    const totalChecks = history.length;
    const correctRate =
      totalChecks > 0 ? Math.round((totalCorrect / totalChecks) * 100) : 0;

    return {
      totalChecks,
      totalErrors,
      correctRate,
      totalWords: words.length,
      masteredWords: stats.masteredWords,
      learningWords: stats.learningWords,
    };
  }
}
