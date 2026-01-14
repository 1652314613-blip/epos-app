import { describe, it, expect, beforeEach, vi } from "vitest";
import { ChartDataService } from "@/lib/chart-data";
import * as storage from "@/lib/storage";
import * as vocabularyStorage from "@/lib/vocabulary-storage";

// Mock storage modules
vi.mock("@/lib/storage", () => ({
  getCheckHistory: vi.fn(),
}));

vi.mock("@/lib/vocabulary-storage", () => ({
  getAllWords: vi.fn(),
  getVocabularyStats: vi.fn(),
}));

describe("ChartDataService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLearningTrendData", () => {
    it("应该返回最近7天的学习趋势数据", async () => {
      const mockHistory = [
        {
          id: "1",
          sentence: "Test sentence",
          result: { errors: [] },
          timestamp: new Date().toISOString(),
        },
      ];

      const mockWords = [
        {
          word: "test",
          masteryLevel: "new",
          addedAt: new Date().toISOString(),
        },
      ];

      vi.mocked(storage.getCheckHistory).mockResolvedValue(mockHistory as any);
      vi.mocked(vocabularyStorage.getAllWords).mockResolvedValue(mockWords as any);

      const result = await ChartDataService.getLearningTrendData(7);

      expect(result).toHaveLength(7);
      expect(result[0]).toHaveProperty("date");
      expect(result[0]).toHaveProperty("grammarChecks");
      expect(result[0]).toHaveProperty("vocabularyLearned");
    });

    it("应该正确统计每天的语法检查次数", async () => {
      const today = new Date();
      const mockHistory = [
        {
          id: "1",
          sentence: "Test 1",
          result: { errors: [] },
          timestamp: today.toISOString(),
        },
        {
          id: "2",
          sentence: "Test 2",
          result: { errors: [] },
          timestamp: today.toISOString(),
        },
      ];

      vi.mocked(storage.getCheckHistory).mockResolvedValue(mockHistory as any);
      vi.mocked(vocabularyStorage.getAllWords).mockResolvedValue([]);

      const result = await ChartDataService.getLearningTrendData(7);
      const todayData = result[result.length - 1];

      expect(todayData.grammarChecks).toBe(2);
    });
  });

  describe("getVocabularyMasteryData", () => {
    it("应该返回单词掌握度分布数据", async () => {
      const mockWords = [
        { word: "word1", masteryLevel: "new", addedAt: new Date().toISOString() },
        { word: "word2", masteryLevel: "learning", addedAt: new Date().toISOString() },
        { word: "word3", masteryLevel: "familiar", addedAt: new Date().toISOString() },
        { word: "word4", masteryLevel: "mastered", addedAt: new Date().toISOString() },
      ];

      vi.mocked(vocabularyStorage.getAllWords).mockResolvedValue(mockWords as any);

      const result = await ChartDataService.getVocabularyMasteryData();

      expect(result).toHaveLength(4);
      expect(result[0]).toHaveProperty("level");
      expect(result[0]).toHaveProperty("count");
      expect(result[0]).toHaveProperty("percentage");
      expect(result[0]).toHaveProperty("color");
    });

    it("应该正确计算各级别单词的百分比", async () => {
      const mockWords = [
        { word: "word1", masteryLevel: "new", addedAt: new Date().toISOString() },
        { word: "word2", masteryLevel: "new", addedAt: new Date().toISOString() },
        { word: "word3", masteryLevel: "mastered", addedAt: new Date().toISOString() },
        { word: "word4", masteryLevel: "mastered", addedAt: new Date().toISOString() },
      ];

      vi.mocked(vocabularyStorage.getAllWords).mockResolvedValue(mockWords as any);

      const result = await ChartDataService.getVocabularyMasteryData();
      const newWords = result.find((item) => item.level === "新词");
      const masteredWords = result.find((item) => item.level === "已掌握");

      expect(newWords?.count).toBe(2);
      expect(newWords?.percentage).toBe(50);
      expect(masteredWords?.count).toBe(2);
      expect(masteredWords?.percentage).toBe(50);
    });

    it("当没有单词时应该返回空数据", async () => {
      vi.mocked(vocabularyStorage.getAllWords).mockResolvedValue([]);

      const result = await ChartDataService.getVocabularyMasteryData();

      expect(result).toHaveLength(4);
      expect(result.every((item) => item.count === 0)).toBe(true);
    });
  });

  describe("getErrorTypeData", () => {
    it("应该返回错误类型分布数据", async () => {
      const mockHistory = [
        {
          id: "1",
          sentence: "Test",
          result: {
            errors: [
              { type: "grammar", message: "Error 1" },
              { type: "grammar", message: "Error 2" },
              { type: "spelling", message: "Error 3" },
            ],
          },
          timestamp: new Date().toISOString(),
        },
      ];

      vi.mocked(storage.getCheckHistory).mockResolvedValue(mockHistory as any);

      const result = await ChartDataService.getErrorTypeData();

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("type");
      expect(result[0]).toHaveProperty("count");
      expect(result[0]).toHaveProperty("percentage");
    });

    it("应该按错误数量降序排序", async () => {
      const mockHistory = [
        {
          id: "1",
          sentence: "Test",
          result: {
            errors: [
              { type: "grammar", message: "Error 1" },
              { type: "grammar", message: "Error 2" },
              { type: "spelling", message: "Error 3" },
            ],
          },
          timestamp: new Date().toISOString(),
        },
      ];

      vi.mocked(storage.getCheckHistory).mockResolvedValue(mockHistory as any);

      const result = await ChartDataService.getErrorTypeData();

      if (result.length > 1) {
        expect(result[0].count).toBeGreaterThanOrEqual(result[1].count);
      }
    });

    it("当没有错误时应该返回空数组", async () => {
      vi.mocked(storage.getCheckHistory).mockResolvedValue([]);

      const result = await ChartDataService.getErrorTypeData();

      expect(result).toEqual([]);
    });
  });

  describe("formatDateShort", () => {
    it("应该正确格式化日期", () => {
      const date = "2024-01-15T12:00:00Z";
      const result = ChartDataService.formatDateShort(date);

      // 验证格式是否正确（月/日）
      expect(result).toMatch(/^\d{1,2}\/\d{1,2}$/);
    });
  });

  describe("getLearningSummary", () => {
    it("应该返回完整的学习统计摘要", async () => {
      const mockHistory = [
        {
          id: "1",
          sentence: "Test 1",
          result: { errors: [] },
          timestamp: new Date().toISOString(),
        },
        {
          id: "2",
          sentence: "Test 2",
          result: { errors: [{ type: "grammar", message: "Error" }] },
          timestamp: new Date().toISOString(),
        },
      ];

      const mockWords = [
        { word: "word1", masteryLevel: "new", addedAt: new Date().toISOString() },
        { word: "word2", masteryLevel: "mastered", addedAt: new Date().toISOString() },
      ];

      const mockStats = {
        totalWords: 2,
        newWords: 1,
        learningWords: 0,
        familiarWords: 0,
        masteredWords: 1,
      };

      vi.mocked(storage.getCheckHistory).mockResolvedValue(mockHistory as any);
      vi.mocked(vocabularyStorage.getAllWords).mockResolvedValue(mockWords as any);
      vi.mocked(vocabularyStorage.getVocabularyStats).mockResolvedValue(mockStats as any);

      const result = await ChartDataService.getLearningSummary();

      expect(result).toHaveProperty("totalChecks");
      expect(result).toHaveProperty("totalErrors");
      expect(result).toHaveProperty("correctRate");
      expect(result).toHaveProperty("totalWords");
      expect(result).toHaveProperty("masteredWords");
      expect(result).toHaveProperty("learningWords");

      expect(result.totalChecks).toBe(2);
      expect(result.totalWords).toBe(2);
      expect(result.correctRate).toBe(50); // 1 correct out of 2
    });
  });
});
