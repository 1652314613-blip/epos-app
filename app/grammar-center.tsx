import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TextInput, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedListItem } from "@/components/animated-list-item";
import ExamHeatBadge, { getExamHeatFromTags } from "@/components/exam-heat-badge";
import { grammarPoints } from "@/lib/grammar-points-data";
import { grade9GrammarPoints } from "@/lib/grade9-grammar-data";
import { getAllWrongQuestions } from "@/lib/wrong-book";
import { getProgressData } from "@/lib/storage";

type TabType = "grade" | "category" | "exam" | "my";

export default function GrammarCenterScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<TabType>("grade");
  const [searchQuery, setSearchQuery] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [progress, setProgress] = useState({ total: 0, mastered: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const wrongs = await getAllWrongQuestions();
    const progressData = await getProgressData();
    setWrongCount(wrongs.filter((q) => !q.mastered).length);
    
    const allGrammarPoints = [...grammarPoints, ...grade9GrammarPoints];
    setProgress({
      total: allGrammarPoints.length,
      mastered: Math.floor(allGrammarPoints.length * 0.37), // 示例数据
    });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // 合并所有语法点
  const allGrammarPoints = [...grammarPoints, ...grade9GrammarPoints];

  // 按年级分组
  const gradeGroups = [
    {
      grade: "八年级",
      points: grammarPoints,
      color: "#3B82F6",
    },
    {
      grade: "九年级",
      points: grade9GrammarPoints,
      color: "#8B5CF6",
    },
  ];

  // 按类别分组
  const categoryGroups = [
    {
      category: "时态",
      icon: "⏰",
      color: "#3B82F6",
      points: allGrammarPoints.filter((p) => p.category === "时态"),
    },
    {
      category: "从句",
      icon: "🔗",
      color: "#8B5CF6",
      points: allGrammarPoints.filter((p) => p.category === "从句"),
    },
    {
      category: "语态",
      icon: "🔄",
      color: "#10B981",
      points: allGrammarPoints.filter((p) => p.category === "语态"),
    },
    {
      category: "非谓语动词",
      icon: "🎯",
      color: "#EC4899",
      points: allGrammarPoints.filter((p) => p.category === "非谓语动词"),
    },
    {
      category: "情态动词",
      icon: "💡",
      color: "#F59E0B",
      points: allGrammarPoints.filter((p) => p.category === "情态动词"),
    },
    {
      category: "其他",
      icon: "📝",
      color: "#6B7280",
      points: allGrammarPoints.filter(
        (p) =>
          !["时态", "从句", "语态", "非谓语动词", "情态动词"].includes(
            p.category
          )
      ),
    },
  ].filter((g) => g.points.length > 0);

  // 考点分组
  const examGroups = [
    {
      title: "中考必考",
      icon: "🎯",
      color: "#EF4444",
      points: allGrammarPoints.filter((p) =>
        p.examTags?.some((tag) => tag.type === "中考频次")
      ),
    },
    {
      title: "高考考点",
      icon: "🏆",
      color: "#F59E0B",
      points: allGrammarPoints.filter((p) =>
        p.examTags?.some((tag) => tag.type === "高考考点")
      ),
    },
  ];

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 bg-surface border-b border-border">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-3xl font-bold text-foreground">
                语法中心
              </Text>
              <Text className="text-sm text-muted mt-1">
                {progress.mastered}/{progress.total} 已掌握 ·{" "}
                {Math.round((progress.mastered / progress.total) * 100)}%
              </Text>
            </View>
            <AnimatedButton
              onPress={() => router.push("/wrong-book")}
              variant="secondary"
              className="bg-red-50 border-red-200 px-4 py-2"
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-xl">📖</Text>
                <View>
                  <Text className="text-xs text-red-600 font-semibold">
                    错题本
                  </Text>
                  <Text className="text-xs text-red-500">{wrongCount}题</Text>
                </View>
              </View>
            </AnimatedButton>
          </View>

          {/* Search Bar */}
          <View className="bg-background rounded-xl px-4 py-3 flex-row items-center gap-2 border border-border">
            <Text className="text-lg">🔍</Text>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="搜索语法知识点..."
              placeholderTextColor={colors.muted}
              className="flex-1 text-base text-foreground"
            />
          </View>
        </View>

        {/* Tab Navigation */}
        <View className="px-6 py-4 bg-surface border-b border-border">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            <AnimatedButton
              onPress={() => handleTabChange("grade")}
              variant={activeTab === "grade" ? "primary" : "secondary"}
              className={
                activeTab === "grade"
                  ? ""
                  : "bg-background border-border"
              }
            >
              <Text
                className={`text-sm font-semibold ${
                  activeTab === "grade" ? "text-white" : "text-foreground"
                }`}
              >
                📚 按年级
              </Text>
            </AnimatedButton>

            <AnimatedButton
              onPress={() => handleTabChange("category")}
              variant={activeTab === "category" ? "primary" : "secondary"}
              className={
                activeTab === "category"
                  ? ""
                  : "bg-background border-border"
              }
            >
              <Text
                className={`text-sm font-semibold ${
                  activeTab === "category" ? "text-white" : "text-foreground"
                }`}
              >
                🏷️ 按类别
              </Text>
            </AnimatedButton>

            <AnimatedButton
              onPress={() => handleTabChange("exam")}
              variant={activeTab === "exam" ? "primary" : "secondary"}
              className={
                activeTab === "exam"
                  ? ""
                  : "bg-background border-border"
              }
            >
              <Text
                className={`text-sm font-semibold ${
                  activeTab === "exam" ? "text-white" : "text-foreground"
                }`}
              >
                🎯 考点专攻
              </Text>
            </AnimatedButton>

            <AnimatedButton
              onPress={() => handleTabChange("my")}
              variant={activeTab === "my" ? "primary" : "secondary"}
              className={
                activeTab === "my"
                  ? ""
                  : "bg-background border-border"
              }
            >
              <Text
                className={`text-sm font-semibold ${
                  activeTab === "my" ? "text-white" : "text-foreground"
                }`}
              >
                ⭐ 我的学习
              </Text>
            </AnimatedButton>
          </ScrollView>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 py-4">
          {/* 按年级视图 */}
          {activeTab === "grade" && (
            <View className="gap-4">
              {gradeGroups.map((group, index) => (
                <AnimatedListItem key={group.grade} index={index}>
                  <View className="bg-surface rounded-2xl p-4 border border-border">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center gap-3">
                        <View
                          className="w-12 h-12 rounded-full items-center justify-center"
                          style={{ backgroundColor: group.color + "20" }}
                        >
                          <Text className="text-2xl">📖</Text>
                        </View>
                        <View>
                          <Text className="text-xl font-bold text-foreground">
                            {group.grade}
                          </Text>
                          <Text className="text-sm text-muted">
                            {group.points.length}个知识点
                          </Text>
                        </View>
                      </View>
                      <AnimatedButton
                        onPress={() => {
                          if (group.grade === "九年级") {
                            router.push("/grade9-grammar");
                          } else {
                            router.push("/grammar-learning");
                          }
                        }}
                        variant="secondary"
                        className="bg-background px-4 py-2"
                      >
                        <Text className="text-sm font-semibold text-primary">
                          开始学习 →
                        </Text>
                      </AnimatedButton>
                    </View>

                    {/* 进度条 */}
                    <View className="bg-background rounded-full h-2 overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: "37%",
                          backgroundColor: group.color,
                        }}
                      />
                    </View>
                    <Text className="text-xs text-muted mt-2">
                      已掌握 37%
                    </Text>
                  </View>
                </AnimatedListItem>
              ))}
            </View>
          )}

          {/* 按类别视图 */}
          {activeTab === "category" && (
            <View className="gap-4">
              {categoryGroups.map((group, index) => (
                <AnimatedListItem key={group.category} index={index}>
                  <AnimatedButton
                    onPress={() => {
                      // 跳转到该类别的知识点列表
                      router.push({
                        pathname: "/grammar-learning",
                        params: { category: group.category },
                      });
                    }}
                    variant="secondary"
                    className="bg-surface border border-border p-0"
                  >
                    <View className="flex-row items-center p-4">
                      {/* 左侧色条 */}
                      <View
                        className="w-1 h-16 rounded-full mr-4"
                        style={{ backgroundColor: group.color }}
                      />

                      {/* 图标 */}
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: group.color + "20" }}
                      >
                        <Text className="text-2xl">{group.icon}</Text>
                      </View>

                      {/* 内容 */}
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-foreground">
                          {group.category}
                        </Text>
                        <Text className="text-sm text-muted mt-1">
                          {group.points.length}个知识点
                        </Text>
                      </View>

                      {/* 箭头 */}
                      <Text className="text-xl text-muted">→</Text>
                    </View>
                  </AnimatedButton>
                </AnimatedListItem>
              ))}
            </View>
          )}

          {/* 考点专攻视图 */}
          {activeTab === "exam" && (
            <View className="gap-4">
              {examGroups.map((group, index) => (
                <AnimatedListItem key={group.title} index={index}>
                  <View className="bg-surface rounded-2xl p-4 border border-border">
                    <View className="flex-row items-center gap-3 mb-4">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: group.color + "20" }}
                      >
                        <Text className="text-2xl">{group.icon}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-xl font-bold text-foreground">
                          {group.title}
                        </Text>
                        <Text className="text-sm text-muted">
                          {group.points.length}个必考知识点
                        </Text>
                      </View>
                    </View>

                    {/* 知识点列表 */}
                    <View className="gap-2">
                      {group.points.slice(0, 5).map((point, idx) => (
                        <AnimatedButton
                          key={point.id}
                          onPress={() =>
                            router.push({
                              pathname: "/grammar-point-detail",
                              params: { id: point.id },
                            })
                          }
                          variant="secondary"
                          className="bg-background border-border p-3"
                        >
                          <View className="flex-row items-center justify-between">
                            <Text className="text-sm font-medium text-foreground flex-1">
                              {idx + 1}. {point.title}
                            </Text>
                            <Text className="text-xs text-muted">→</Text>
                          </View>
                        </AnimatedButton>
                      ))}
                    </View>

                    {group.points.length > 5 && (
                      <AnimatedButton
                        onPress={() => {
                          router.push({
                            pathname: "/grammar-learning",
                            params: { examType: group.title },
                          });
                        }}
                        variant="secondary"
                        className="bg-background mt-3"
                      >
                        <Text className="text-sm font-semibold text-primary text-center">
                          查看全部 {group.points.length} 个知识点 →
                        </Text>
                      </AnimatedButton>
                    )}
                  </View>
                </AnimatedListItem>
              ))}
            </View>
          )}

          {/* 我的学习视图 */}
          {activeTab === "my" && (
            <View className="gap-4">
              {/* 学习进度 */}
              <AnimatedListItem index={0}>
                <View className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6">
                  <Text className="text-2xl font-bold text-white mb-2">
                    学习进度
                  </Text>
                  <Text className="text-4xl font-bold text-white mb-4">
                    {Math.round((progress.mastered / progress.total) * 100)}%
                  </Text>
                  <View className="bg-white/20 rounded-full h-3 overflow-hidden mb-2">
                    <View
                      className="h-full bg-white rounded-full"
                      style={{
                        width: `${(progress.mastered / progress.total) * 100}%`,
                      }}
                    />
                  </View>
                  <Text className="text-sm text-white/80">
                    已掌握 {progress.mastered}/{progress.total} 个知识点
                  </Text>
                </View>
              </AnimatedListItem>

              {/* 今日复习 */}
              <AnimatedListItem index={1}>
                <AnimatedButton
                  onPress={() => router.push("/wrong-book")}
                  variant="secondary"
                  className="bg-surface border border-border p-0"
                >
                  <View className="p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center gap-3">
                        <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
                          <Text className="text-2xl">📅</Text>
                        </View>
                        <View>
                          <Text className="text-lg font-bold text-foreground">
                            今日复习
                          </Text>
                          <Text className="text-sm text-muted">
                            5个知识点待复习
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xl text-muted">→</Text>
                    </View>
                  </View>
                </AnimatedButton>
              </AnimatedListItem>

              {/* 错题本 */}
              <AnimatedListItem index={2}>
                <AnimatedButton
                  onPress={() => router.push("/wrong-book")}
                  variant="secondary"
                  className="bg-surface border border-border p-0"
                >
                  <View className="p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center gap-3">
                        <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center">
                          <Text className="text-2xl">📖</Text>
                        </View>
                        <View>
                          <Text className="text-lg font-bold text-foreground">
                            错题本
                          </Text>
                          <Text className="text-sm text-muted">
                            {wrongCount}道题待复习
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xl text-muted">→</Text>
                    </View>
                  </View>
                </AnimatedButton>
              </AnimatedListItem>

              {/* 收藏的知识点 */}
              <AnimatedListItem index={3}>
                <AnimatedButton
                  onPress={() => {
                    // TODO: 实现收藏功能
                    alert("收藏功能即将上线!");
                  }}
                  variant="secondary"
                  className="bg-surface border border-border p-0"
                >
                  <View className="p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center gap-3">
                        <View className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center">
                          <Text className="text-2xl">⭐</Text>
                        </View>
                        <View>
                          <Text className="text-lg font-bold text-foreground">
                            我的收藏
                          </Text>
                          <Text className="text-sm text-muted">
                            8个知识点已收藏
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xl text-muted">→</Text>
                    </View>
                  </View>
                </AnimatedButton>
              </AnimatedListItem>
            </View>
          )}

          {/* 底部间距 */}
          <View className="h-8" />
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
