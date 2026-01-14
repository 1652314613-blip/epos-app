import { useState, useCallback } from "react";
import { ScrollView, Text, View, TouchableOpacity, Platform, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router, useFocusEffect } from "expo-router";
import {
  getWrongBook,
  removeFromWrongBook,
  markAsMastered,
  type WrongBookItem,
} from "@/lib/storage";
import {
  updateReviewStatuses,
  markAsReviewed,
  getReviewStats,
  getPredictedImprovement,
} from "@/services/review-service";
import {
  getStatusLabel,
  getStatusColor,
  getDaysUntilReview,
  getProgressPercentage,
} from "@/lib/ebbinghaus-algorithm";

export default function WrongBookScreen() {
  const colors = useColors();
  const [wrongBook, setWrongBook] = useState<WrongBookItem[]>([]);
  const [filter, setFilter] = useState<"all" | "due" | "pending" | "mastered">("due");
  const [stats, setStats] = useState({
    totalItems: 0,
    dueToday: 0,
    overdue: 0,
    mastered: 0,
    pending: 0,
  });
  const [improvement, setImprovement] = useState({
    currentMastery: 0,
    potentialImprovement: 0,
    estimatedScoreGain: 0,
  });

  // Reload data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    // Update review statuses first
    await updateReviewStatuses();

    // Load data
    const data = await getWrongBook();
    setWrongBook(data);

    // Load stats
    const reviewStats = await getReviewStats();
    setStats(reviewStats);

    // Load improvement prediction
    const improvementData = await getPredictedImprovement();
    setImprovement(improvementData);
  };

  const handleDelete = (id: string) => {
    if (Platform.OS === "web") {
      if (confirm("确定要删除这个错题吗？")) {
        performDelete(id);
      }
    } else {
      Alert.alert("删除错题", "确定要删除这个错题吗？", [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: () => performDelete(id),
        },
      ]);
    }
  };

  const performDelete = async (id: string) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await removeFromWrongBook(id);
    await loadData();
  };

  const handleMarkMastered = async (id: string) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await markAsMastered(id);
    await loadData();
  };

  const handleViewDetail = (item: WrongBookItem) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push({
      pathname: "/check-result" as any,
      params: {
        result: JSON.stringify(item.result),
      },
    });
  };

  const handlePractice = async (item: WrongBookItem) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Mark as reviewed when practicing
    await markAsReviewed(item.id);

    router.push({
      pathname: "/practice" as any,
      params: {
        wrongBookItemId: item.id,
        errorTypes: JSON.stringify(item.result.errors.map((e) => e.type)),
      },
    });

    // Reload data after navigation
    setTimeout(() => loadData(), 500);
  };

  const filteredItems = wrongBook.filter((item) => {
    if (filter === "due") return item.reviewStatus === "due" || item.reviewStatus === "overdue";
    if (filter === "pending") return item.reviewStatus === "pending";
    if (filter === "mastered") return item.reviewStatus === "mastered";
    return true;
  });

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="p-6 gap-5">
          {/* Header */}
          <View className="pt-4">
            <Text className="text-3xl font-bold text-foreground">智能错题本</Text>
            <Text className="text-base text-muted mt-1">
              基于艾宾浩斯遗忘曲线的智能复习计划
            </Text>
          </View>

          {/* Improvement Prediction Card */}
          {wrongBook.length > 0 && (
            <View
              className="rounded-2xl p-5 border"
              style={{
                backgroundColor: `${colors.primary}10`,
                borderColor: `${colors.primary}40`,
              }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold text-foreground">📈 提分预测</Text>
                <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                  预计提升 {improvement.estimatedScoreGain} 分
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="mb-2">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-xs text-muted">当前掌握度</Text>
                  <Text className="text-xs font-medium text-foreground">
                    {improvement.currentMastery}%
                  </Text>
                </View>
                <View className="h-2 bg-surface rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${improvement.currentMastery}%`,
                      backgroundColor: colors.success,
                    }}
                  />
                </View>
              </View>

              <Text className="text-xs text-muted mt-2">
                完成所有复习计划后，你的语法准确率预计提升 {improvement.potentialImprovement}%
              </Text>
            </View>
          )}

          {/* Stats Cards */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border items-center">
              <Text className="text-2xl font-bold text-warning">
                {stats.dueToday + stats.overdue}
              </Text>
              <Text className="text-xs text-muted mt-1">今日待复习</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border items-center">
              <Text className="text-2xl font-bold text-muted">{stats.pending}</Text>
              <Text className="text-xs text-muted mt-1">计划中</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border items-center">
              <Text className="text-2xl font-bold text-success">{stats.mastered}</Text>
              <Text className="text-xs text-muted mt-1">已掌握</Text>
            </View>
          </View>

          {/* Filter Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setFilter("due");
                }}
                style={{
                  backgroundColor: filter === "due" ? colors.warning : colors.surface,
                  borderColor: filter === "due" ? colors.warning : colors.border,
                  borderWidth: 1,
                }}
                className="px-4 py-2 rounded-full"
              >
                <Text
                  style={{
                    color: filter === "due" ? "#ffffff" : colors.foreground,
                  }}
                  className="font-semibold text-sm"
                >
                  今日复习 ({stats.dueToday + stats.overdue})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setFilter("pending");
                }}
                style={{
                  backgroundColor: filter === "pending" ? colors.primary : colors.surface,
                  borderColor: filter === "pending" ? colors.primary : colors.border,
                  borderWidth: 1,
                }}
                className="px-4 py-2 rounded-full"
              >
                <Text
                  style={{
                    color: filter === "pending" ? "#ffffff" : colors.foreground,
                  }}
                  className="font-semibold text-sm"
                >
                  计划中 ({stats.pending})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setFilter("mastered");
                }}
                style={{
                  backgroundColor: filter === "mastered" ? colors.success : colors.surface,
                  borderColor: filter === "mastered" ? colors.success : colors.border,
                  borderWidth: 1,
                }}
                className="px-4 py-2 rounded-full"
              >
                <Text
                  style={{
                    color: filter === "mastered" ? "#ffffff" : colors.foreground,
                  }}
                  className="font-semibold text-sm"
                >
                  已掌握 ({stats.mastered})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setFilter("all");
                }}
                style={{
                  backgroundColor: filter === "all" ? colors.primary : colors.surface,
                  borderColor: filter === "all" ? colors.primary : colors.border,
                  borderWidth: 1,
                }}
                className="px-4 py-2 rounded-full"
              >
                <Text
                  style={{
                    color: filter === "all" ? "#ffffff" : colors.foreground,
                  }}
                  className="font-semibold text-sm"
                >
                  全部 ({wrongBook.length})
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Wrong Book Items */}
          <View>
            {filteredItems.length === 0 ? (
              <View className="bg-surface rounded-2xl p-8 border border-border items-center">
                <Text className="text-base text-muted">
                  {filter === "due" && "暂无今日待复习的错题"}
                  {filter === "pending" && "暂无计划中的错题"}
                  {filter === "mastered" && "暂无已掌握的错题"}
                  {filter === "all" && "暂无错题"}
                </Text>
                <Text className="text-sm text-muted mt-2">
                  {filter === "due" && "太棒了！今天没有需要复习的错题"}
                  {filter === "pending" && ""}
                  {filter === "mastered" && ""}
                  {filter === "all" && "继续检查句子来发现需要改进的地方"}
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {filteredItems.map((item) => {
                  const statusLabel = getStatusLabel(item.reviewStatus);
                  const statusColor = getStatusColor(item.reviewStatus);
                  const daysUntil = getDaysUntilReview(new Date(item.nextReviewDate));
                  const progress = getProgressPercentage(item.reviewCount);

                  return (
                    <View key={item.id} className="bg-surface rounded-2xl p-5 border border-border">
                      {/* Header */}
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center gap-2 flex-1">
                          <View
                            className="px-3 py-1 rounded-full"
                            style={{ backgroundColor: `${statusColor}20` }}
                          >
                            <Text className="text-xs font-medium" style={{ color: statusColor }}>
                              {statusLabel}
                            </Text>
                          </View>
                          <View
                            className="px-3 py-1 rounded-full"
                            style={{ backgroundColor: `${colors.error}20` }}
                          >
                            <Text className="text-xs font-medium" style={{ color: colors.error }}>
                              {item.result.errors.length} 个错误
                            </Text>
                          </View>
                        </View>
                        <Text className="text-xs text-muted">
                          {new Date(item.timestamp).toLocaleDateString("zh-CN")}
                        </Text>
                      </View>

                      {/* Review Progress */}
                      {!item.mastered && (
                        <View className="mb-3">
                          <View className="flex-row justify-between mb-1">
                            <Text className="text-xs text-muted">
                              复习进度 ({item.reviewCount}/4)
                            </Text>
                            {item.reviewStatus === "pending" && daysUntil > 0 && (
                              <Text className="text-xs text-muted">{daysUntil} 天后复习</Text>
                            )}
                            {item.reviewStatus === "overdue" && (
                              <Text className="text-xs" style={{ color: colors.error }}>
                                逾期 {Math.abs(daysUntil)} 天
                              </Text>
                            )}
                          </View>
                          <View className="h-1.5 bg-background rounded-full overflow-hidden">
                            <View
                              className="h-full rounded-full"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: statusColor,
                              }}
                            />
                          </View>
                        </View>
                      )}

                      {/* Sentence */}
                      <TouchableOpacity onPress={() => handleViewDetail(item)}>
                        <Text className="text-sm text-foreground leading-relaxed mb-3">
                          {item.result.original}
                        </Text>
                      </TouchableOpacity>

                      {/* Error Types */}
                      <View className="flex-row flex-wrap gap-2 mb-3">
                        {Array.from(new Set(item.result.errors.map((e) => e.category))).map(
                          (category) => (
                            <View
                              key={category}
                              className="px-2 py-1 rounded"
                              style={{ backgroundColor: `${colors.muted}20` }}
                            >
                              <Text className="text-xs text-muted">{category}</Text>
                            </View>
                          )
                        )}
                      </View>

                      {/* Actions */}
                      <View className="flex-row gap-2">
                        <TouchableOpacity
                          onPress={() => handlePractice(item)}
                          className="flex-1 py-2 rounded-full items-center"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <Text className="text-white font-medium text-sm">
                            {item.reviewStatus === "due" || item.reviewStatus === "overdue"
                              ? "开始复习"
                              : "AI练习"}
                          </Text>
                        </TouchableOpacity>

                        {!item.mastered && (
                          <TouchableOpacity
                            onPress={() => handleMarkMastered(item.id)}
                            className="flex-1 py-2 rounded-full items-center"
                            style={{ backgroundColor: `${colors.success}20` }}
                          >
                            <Text className="font-medium text-sm" style={{ color: colors.success }}>
                              标记掌握
                            </Text>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          onPress={() => handleDelete(item.id)}
                          className="px-4 py-2 rounded-full items-center"
                          style={{ backgroundColor: `${colors.error}20` }}
                        >
                          <Text className="font-medium text-sm" style={{ color: colors.error }}>
                            删除
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
