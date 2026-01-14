import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Modal,
  Dimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

interface AILectureModalProps {
  visible: boolean;
  onClose: () => void;
  question: string;
  tag: "考点" | "避坑" | "挑战";
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function AILectureModal({
  visible,
  onClose,
  question,
  tag,
}: AILectureModalProps) {
  const colors = useColors();
  const [lectureContent, setLectureContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slideUp = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  // Use tRPC mutation for grammar check
  const checkGrammarMutation = trpc.grammar.check.useMutation({
    onSuccess: (result) => {
      console.log("Grammar check success:", result);
      formatAndSetContent(result);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Grammar check error:", error);
      setError(`获取AI精讲失败: ${error.message}`);
      setIsLoading(false);

      // Provide fallback content
      let fallbackContent = `## ${tag}精讲\n\n`;
      fallbackContent += `**问题**: ${question}\n\n`;
      fallbackContent += `**说明**: AI服务暂时不可用，但您可以：\n`;
      fallbackContent += `1. 查看语法中心的相关知识点\n`;
      fallbackContent += `2. 查看错题本中的类似问题\n`;
      fallbackContent += `3. 稍后重新尝试\n`;

      setLectureContent(fallbackContent);
    },
  });

  // Fetch AI lecture when modal becomes visible
  useEffect(() => {
    if (visible) {
      fetchAILecture();
      // Animate in
      slideUp.value = withSpring(1, {
        damping: 10,
        stiffness: 100,
      });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      // Animate out
      slideUp.value = withTiming(0, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      backdropOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const fetchAILecture = async () => {
    setIsLoading(true);
    setError(null);
    setLectureContent("");

    // Call tRPC mutation
    checkGrammarMutation.mutate({
      sentence: question,
      gradeLevel: 9,
    });
  };

  const formatAndSetContent = (result: any) => {
    try {
      // Extract the grammar result
      // The result structure depends on what the API returns
      const grammarResult = result.json || result;

      if (!grammarResult) {
        throw new Error("Invalid response structure");
      }

      // Format the response as a detailed lecture
      let formattedContent = `## ${tag}精讲\n\n`;
      formattedContent += `**问题**: ${question}\n\n`;

      // Add error analysis if there are errors
      if (grammarResult.errors && grammarResult.errors.length > 0) {
        formattedContent += `**错误分析**:\n`;
        grammarResult.errors.forEach((error: any, index: number) => {
          formattedContent += `\n${index + 1}. **${error.category}** (${error.severity})\n`;
          formattedContent += `   - 错误: ${error.incorrect}\n`;
          formattedContent += `   - 正确: ${error.correct}\n`;
          formattedContent += `   - 解释: ${error.explanation}\n`;
          if (error.pepReference) {
            formattedContent += `   - 参考: ${error.pepReference}\n`;
          }
        });
      } else {
        // No errors - this is a correct sentence
        formattedContent += `**✅ 很棒！这个句子在语法上是正确的。**\n\n`;
      }

      // Add suggestions
      if (grammarResult.suggestions && grammarResult.suggestions.length > 0) {
        formattedContent += `\n**学习建议**:\n`;
        grammarResult.suggestions.forEach((suggestion: string) => {
          formattedContent += `- ${suggestion}\n`;
        });
      }

      // Add corrected sentence if it differs
      if (grammarResult.corrected && grammarResult.corrected !== question) {
        formattedContent += `\n**改正后的句子**:\n${grammarResult.corrected}\n`;
      }

      // Add score
      if (grammarResult.overallScore !== undefined) {
        formattedContent += `\n**得分**: ${grammarResult.overallScore}/100\n`;
      }

      // Add tips based on tag
      formattedContent += `\n`;
      switch (tag) {
        case "考点":
          formattedContent += `**💡 考点提示**: 这是中考/高考的高频考点，建议重点掌握。\n`;
          break;
        case "避坑":
          formattedContent += `**⚠️ 避坑提示**: 这是学生容易犯错的地方，要特别注意。\n`;
          break;
        case "挑战":
          formattedContent += `**🎯 挑战提示**: 这是进阶用法，掌握后能显著提升表达水平。\n`;
          break;
      }

      setLectureContent(formattedContent);
    } catch (err) {
      console.error("Error formatting content:", err);
      setError(`格式化内容失败: ${err instanceof Error ? err.message : "未知错误"}`);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: slideUp.value === 0 ? 600 : 0,
      },
    ],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleClose = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <AnimatedView
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          backdropStyle,
        ]}
      >
        <TouchableOpacity
          style={{
            flex: 1,
          }}
          onPress={handleClose}
          activeOpacity={1}
        />
      </AnimatedView>

      {/* Modal Content */}
      <AnimatedView
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: Dimensions.get("window").height * 0.85,
            borderTopWidth: 0.5,
            borderTopColor: colors.border,
            borderLeftWidth: 0.5,
            borderLeftColor: colors.border,
            borderRightWidth: 0.5,
            borderRightColor: colors.border,
          },
          animatedStyle,
        ]}
      >
        {/* Handle Bar */}
        <View
          style={{
            alignItems: "center",
            paddingVertical: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: colors.muted,
              borderRadius: 2,
              opacity: 0.3,
            }}
          />
        </View>

        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingBottom: 16,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                backgroundColor:
                  tag === "考点"
                    ? "#E8F0FE"
                    : tag === "避坑"
                      ? "#FEF3E2"
                      : "#F0FDF4",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color:
                    tag === "考点"
                      ? "#1E40AF"
                      : tag === "避坑"
                        ? "#B45309"
                        : "#15803D",
                }}
              >
                #{tag}精讲
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleClose}>
            <Text
              style={{
                fontSize: 24,
                color: colors.muted,
              }}
            >
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 40,
              }}
            >
              <ActivityIndicator size="large" color={colors.primary} />
              <Text
                style={{
                  marginTop: 12,
                  color: colors.muted,
                  fontSize: 14,
                }}
              >
                正在生成AI精讲...
              </Text>
            </View>
          ) : error ? (
            <View
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: "#DC2626",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                {error}
              </Text>
            </View>
          ) : null}

          {lectureContent && (
            <View>
              {lectureContent.split("\n").map((line, index) => {
                if (line.startsWith("## ")) {
                  return (
                    <Text
                      key={index}
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: colors.foreground,
                        marginBottom: 12,
                        marginTop: index > 0 ? 16 : 0,
                      }}
                    >
                      {line.replace("## ", "")}
                    </Text>
                  );
                } else if (line.startsWith("**") && line.endsWith("**")) {
                  return (
                    <Text
                      key={index}
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: colors.foreground,
                        marginTop: 12,
                        marginBottom: 8,
                      }}
                    >
                      {line.replace(/\*\*/g, "")}
                    </Text>
                  );
                } else if (line.startsWith("   - ")) {
                  return (
                    <Text
                      key={index}
                      style={{
                        fontSize: 13,
                        color: colors.muted,
                        marginLeft: 16,
                        marginBottom: 4,
                        lineHeight: 20,
                      }}
                    >
                      {line.replace("   - ", "")}
                    </Text>
                  );
                } else if (line.startsWith("- ")) {
                  return (
                    <Text
                      key={index}
                      style={{
                        fontSize: 13,
                        color: colors.foreground,
                        marginLeft: 12,
                        marginBottom: 6,
                        lineHeight: 20,
                      }}
                    >
                      {line.replace("- ", "")}
                    </Text>
                  );
                } else if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
                  return (
                    <Text
                      key={index}
                      style={{
                        fontSize: 13,
                        color: colors.foreground,
                        marginLeft: 12,
                        marginBottom: 6,
                        lineHeight: 20,
                      }}
                    >
                      {line}
                    </Text>
                  );
                } else if (line.trim() === "") {
                  return <View key={index} style={{ height: 8 }} />;
                } else {
                  return (
                    <Text
                      key={index}
                      style={{
                        fontSize: 14,
                        color: colors.foreground,
                        marginBottom: 8,
                        lineHeight: 22,
                      }}
                    >
                      {line}
                    </Text>
                  );
                }
              })}
            </View>
          )}
        </ScrollView>

        {/* Footer Buttons */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderTopWidth: 0.5,
            borderTopColor: colors.border,
          }}
        >
          <TouchableOpacity
            onPress={handleClose}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: colors.foreground,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.background,
              }}
            >
              我已了解
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClose}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: colors.muted,
              borderRadius: 12,
              alignItems: "center",
              opacity: 0.5,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: colors.foreground,
              }}
            >
              查看更多
            </Text>
          </TouchableOpacity>
        </View>
      </AnimatedView>
    </Modal>
  );
}
