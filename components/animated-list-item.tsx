import { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from "react-native-reanimated";
import { View } from "react-native";

interface AnimatedListItemProps {
  children: React.ReactNode;
  index: number;
  delay?: number;
}

export function AnimatedListItem({ children, index, delay = 50 }: AnimatedListItemProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const itemDelay = index * delay;
    opacity.value = withDelay(itemDelay, withSpring(1, { damping: 20, stiffness: 90 }));
    translateY.value = withDelay(itemDelay, withSpring(0, { damping: 20, stiffness: 90 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
