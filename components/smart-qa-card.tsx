import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

export interface SmartQACardData {
  id: string;
  tag: "考点" | "避坑" | "挑战";
  question: string;
  description?: string;
  onPress: () => void;
}

interface SmartQACardProps {
  data: SmartQACardData;
  index?: number;
}

// Use Animated from react-native-reanimated instead of react-native

export function SmartQACard({ data, index = 0 }: SmartQACardProps) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  // Animation on mount
  React.useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 300,
      delay: index * 50,
    });
  }, [index, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
  };

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    data.onPress();
  };

  // Tag color mapping
  const tagColorMap = {
    考点: { bg: "#E8F0FE", text: "#1E40AF", icon: "📌" },
    避坑: { bg: "#FEF3E2", text: "#B45309", icon: "⚠️" },
    挑战: { bg: "#F0FDF4", text: "#15803D", icon: "🎯" },
  };

  const tagStyle = tagColorMap[data.tag];

  return (
    <Animated.View style={[animatedStyle]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
      <View
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderWidth: 0.5,
          borderColor: colors.border,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Tag Badge */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            gap: 8,
          }}
        >
          <View
            style={{
              backgroundColor: tagStyle.bg,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: tagStyle.text }}>
              #{data.tag}
            </Text>
          </View>
        </View>

        {/* Question Text */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: "500",
            color: colors.foreground,
            lineHeight: 22,
            marginBottom: data.description ? 8 : 0,
          }}
        >
          {data.question}
        </Text>

        {/* Description if provided */}
        {data.description && (
          <Text
            style={{
              fontSize: 13,
              color: colors.muted,
              lineHeight: 20,
            }}
          >
            {data.description}
          </Text>
        )}

        {/* Arrow indicator */}
        <View
          style={{
            position: "absolute",
            right: 16,
            top: "50%",
            marginTop: -12,
          }}
        >
          <Text style={{ fontSize: 18, color: colors.muted }}>→</Text>
        </View>
      </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

/**
 * Container for multiple Smart QA Cards
 */
interface SmartQACardsContainerProps {
  cards: SmartQACardData[];
  title?: string;
}

export function SmartQACardsContainer({
  cards,
  title = "智能问答",
}: SmartQACardsContainerProps) {
  const colors = useColors();

  return (
    <View style={{ marginBottom: 24 }}>
      {title && (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: colors.foreground,
            marginBottom: 12,
          }}
        >
          {title}
        </Text>
      )}
      <View>
        {cards.map((card, index) => (
          <SmartQACard key={card.id} data={card} index={index} />
        ))}
      </View>
    </View>
  );
}
