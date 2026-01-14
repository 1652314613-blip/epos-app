import { useState, useEffect } from "react";
import { ScrollView, Text, View, Platform, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import {
  getQuizHistory,
  getQuizStatistics,
  getRecentQuizData,
  type QuizHistoryItem,
} from "@/lib/quiz-history-storage";
import { getScoreRating } from "@/lib/vocabulary-quiz";

export default function QuizHistoryScreen() {
  const colors = useColors();
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [statistics, setStatistics] = useState<Awaited<ReturnType<typeof getQuizStatistics>> | null>(null);
  const [recentData, setRecentData] = useState<Awaited<ReturnType<typeof getRecentQuizData>>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [historyData, statsData, chartData] = await Promise.all([
        getQuizHistory(),
        getQuizStatistics(),
        getRecentQuizData(),
      ]);
      
      setHistory(historyData);
      setStatistics(statsData);
      setRecentData(chartData);
    } catch (error) {
      console.error("加载测试历史失败", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}分${secs}秒`;
  };

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-base text-muted mt-4">加载中...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!statistics || history.length === 0) {
    return (
      <ScreenContainer className="p-6">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 gap-6">
            {/* Back Button */}
            <AnimatedButton
              onPress={() => router.back()}
              variant="secondary"
              className="self-start px-4 py-2"
            >
              <Text className="text-primary font-semibold">← 返回</Text>
            </AnimatedButton>

            {/* Empty State */}
            <View className="flex-1 items-center justify-center gap-4">
              <Text className="text-6xl">📝</Text>
              <Text className="text-xl font-bold text-foreground">还没有测试记录</Text>
              <Text className="text-base text-muted text-center">
                完成词汇测试后，这里会显示你的学习进步
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const trendEmoji = statistics.recentTrend === "improving" ? "📈" : statistics.recentTrend === "declining" ? "📉" : "➡️";
  const trendText = statistics.recentTrend === "improving" ? "进步中" : statistics.recentTrend === "declining" ? "需加油" : "保持稳定";

  // 计算图表最大值
  const maxScore = Math.max(...recentData.map(d => d.averageScore), 100);

  return (
    <ScreenContainer className="p-6">
      <ScrollView>
        <View className="gap-6">
          {/* Back Button */}
          <AnimatedButton
            onPress={() => router.back()}
            variant="secondary"
            className="self-start px-4 py-2"
          >
            <Text className="text-primary font-semibold">← 返回</Text>
          </AnimatedButton>

          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">测试历史</Text>
            <Text className="text-sm text-muted">查看你的学习进步轨迹</Text>
          </View>

          {/* Statistics Cards */}
          <View className="gap-3">
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base font-semibold text-foreground">📊 总体统计</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-2xl">{trendEmoji}</Text>
                  <Text className="text-sm font-semibold text-primary">{trendText}</Text>
                </View>
              </View>
              
              <View className="flex-row flex-wrap gap-4">
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-2xl font-bold text-primary">{statistics.totalQuizzes}</Text>
                  <Text className="text-sm text-muted">测试次数</Text>
                </View>
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-2xl font-bold text-success">{statistics.averageScore}</Text>
                  <Text className="text-sm text-muted">平均分</Text>
                </View>
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-2xl font-bold text-warning">{statistics.highestScore}</Text>
                  <Text className="text-sm text-muted">最高分</Text>
                </View>
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-2xl font-bold text-foreground">
                    {Math.floor(statistics.totalTimeSpent / 60)}分钟
                  </Text>
                  <Text className="text-sm text-muted">累计用时</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Recent 7 Days Chart */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-base font-semibold text-foreground mb-4">📈 最近7天平均分</Text>
            
            <View className="gap-2">
              {recentData.map((day, index) => {
                const barHeight = day.averageScore > 0 ? (day.averageScore / maxScore) * 100 : 0;
                
                return (
                  <View key={index} className="flex-row items-center gap-2">
                    <Text className="text-xs text-muted w-12">{day.date}</Text>
                    <View className="flex-1 h-8 bg-border rounded-lg overflow-hidden flex-row items-center">
                      {day.averageScore > 0 && (
                        <View
                          style={{
                            width: `${barHeight}%`,
                            backgroundColor: day.averageScore >= 80 ? colors.success : day.averageScore >= 60 ? colors.warning : colors.error,
                          }}
                          className="h-full rounded-lg"
                        />
                      )}
                    </View>
                    <Text className="text-xs font-semibold text-foreground w-8 text-right">
                      {day.averageScore > 0 ? day.averageScore : "-"}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* History List */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">📝 历史记录</Text>
            
            {history.map((item, index) => {
              const rating = getScoreRating(item.score);
              
              return (
                <View
                  key={item.id}
                  className="bg-surface rounded-2xl p-4 border border-border gap-3"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {item.unitTitle}
                      </Text>
                      <Text className="text-xs text-muted">
                        {formatDate(item.completedAt)}
                      </Text>
                    </View>
                    
                    <View className="items-end">
                      <View className="flex-row items-center gap-1">
                        <Text className="text-2xl">{rating.emoji}</Text>
                        <Text className="text-2xl font-bold text-primary">{item.score}</Text>
                      </View>
                      <Text className="text-xs text-muted">{rating.rating}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center gap-1">
                      <Text className="text-success font-semibold">{item.correctCount}</Text>
                      <Text className="text-xs text-muted">正确</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-error font-semibold">
                        {item.totalCount - item.correctCount}
                      </Text>
                      <Text className="text-xs text-muted">错误</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-foreground font-semibold">{formatTime(item.timeSpent)}</Text>
                      <Text className="text-xs text-muted">用时</Text>
                    </View>
                  </View>
                  
                  {item.wrongWords.length > 0 && (
                    <View className="pt-2 border-t border-border">
                      <Text className="text-xs text-muted mb-1">错题单词：</Text>
                      <Text className="text-sm text-foreground">
                        {item.wrongWords.map(w => w.word).join(", ")}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
