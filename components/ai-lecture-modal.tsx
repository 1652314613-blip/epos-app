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

    try {
      // Call existing grammar check API to get AI explanation
      // We'll use a prompt that focuses on detailed explanation
      const response = await fetch("/api/trpc/grammar.check?input=" + encodeURIComponent(JSON.stringify({
        json: {
          sentence: question,
          gradeLevel: 9,
        }
      })), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI lecture: " + response.status);
      }

      const data = await response.json();

      // Format the response as a detailed lecture
      let formattedContent = `## ${tag}精讲\n\n`;
      formattedContent += `**问题**: ${question}\n\n`;

      // Handle tRPC response format
      const result = data.result || data;
      
      if (result && result.explanation) {
        formattedContent += `**详细解析**:\n${result.explanation}\n\n`;
      }

      if (result && result.suggestions) {
        formattedContent += `**改进建议**:\n${result.suggestions}\n\n`;
      }

      if (result && result.examples) {
        formattedContent += `**相关例句**:\n${result.examples}\n\n`;
      }
      
      // If no detailed response, use the analysis
      if (!result.explanation && result.analysis) {
        formattedContent += `**分析**:\n${result.analysis}\n\n`;
      }

      // Add tips based on tag
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
      console.error("Error fetching AI lecture:", err);
      setError("获取AI精讲失败，请稍后重试");

      // Provide fallback content
      let fallbackContent = `## ${tag}精讲\n\n`;
      fallbackContent += `**问题**: ${question}\n\n`;
      fallbackContent += `**说明**: AI服务暂时不可用，但您可以：\n`;
      fallbackContent += `1. 查看语法中心的相关知识点\n`;
      fallbackContent += `2. 查看错题本中的类似问题\n`;
      fallbackContent += `3. 稍后重新尝试\n`;

      setLectureContent(fallbackContent);
    } finally {
      setIsLoading(false);
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
                } else if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.")) {
                  return (
                    <Text
                      key={index}
                      style={{
                        fontSize: 14,
                        color: colors.foreground,
                        marginBottom: 8,
                        marginLeft: 12,
                        lineHeight: 20,
                      }}
                    >
                      {line}
                    </Text>
                  );
                } else if (line.trim()) {
                  return (
                    <Text
                      key={index}
                      style={{
                        fontSize: 14,
                        color: colors.foreground,
                        marginBottom: 8,
                        lineHeight: 20,
                      }}
                    >
                      {line}
                    </Text>
                  );
                }
                return null;
              })}
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Footer Action */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderTopWidth: 0.5,
            borderTopColor: colors.border,
            flexDirection: "row",
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={handleClose}
            style={{
              flex: 1,
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              我已了解
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // Could navigate to related grammar point
              handleClose();
            }}
            style={{
              flex: 1,
              backgroundColor: colors.background,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
              borderWidth: 0.5,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                color: colors.foreground,
                fontSize: 16,
                fontWeight: "600",
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
