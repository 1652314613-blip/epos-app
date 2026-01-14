import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useColors } from "@/hooks/use-colors";

interface AssistantGreetingProps {
  userName?: string;
  remainingPoints?: number;
  totalPoints?: number;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function AssistantGreeting({
  userName = "同学",
  remainingPoints = 3,
  totalPoints = 15,
}: AssistantGreetingProps) {
  const colors = useColors();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withSpring(0, {
      damping: 10,
      stiffness: 100,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "早上好";
    } else if (hour < 18) {
      return "下午好";
    } else {
      return "晚上好";
    }
  };

  const getMotivationalMessage = () => {
    const messages = [
      "距离你的提分目标还差",
      "还需要掌握",
      "继续加油，还需要",
      "坚持学习，还差",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <AnimatedView style={animatedStyle}>
      <View
        style={{
          marginBottom: 24,
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: 16,
          borderWidth: 0.5,
          borderColor: colors.border,
        }}
      >
        {/* Main Greeting */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "300",
              color: colors.foreground,
            }}
          >
            {getGreeting()}
            <Text style={{ fontSize: 24 }}>～</Text>
          </Text>
          <Text
            style={{
              fontSize: 20,
            }}
          >
            ✨
          </Text>
        </View>

        {/* Motivational Message */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: colors.foreground,
            }}
          >
            {getMotivationalMessage()}
          </Text>
          <View
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              minWidth: 50,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "white",
              }}
            >
              {remainingPoints}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: colors.foreground,
            }}
          >
            个语法点
          </Text>
        </View>

        {/* Progress Bar */}
        <View
          style={{
            marginTop: 12,
            height: 4,
            backgroundColor: colors.border,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${((totalPoints - remainingPoints) / totalPoints) * 100}%`,
              backgroundColor: colors.primary,
              borderRadius: 2,
            }}
          />
        </View>

        {/* Progress Text */}
        <Text
          style={{
            fontSize: 12,
            color: colors.muted,
            marginTop: 8,
            textAlign: "right",
          }}
        >
          已掌握 {totalPoints - remainingPoints}/{totalPoints} 个知识点
        </Text>
      </View>
    </AnimatedView>
  );
}

/**
 * Simplified version without progress tracking
 */
export function SimpleAssistantGreeting() {
  const colors = useColors();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withSpring(0, {
      damping: 10,
      stiffness: 100,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "早上好";
    } else if (hour < 18) {
      return "下午好";
    } else {
      return "晚上好";
    }
  };

  return (
    <AnimatedView style={animatedStyle}>
      <View
        style={{
          marginBottom: 20,
          paddingHorizontal: 20,
          paddingVertical: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "300",
              color: colors.foreground,
            }}
          >
            {getGreeting()}
          </Text>
          <Text style={{ fontSize: 18 }}>👋</Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
              fontWeight: "300",
            }}
          >
            欢迎回来
          </Text>
        </View>
      </View>
    </AnimatedView>
  );
}
