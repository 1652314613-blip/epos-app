/**
 * QA Result Screen
 * 显示AI对学习问题的回答
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { EposLogo } from "@/components/epos-logo";

interface QAResult {
  question: string;
  answer: string;
  tips?: string[];
  relatedTopics?: string[];
}

export default function QAResultScreen() {
  const colors = useColors();
  const router = useRouter();
  const { result: resultParam } = useLocalSearchParams();

  const result: QAResult | null = resultParam
    ? JSON.parse(resultParam as string)
    : null;

  const handleBack = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  if (!result) {
    return (
      <ScreenContainer edges={["top", "left", "right", "bottom"]}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.foreground }}>加载失败</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <EposLogo />
        </View>

        {/* Header */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={handleBack}>
            <Text style={{ fontSize: 20, color: colors.primary }}>←</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.foreground,
            }}
          >
            学习问答
          </Text>
          <View style={{ width: 20 }} />
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          {/* Question */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                marginBottom: 8,
              }}
            >
              你的问题
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.foreground,
              }}
            >
              {result.question}
            </Text>
          </View>

          {/* Answer */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.muted,
                marginBottom: 8,
                fontWeight: "600",
              }}
            >
              📚 详细回答
            </Text>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 24,
                color: colors.foreground,
              }}
            >
              {result.answer}
            </Text>
          </View>

          {/* Tips */}
          {result.tips && result.tips.length > 0 && (
            <View
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                borderLeftWidth: 4,
                borderLeftColor: "#3b82f6",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#3b82f6",
                  marginBottom: 12,
                  fontWeight: "600",
                }}
              >
                💡 学习技巧
              </Text>
              {result.tips.map((tip, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: index < result.tips!.length - 1 ? 8 : 0,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.foreground,
                      lineHeight: 20,
                    }}
                  >
                    {index + 1}. {tip}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Related Topics */}
          {result.relatedTopics && result.relatedTopics.length > 0 && (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                  marginBottom: 12,
                  fontWeight: "600",
                }}
              >
                🔗 相关主题
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {result.relatedTopics.map((topic, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: 16,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#fff",
                        fontWeight: "500",
                      }}
                    >
                      {topic}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleBack}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#fff",
              }}
            >
              继续学习
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
