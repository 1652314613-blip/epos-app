import { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { View } from "react-native";

interface FeedbackAnimationProps {
  children: React.ReactNode;
  type: "success" | "error";
  trigger?: boolean;
}

export function FeedbackAnimation({ children, type, trigger = false }: FeedbackAnimationProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (trigger) {
      if (type === "success") {
        // Success: pulse animation
        scale.value = withSequence(
          withTiming(1.1, { duration: 200 }),
          withTiming(1, { duration: 200 })
        );
      } else {
        // Error: shake animation
        scale.value = withSequence(
          withTiming(1.05, { duration: 50 }),
          withTiming(0.95, { duration: 50 }),
          withTiming(1.05, { duration: 50 }),
          withTiming(0.95, { duration: 50 }),
          withTiming(1, { duration: 50 })
        );
      }
    }
  }, [trigger, type]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
