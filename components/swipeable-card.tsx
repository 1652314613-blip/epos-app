/**
 * Swipeable Card Component
 * 
 * Tinder-like swipeable card for vocabulary learning
 * - Swipe right: Know the word
 * - Swipe left: Don't know the word
 */

import { useState } from "react";
import { View, Text, Pressable, Dimensions, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const ROTATION_ANGLE = 30;

export interface SwipeableCardProps {
  word: string;
  translation: string;
  phonetic?: string;
  example?: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  index: number;
  totalCards: number;
}

export function SwipeableCard({
  word,
  translation,
  phonetic,
  example,
  onSwipeLeft,
  onSwipeRight,
  index,
  totalCards,
}: SwipeableCardProps) {
  const colors = useColors();
  const [isFlipped, setIsFlipped] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleSwipeLeft = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSwipeLeft();
  };

  const handleSwipeRight = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSwipeRight();
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;

      if (shouldSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
        runOnJS(handleSwipeLeft)();
      } else if (shouldSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
        runOnJS(handleSwipeRight)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [1, 0.5],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      opacity,
    };
  });

  const leftOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  const rightOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: SCREEN_WIDTH * 0.85,
            height: 480,
            alignSelf: "center",
          },
          animatedStyle,
        ]}
      >
        <Pressable
          onPress={() => setIsFlipped(!isFlipped)}
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 32,
            borderWidth: 2,
            borderColor: colors.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Left Overlay (Don't Know) */}
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
              },
              leftOverlayStyle,
            ]}
            pointerEvents="none"
          >
            <View
              style={{
                borderWidth: 4,
                borderColor: "#EF4444",
                borderRadius: 16,
                paddingHorizontal: 24,
                paddingVertical: 12,
                transform: [{ rotate: "-25deg" }],
              }}
            >
              <Text style={{ fontSize: 32, fontWeight: "bold", color: "#EF4444" }}>
                不认识
              </Text>
            </View>
          </Animated.View>

          {/* Right Overlay (Know) */}
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
              },
              rightOverlayStyle,
            ]}
            pointerEvents="none"
          >
            <View
              style={{
                borderWidth: 4,
                borderColor: "#22C55E",
                borderRadius: 16,
                paddingHorizontal: 24,
                paddingVertical: 12,
                transform: [{ rotate: "25deg" }],
              }}
            >
              <Text style={{ fontSize: 32, fontWeight: "bold", color: "#22C55E" }}>
                认识
              </Text>
            </View>
          </Animated.View>

          {/* Card Content */}
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 24 }}>
            {!isFlipped ? (
              // Front: Word
              <>
                <Text style={{ fontSize: 48, fontWeight: "bold", color: colors.foreground }}>
                  {word}
                </Text>
                {phonetic && (
                  <Text style={{ fontSize: 18, color: colors.muted }}>
                    {phonetic}
                  </Text>
                )}
                <View
                  style={{
                    marginTop: 32,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    backgroundColor: colors.primary + "20",
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
                    点击卡片查看释义
                  </Text>
                </View>
              </>
            ) : (
              // Back: Translation & Example
              <>
                <Text style={{ fontSize: 32, fontWeight: "bold", color: colors.foreground }}>
                  {translation}
                </Text>
                {example && (
                  <View style={{ marginTop: 16, gap: 8 }}>
                    <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
                      例句：
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.foreground,
                        textAlign: "center",
                        lineHeight: 24,
                      }}
                    >
                      {example}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    marginTop: 32,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    backgroundColor: colors.primary + "20",
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
                    点击返回单词
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Progress Indicator */}
          <View style={{ position: "absolute", top: 16, right: 16 }}>
            <Text style={{ fontSize: 14, color: colors.muted, fontWeight: "600" }}>
              {index + 1} / {totalCards}
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}
