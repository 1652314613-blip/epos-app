import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  Keyboard,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/use-colors";

interface GlobalInputBarProps {
  onSendMessage: (text: string) => void;
  onPhotoPress: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function GlobalInputBar({
  onSendMessage,
  onPhotoPress,
  placeholder = "发消息或长按说话...",
  isLoading = false,
}: GlobalInputBarProps) {
  const colors = useColors();
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const focusScale = useSharedValue(1);
  const borderOpacity = useSharedValue(0.3);

  const handleFocus = () => {
    setIsFocused(true);
    focusScale.value = withSpring(1.02, {
      damping: 10,
      stiffness: 100,
    });
    borderOpacity.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
    borderOpacity.value = withTiming(0.3, { duration: 200 });
  };

  const handleSend = () => {
    if (!text.trim() || isLoading) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onSendMessage(text.trim());
    setText("");
    Keyboard.dismiss();
  };

  const handlePhotoPress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPhotoPress();
  };

  const handleLongPress = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focusScale.value }],
  }));

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: colors.primary,
    opacity: borderOpacity.value,
  }));

  return (
    <AnimatedView
      style={[
        {
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.background,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
        },
      ]}
    >
      <AnimatedView
        style={[
          {
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 10,
            backgroundColor: colors.surface,
            borderRadius: 24,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderWidth: 0.5,
            borderColor: colors.border,
          },
          animatedStyle,
        ]}
      >
        {/* Photo Button */}
        <AnimatedTouchable
          onPress={handlePhotoPress}
          style={{
            padding: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>📷</Text>
        </AnimatedTouchable>

        {/* Text Input */}
        <TextInput
          value={text}
          onChangeText={setText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          multiline
          maxHeight={100}
          editable={!isLoading && !isRecording}
          style={{
            flex: 1,
            fontSize: 14,
            color: colors.foreground,
            paddingVertical: 8,
            paddingHorizontal: 4,
          }}
        />

        {/* Send / Record Button */}
        {text.trim() ? (
          <AnimatedTouchable
            onPress={handleSend}
            disabled={isLoading}
            style={{
              padding: 8,
              justifyContent: "center",
              alignItems: "center",
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            <Text style={{ fontSize: 20 }}>
              {isLoading ? "⏳" : "✈️"}
            </Text>
          </AnimatedTouchable>
        ) : (
          <AnimatedTouchable
            onLongPress={handleLongPress}
            onPress={() => {
              // Short press does nothing, only long press records
            }}
            style={{
              padding: 8,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isRecording ? "#EF4444" : "transparent",
              borderRadius: 12,
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ fontSize: 18 }}>
              {isRecording ? "🔴" : "🎤"}
            </Text>
          </AnimatedTouchable>
        )}
      </AnimatedView>

      {/* Recording Indicator */}
      {isRecording && (
        <View
          style={{
            marginTop: 8,
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: "#EF4444",
              borderRadius: 4,
            }}
          />
          <Text
            style={{
              fontSize: 12,
              color: "#DC2626",
              fontWeight: "500",
            }}
          >
            正在录音...
          </Text>
          <TouchableOpacity
            onPress={() => setIsRecording(false)}
            style={{
              marginLeft: "auto",
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 12, color: "#DC2626" }}>取消</Text>
          </TouchableOpacity>
        </View>
      )}
    </AnimatedView>
  );
}
