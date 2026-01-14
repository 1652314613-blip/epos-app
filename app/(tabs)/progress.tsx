import { useState, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getProgressData, type ProgressData } from "@/lib/storage";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function ProgressScreen() {
  const colors = useColors();
  const [progress, setProgress] = useState<ProgressData | null>(null);

  // Reload data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const data = await getProgressData();
    setProgress(data);
  };

  const accuracyRate =
    progress && progress.totalChecks > 0
      ? Math.round((progress.correctChecks / progress.totalChecks) * 100)
      : 0;

  // Get top 3 error types
  const topErrors = progress
    ? Object.entries(progress.errorTypeCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
    : [];

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="p-6 gap-5">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">你的进度</Text>
            <Text className="text-base text-muted mt-1">追踪你的学习路程</Text>
          </View>

          {/* Streak Card */}
          <View className="bg-surface rounded-2xl p-6 border border-border items-center">
            <Text className="text-5xl mb-2">🔥</Text>
            <Text className="text-4xl font-bold text-primary">{progress?.currentStreak || 0}</Text>
            <Text className="text-sm text-muted mt-1">连续天数</Text>
            <Text className="text-xs text-muted mt-2">
              {progress?.currentStreak === 0
                ? "Start your streak today!"
                : "Keep learning every day!"}
            </Text>
          </View>

          {/* Stats Grid */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">统计数据</Text>
            <View className="gap-3">
              <View className="flex-row gap-3">
                <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
                  <Text className="text-3xl font-bold text-primary">{progress?.totalChecks || 0}</Text>
                  <Text className="text-sm text-muted mt-1">已检查</Text>
                </View>
                <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
                  <Text className="text-3xl font-bold text-success">{accuracyRate}%</Text>
                  <Text className="text-sm text-muted mt-1">正确率</Text>
                </View>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
                  <Text className="text-3xl font-bold text-warning">{progress?.longestStreak || 0}</Text>
                  <Text className="text-sm text-muted mt-1">最长连续</Text>
                </View>
                <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
                  <Text className="text-3xl font-bold text-error">
                    {Object.values(progress?.errorTypeCount || {}).reduce((a, b) => a + b, 0)}
                  </Text>
                  <Text className="text-sm text-muted mt-1">已修正</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Common Errors */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">常见错误类型</Text>
            {topErrors.length === 0 ? (
              <View className="bg-surface rounded-2xl p-6 border border-border items-center">
                <Text className="text-sm text-muted">暂无数据</Text>
                <Text className="text-xs text-muted mt-1">
                  检查一些句子来查看你的错误模式
                </Text>
              </View>
            ) : (
              <View className="bg-surface rounded-2xl p-5 border border-border gap-3">
                {topErrors.map(([type, count], index) => (
                  <View key={type} className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View
                        className="w-8 h-8 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${colors.error}20` }}
                      >
                        <Text className="text-sm font-bold" style={{ color: colors.error }}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text className="text-sm text-foreground flex-1">
                        {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Text>
                    </View>
                    <Text className="text-lg font-bold text-primary">{count}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Achievements */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">Achievements</Text>
            <View className="bg-surface rounded-2xl p-6 border border-border">
              <View className="flex-row flex-wrap gap-4 justify-center">
                <View className="items-center">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${colors.muted}20` }}
                  >
                    <Text className="text-3xl">🏆</Text>
                  </View>
                  <Text className="text-xs text-muted mt-2">First Check</Text>
                </View>

                <View className="items-center opacity-40">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${colors.muted}20` }}
                  >
                    <Text className="text-3xl">⭐</Text>
                  </View>
                  <Text className="text-xs text-muted mt-2">10 Checks</Text>
                </View>

                <View className="items-center opacity-40">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${colors.muted}20` }}
                  >
                    <Text className="text-3xl">💎</Text>
                  </View>
                  <Text className="text-xs text-muted mt-2">Perfect Week</Text>
                </View>

                <View className="items-center opacity-40">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${colors.muted}20` }}
                  >
                    <Text className="text-3xl">🎯</Text>
                  </View>
                  <Text className="text-xs text-muted mt-2">100% Accuracy</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Weekly Activity */}
          <View>
            <Text className="text-lg font-semibold text-foreground mb-3">This Week</Text>
            <View className="bg-surface rounded-2xl p-5 border border-border">
              <View className="flex-row justify-between items-end h-32">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                  <View key={day} className="items-center flex-1">
                    <View
                      className="w-8 rounded-t-lg"
                      style={{
                        height: 20,
                        backgroundColor: `${colors.primary}30`,
                      }}
                    />
                    <Text className="text-xs text-muted mt-2">{day}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
