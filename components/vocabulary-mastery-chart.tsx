import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { ChartDataService, VocabularyMasteryData } from "@/lib/chart-data";
import { useColors } from "@/hooks/use-colors";

export function VocabularyMasteryChart() {
  const colors = useColors();
  const [masteryData, setMasteryData] = useState<VocabularyMasteryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await ChartDataService.getVocabularyMasteryData();
      setMasteryData(data);
    } catch (error) {
      console.error("Failed to load mastery data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="bg-surface rounded-2xl p-4 border border-border">
        <Text className="text-base text-muted">加载中...</Text>
      </View>
    );
  }

  const totalWords = masteryData.reduce((sum, item) => sum + item.count, 0);

  if (totalWords === 0) {
    return (
      <View className="bg-surface rounded-2xl p-4 border border-border">
        <Text className="text-lg font-semibold text-foreground mb-2">
          📊 单词掌握度分布
        </Text>
        <Text className="text-base text-muted">还没有学习单词，快去添加吧！</Text>
      </View>
    );
  }

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border">
      <Text className="text-lg font-semibold text-foreground mb-4">
        📊 单词掌握度分布
      </Text>

      {/* 堆叠进度条 */}
      <View className="mb-4">
        <View className="flex-row h-8 rounded-full overflow-hidden">
          {masteryData.map((item, index) => {
            if (item.count === 0) return null;
            return (
              <View
                key={item.level}
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            );
          })}
        </View>
      </View>

      {/* 详细统计 */}
      <View className="gap-3">
        {masteryData.map((item) => (
          <View key={item.level} className="gap-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <Text className="text-sm font-medium text-foreground">
                  {item.level}
                </Text>
              </View>
              <Text className="text-sm text-muted">
                {item.count} 个 ({item.percentage}%)
              </Text>
            </View>
            
            {/* 单独的进度条 */}
            <View className="bg-background rounded-full h-2 overflow-hidden">
              <View
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                  height: "100%",
                }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* 总计 */}
      <View className="mt-4 pt-4 border-t border-border">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-foreground">
            单词总数
          </Text>
          <Text className="text-xl font-bold text-primary">
            {totalWords}
          </Text>
        </View>
      </View>
    </View>
  );
}
