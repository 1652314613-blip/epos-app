import { useState, useEffect } from "react";
import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedListItem } from "@/components/animated-list-item";
import { generateScoreImprovementReport, type ScoreImprovementReport } from "@/services/score-improvement-service";
import { Ionicons } from "@expo/vector-icons";

export default function ScoreReportScreen() {
  const colors = useColors();
  const [report, setReport] = useState<ScoreImprovementReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const data = await generateScoreImprovementReport();
      setReport(data);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="p-6 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-sm text-muted mt-4">正在生成提分报告...</Text>
      </ScreenContainer>
    );
  }

  if (!report) {
    return (
      <ScreenContainer className="p-6 items-center justify-center">
        <Text className="text-lg text-foreground">暂无数据</Text>
        <Text className="text-sm text-muted mt-2">请先完成一些语法检查</Text>
      </ScreenContainer>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "高级": return "#10B981";
      case "中级": return "#F59E0B";
      case "初级": return "#3B82F6";
      default: return "#6B7280";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "#EF4444";
      case "medium": return "#F59E0B";
      default: return "#10B981";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "mastered": return "#10B981";
      case "learning": return "#F59E0B";
      default: return "#EF4444";
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">我的提分报告</Text>
            <Text className="text-sm text-muted">基于你的学习数据生成</Text>
          </View>

          {/* Overall Score Card */}
          <View className="bg-gradient-to-br rounded-3xl p-6 border-2" style={{ backgroundColor: colors.primary + "10", borderColor: colors.primary }}>
            <View className="items-center gap-4">
              <View className="flex-row items-end gap-2">
                <Text className="text-6xl font-bold" style={{ color: colors.primary }}>
                  {report.overallScore}
                </Text>
                <Text className="text-2xl font-semibold text-muted mb-2">分</Text>
              </View>
              
              <View className="flex-row items-center gap-2">
                <View className="px-4 py-2 rounded-full" style={{ backgroundColor: getLevelColor(report.currentLevel) }}>
                  <Text className="text-sm font-bold text-white">{report.currentLevel}</Text>
                </View>
              </View>

              {report.potentialGain > 0 && (
                <View className="bg-white rounded-2xl p-4 w-full">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-xs text-muted">预计提分空间</Text>
                      <Text className="text-3xl font-bold" style={{ color: "#10B981" }}>
                        +{report.potentialGain}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-xs text-muted">目标分数</Text>
                      <Text className="text-3xl font-bold text-foreground">
                        {report.targetScore}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Progress Stats */}
          <View className="bg-surface rounded-2xl p-5 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">📊 学习统计</Text>
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">累计检查</Text>
                <Text className="text-base font-semibold text-foreground">{report.progressStats.totalChecks} 次</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">累计错误</Text>
                <Text className="text-base font-semibold text-foreground">{report.progressStats.totalErrors} 个</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">已纠正</Text>
                <Text className="text-base font-semibold text-success">{report.progressStats.correctedErrors} 个</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">平均分</Text>
                <Text className="text-base font-semibold text-foreground">{report.progressStats.averageScore} 分</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">学习天数</Text>
                <Text className="text-base font-semibold text-foreground">{report.progressStats.studyDays} 天</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">连续打卡</Text>
                <Text className="text-base font-semibold" style={{ color: colors.primary }}>{report.progressStats.streak} 天 🔥</Text>
              </View>
              {report.progressStats.improvementRate !== 0 && (
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted">进步率</Text>
                  <Text className="text-base font-semibold" style={{ color: report.progressStats.improvementRate > 0 ? "#10B981" : "#EF4444" }}>
                    {report.progressStats.improvementRate > 0 ? "+" : ""}{report.progressStats.improvementRate}%
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Weak Points */}
          {report.weakPoints.length > 0 && (
            <View className="gap-4">
              <Text className="text-lg font-semibold text-foreground">⚠️ 薄弱点分析</Text>
              {report.weakPoints.slice(0, 5).map((wp, index) => (
                <AnimatedListItem key={wp.category} index={index}>
                  <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <View
                          className="w-3 h-full rounded-l-xl"
                          style={{ backgroundColor: getPriorityColor(wp.priority) }}
                        />
                        <Text className="text-base font-semibold text-foreground">{wp.category}</Text>
                      </View>
                      <View className="px-3 py-1 rounded-full" style={{ backgroundColor: getPriorityColor(wp.priority) + "20" }}>
                        <Text className="text-xs font-semibold" style={{ color: getPriorityColor(wp.priority) }}>
                          {wp.priority === "high" ? "高优先级" : wp.priority === "medium" ? "中优先级" : "低优先级"}
                        </Text>
                      </View>
                    </View>
                    
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-xs text-muted">错误次数</Text>
                        <Text className="text-lg font-bold text-error">{wp.errorCount}</Text>
                      </View>
                      <View>
                        <Text className="text-xs text-muted">掌握度</Text>
                        <Text className="text-lg font-bold text-foreground">{wp.masteryLevel}%</Text>
                      </View>
                      <View>
                        <Text className="text-xs text-muted">预估失分</Text>
                        <Text className="text-lg font-bold" style={{ color: "#F59E0B" }}>-{wp.estimatedScoreLoss}</Text>
                      </View>
                    </View>
                  </View>
                </AnimatedListItem>
              ))}
            </View>
          )}

          {/* Recommendations */}
          {report.recommendations.length > 0 && (
            <View className="gap-4">
              <Text className="text-lg font-semibold text-foreground">💡 学习建议</Text>
              {report.recommendations.map((rec, index) => (
                <AnimatedListItem key={index} index={index}>
                  <TouchableOpacity
                    onPress={() => {
                      // TODO: 实现路由跳转
                      console.log("Navigate to:", rec.actionRoute);
                    }}
                    className="bg-surface rounded-2xl p-4 border border-border gap-3 active:opacity-80"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-base font-semibold text-foreground flex-1">{rec.title}</Text>
                      <View className="px-3 py-1 rounded-full" style={{ backgroundColor: "#10B981" + "20" }}>
                        <Text className="text-xs font-semibold" style={{ color: "#10B981" }}>
                          +{rec.estimatedImpact}分
                        </Text>
                      </View>
                    </View>
                    
                    <Text className="text-sm text-muted leading-relaxed">{rec.description}</Text>
                    
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                        {rec.actionText}
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                    </View>
                  </TouchableOpacity>
                </AnimatedListItem>
              ))}
            </View>
          )}

          {/* Grammar Mastery (Top 10) */}
          {report.grammarMastery.length > 0 && (
            <View className="gap-4">
              <Text className="text-lg font-semibold text-foreground">📚 知识点掌握情况 (前10)</Text>
              {report.grammarMastery.slice(0, 10).map((gm, index) => (
                <AnimatedListItem key={gm.id} index={index}>
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: "/grammar-point-detail",
                        params: { id: gm.id }
                      });
                    }}
                    className="bg-surface rounded-2xl p-4 border border-border gap-3 active:opacity-80"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 gap-1">
                        <Text className="text-base font-semibold text-foreground">{gm.title}</Text>
                        <Text className="text-xs text-muted">{gm.category}</Text>
                      </View>
                      {gm.examTag && (
                        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: "#F59E0B" + "20" }}>
                          <Text className="text-xs font-semibold" style={{ color: "#F59E0B" }}>
                            {gm.examTag}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <View className="flex-row items-center gap-4">
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text className="text-xs text-muted">掌握度</Text>
                          <Text className="text-xs font-semibold" style={{ color: getStatusColor(gm.status) }}>
                            {gm.masteryLevel}%
                          </Text>
                        </View>
                        <View className="h-2 bg-border rounded-full overflow-hidden">
                          <View
                            className="h-full rounded-full"
                            style={{
                              width: `${gm.masteryLevel}%`,
                              backgroundColor: getStatusColor(gm.status),
                            }}
                          />
                        </View>
                      </View>
                      
                      {gm.errorCount > 0 && (
                        <View className="items-center">
                          <Text className="text-xs text-muted">错误</Text>
                          <Text className="text-base font-bold text-error">{gm.errorCount}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </AnimatedListItem>
              ))}
            </View>
          )}

          {/* Refresh Button */}
          <TouchableOpacity
            onPress={loadReport}
            className="bg-surface rounded-2xl p-4 border border-border items-center"
          >
            <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
              🔄 刷新报告
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
