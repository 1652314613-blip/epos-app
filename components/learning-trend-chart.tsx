import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { ChartDataService, LearningTrendData } from "@/lib/chart-data";
import { useColors } from "@/hooks/use-colors";

export function LearningTrendChart() {
  const colors = useColors();
  const [trendData, setTrendData] = useState<LearningTrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await ChartDataService.getLearningTrendData(7);
      setTrendData(data);
    } catch (error) {
      console.error("Failed to load trend data:", error);
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

  if (trendData.length === 0) {
    return (
      <View className="bg-surface rounded-2xl p-4 border border-border">
        <Text className="text-base text-muted">暂无学习数据</Text>
      </View>
    );
  }

  // 计算最大值用于缩放
  const maxValue = Math.max(
    ...trendData.map((d) => Math.max(d.grammarChecks, d.vocabularyLearned)),
    1
  );

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border">
      <Text className="text-lg font-semibold text-foreground mb-4">
        📈 最近7天学习趋势
      </Text>
      
      {/* 图例 */}
      <View className="flex-row justify-center gap-6 mb-4">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full bg-[#3B82F6]" />
          <Text className="text-sm text-muted">语法检查</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-full bg-[#22C55E]" />
          <Text className="text-sm text-muted">单词学习</Text>
        </View>
      </View>

      {/* 简单柱状图 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row items-end gap-3 py-2" style={{ minWidth: 320 }}>
          {trendData.map((data, index) => {
            const grammarHeight = Math.max((data.grammarChecks / maxValue) * 100, 4);
            const vocabHeight = Math.max((data.vocabularyLearned / maxValue) * 100, 4);
            
            return (
              <View key={index} className="items-center gap-2" style={{ width: 40 }}>
                {/* 柱子容器 */}
                <View className="flex-row items-end gap-1" style={{ height: 120 }}>
                  {/* 语法检查柱子 */}
                  <View 
                    className="bg-[#3B82F6] rounded-t"
                    style={{ 
                      width: 16, 
                      height: grammarHeight,
                    }}
                  />
                  {/* 单词学习柱子 */}
                  <View 
                    className="bg-[#22C55E] rounded-t"
                    style={{ 
                      width: 16, 
                      height: vocabHeight,
                    }}
                  />
                </View>
                
                {/* 日期标签 */}
                <Text className="text-xs text-muted">
                  {ChartDataService.formatDateShort(data.date)}
                </Text>
                
                {/* 数值标签 */}
                {(data.grammarChecks > 0 || data.vocabularyLearned > 0) && (
                  <Text className="text-xs text-muted">
                    {data.grammarChecks + data.vocabularyLearned}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
