import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { AnimatedButton } from "@/components/animated-button";
import { SmartQACardsContainer, type SmartQACardData } from "@/components/smart-qa-card";
import { AILectureModal } from "@/components/ai-lecture-modal";
import { GlobalInputBar } from "@/components/global-input-bar";
import { AssistantGreeting } from "@/components/assistant-greeting";
import { trpc } from "@/lib/trpc";
import {
  addCheckToHistory,
  updateProgressData,
  getProgressData,
  type ProgressData,
} from "@/lib/storage";
import { getTodayReviewCount } from "@/services/review-service";

export default function HomeScreen() {
  const colors = useColors();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [todayReviewCount, setTodayReviewCount] = useState(0);
  const [selectedQACard, setSelectedQACard] = useState<{
    question: string;
    tag: "考点" | "避坑" | "挑战";
  } | null>(null);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const progressData = await getProgressData();
    const reviewCount = await getTodayReviewCount();
    setProgress(progressData);
    setTodayReviewCount(reviewCount);
  };

  // 判断输入是否为学习问题（包含中文）
  const isLearningQuestion = (text: string): boolean => {
    const chineseRegex = /[\u4e00-\u9fff]/g;
    return chineseRegex.test(text);
  };

  const checkGrammarMutation = trpc.grammar.check.useMutation({
    onSuccess: async (result) => {
      console.log("Grammar check success:", result);
      setIsCheckingGrammar(false);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      // Save to history and update progress
      await addCheckToHistory(result);
      await updateProgressData(result);
      await loadData();
      // Navigate to result screen with data
      router.push({
        pathname: "/check-result" as any,
        params: {
          result: JSON.stringify(result),
          gradeLevel: "9",
        },
      });
    },
    onError: (error) => {
      console.error("Grammar check failed:", error);
      setIsCheckingGrammar(false);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      let errorMessage = "语法检查失败";
      let errorDetail = "";

      if (error.message.includes("timeout") || error.message.includes("Timeout")) {
        errorDetail = "网络连接超时，请检查网络后重试";
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorDetail = "网络连接失败，请检查网络设置";
      } else if (error.message.includes("transform")) {
        errorDetail = "服务器响应异常，请稍后重试";
      } else {
        errorDetail = error.message || "未知错误，请稍后重试";
      }

      alert(`${errorMessage}\n\n${errorDetail}\n\n💡 提示：如果问题持续，我们会提供基础检查功能`);
    },
  });

  const askQuestionMutation = trpc.qa.ask.useMutation({
    onSuccess: (result) => {
      console.log("QA success:", result);
      setIsCheckingGrammar(false);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      // Navigate to QA result screen
      router.push({
        pathname: "/qa-result" as any,
        params: {
          result: JSON.stringify(result),
        },
      });
    },
    onError: (error) => {
      console.error("QA failed:", error);
      setIsCheckingGrammar(false);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      alert(`\u56de\u7b54\u95ee\u9898\u5931\u8d25: ${error.message}\n\n\u8bf7\u7a0d\u540e\u91cd\u8bd5`);
    },
  });

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    setIsCheckingGrammar(true);

    // \u5224\u65ad\u662f\u5b66\u4e60\u95ee\u9898\u8fd8\u662f\u82f1\u6587\u53e5\u5b50
    if (isLearningQuestion(text)) {
      // \u5b66\u4e60\u95ee\u9898 - \u8c03\u7528QA API
      console.log("[Home] Detected learning question:", text);
      askQuestionMutation.mutate({
        question: text.trim(),
        gradeLevel: 9,
      });
    } else {
      // \u82f1\u6587\u53e5\u5b50 - \u8c03\u7528\u8bed\u6cd5\u68c0\u67e5API
      console.log("[Home] Detected English sentence:", text);
      checkGrammarMutation.mutate({
        sentence: text.trim(),
        gradeLevel: 9,
      });
    }
  };

  const handlePhotoPress = () => {
    router.push("/photo-recognition");
  };

  // Smart QA Cards Data
  const qaCards: SmartQACardData[] = [
    {
      id: "qa-1",
      tag: "考点",
      question: '"used to"和"be used to"怎么区分？',
      description: "这是中考高频考点，很多学生容易混淆",
      onPress: () => {
        setSelectedQACard({
          question: '"used to"和"be used to"怎么区分？',
          tag: "考点",
        });
      },
    },
    {
      id: "qa-2",
      tag: "避坑",
      question: '作文里写"very happy"真的会扣分吗？',
      description: "了解常见的表达误区，避免失分",
      onPress: () => {
        setSelectedQACard({
          question: '作文里写"very happy"真的会扣分吗？',
          tag: "避坑",
        });
      },
    },
    {
      id: "qa-3",
      tag: "挑战",
      question: "像地道美国人一样打招呼，试试这一句？",
      description: "进阶用法，提升你的表达地道度",
      onPress: () => {
        setSelectedQACard({
          question: "像地道美国人一样打招呼，试试这一句？",
          tag: "挑战",
        });
      },
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScreenContainer className="bg-background" edges={["top", "left", "right"]}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          {/* Main Content - Scrollable */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
              {/* Header - Logo */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "300",
                    letterSpacing: 3,
                    color: colors.foreground,
                  }}
                >
                  EPOS
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "300",
                    letterSpacing: 2,
                    color: colors.muted,
                    textTransform: "lowercase",
                  }}
                >
                  logic of language
                </Text>
              </View>

              {/* Assistant Greeting */}
              <AssistantGreeting
                remainingPoints={3}
                totalPoints={15}
              />

              {/* Smart QA Cards */}
              <SmartQACardsContainer
                cards={qaCards}
                title="💡 智能问答"
              />

              {/* Today's Review Reminder */}
              {todayReviewCount > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <AnimatedButton
                    onPress={() => router.push("/wrong-book")}
                    variant="secondary"
                    className="bg-transparent border-0.5 border-border"
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        paddingVertical: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: colors.error + "33",
                            borderRadius: 12,
                            padding: 8,
                          }}
                        >
                          <Text style={{ fontSize: 20 }}>🔔</Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "600",
                              color: colors.foreground,
                            }}
                          >
                            今日待复习
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              color: colors.muted,
                              marginTop: 2,
                            }}
                          >
                            {todayReviewCount} 个错题待巩固
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          backgroundColor: colors.error,
                          borderRadius: 12,
                          width: 24,
                          height: 24,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: "white",
                          }}
                        >
                          {todayReviewCount}
                        </Text>
                      </View>
                    </View>
                  </AnimatedButton>
                </View>
              )}

              {/* Quick Links */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.foreground,
                    marginBottom: 12,
                  }}
                >
                  快速导航
                </Text>

                {/* Photo Recognition */}
                <AnimatedButton
                  onPress={handlePhotoPress}
                  variant="secondary"
                  className="bg-transparent border-0.5 border-border mb-3"
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                      width: "100%",
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: colors.primary + "20",
                        borderRadius: 12,
                        padding: 8,
                      }}
                    >
                      <Text style={{ fontSize: 20 }}>📷</Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: colors.foreground,
                      }}
                    >
                      拍照识别
                    </Text>
                  </View>
                </AnimatedButton>

                {/* Textbook Learning */}
                <AnimatedButton
                  onPress={() => router.push("/textbook-reading-list")}
                  variant="secondary"
                  className="bg-transparent border-0.5 border-border mb-3"
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                      width: "100%",
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: colors.primary + "20",
                        borderRadius: 12,
                        padding: 8,
                      }}
                    >
                      <Text style={{ fontSize: 20 }}>📖</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: colors.foreground,
                        }}
                      >
                        文章学习
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.muted,
                          marginTop: 2,
                        }}
                      >
                        精选文章 · 提高阅读 · 扩展词汇
                      </Text>
                    </View>
                  </View>
                </AnimatedButton>

                {/* Grammar Center */}
                <AnimatedButton
                  onPress={() => router.push("/grammar-center")}
                  variant="secondary"
                  className="bg-transparent border-0.5 border-border"
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                      width: "100%",
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#22C55E20",
                        borderRadius: 12,
                        padding: 8,
                      }}
                    >
                      <Text style={{ fontSize: 20 }}>📚</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: colors.foreground,
                        }}
                      >
                        语法中心
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.muted,
                          marginTop: 2,
                        }}
                      >
                        37个知识点 · 按年级/类别/考点 · 智能学习
                      </Text>
                    </View>
                  </View>
                </AnimatedButton>
              </View>

              {/* Stats */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  marginBottom: 40,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 0.5,
                    borderColor: colors.border,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: colors.primary,
                    }}
                  >
                    {progress?.totalChecks || 0}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.muted,
                      marginTop: 6,
                    }}
                  >
                    已检查
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 0.5,
                    borderColor: colors.border,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#22C55E",
                    }}
                  >
                    {progress?.correctChecks || 0}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.muted,
                      marginTop: 6,
                    }}
                  >
                    正确
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 0.5,
                    borderColor: colors.border,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#F59E0B",
                    }}
                  >
                    {progress?.currentStreak || 0}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.muted,
                      marginTop: 6,
                    }}
                  >
                    连续天数
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Global Input Bar - Fixed at Bottom */}
          <GlobalInputBar
            onSendMessage={handleSendMessage}
            onPhotoPress={handlePhotoPress}
            isLoading={isCheckingGrammar}
          />
        </View>
      </ScreenContainer>

      {/* AI Lecture Modal */}
      {selectedQACard && (
        <AILectureModal
          visible={!!selectedQACard}
          onClose={() => setSelectedQACard(null)}
          question={selectedQACard.question}
          tag={selectedQACard.tag}
        />
      )}
    </KeyboardAvoidingView>
  );
}
