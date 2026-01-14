import { TouchableOpacity, Text, Platform } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { cn } from "@/lib/utils";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export function AnimatedButton({
  onPress,
  children,
  className,
  disabled = false,
  variant = "primary",
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
  };

  const handlePress = () => {
    if (disabled) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const variantStyles = {
    primary: "bg-primary",
    secondary: "bg-primary/10 border border-primary/30",
    outline: "bg-transparent border-2 border-primary",
  };

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[animatedStyle, { opacity: disabled ? 0.5 : 1 }]}
      className={cn("px-6 py-4 rounded-2xl items-center", variantStyles[variant], className)}
    >
      {children}
    </AnimatedTouchable>
  );
}
