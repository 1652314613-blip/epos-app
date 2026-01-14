import { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import type { TextbookWord } from "@/lib/textbook-vocabulary";

interface FlashcardProps {
  word: TextbookWord;
  showPhonetic?: boolean;
  showExamples?: boolean;
}

export function Flashcard({ word, showPhonetic = true, showExamples = true }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const rotation = useSharedValue(0);

  const handleFlip = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    rotation.value = withTiming(isFlipped ? 0 : 180, { duration: 300 });
    setIsFlipped(!isFlipped);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  return (
    <Pressable onPress={handleFlip} className="w-full" style={{ aspectRatio: 3/4 }}>
      <View className="relative w-full h-full">
        {/* 正面 - 单词 */}
        <Animated.View
          style={[frontAnimatedStyle]}
          className="absolute w-full h-full bg-surface rounded-3xl border-2 border-border p-8 items-center justify-center shadow-lg"
        >
          <View className="items-center gap-4">
            {/* 单词 */}
            <Text className="text-5xl font-bold text-foreground">
              {word.word}
            </Text>

            {/* 音标 */}
            {showPhonetic && word.phonetic && (
              <Text className="text-xl text-muted">
                {word.phonetic}
              </Text>
            )}

            {/* 提示 */}
            <View className="mt-8 bg-primary/10 rounded-xl px-4 py-2">
              <Text className="text-sm text-primary">
                点击查看释义 →
              </Text>
            </View>

            {/* 标签 */}
            <View className="flex-row gap-2 mt-4">
              <View className="bg-blue-100 rounded-full px-3 py-1">
                <Text className="text-xs font-semibold text-blue-700">
                  {word.book} Unit {word.unit}
                </Text>
              </View>
              {word.difficulty && (
                <View className={`rounded-full px-3 py-1 ${
                  word.difficulty === 'basic' ? 'bg-green-100' :
                  word.difficulty === 'intermediate' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <Text className={`text-xs font-semibold ${
                    word.difficulty === 'basic' ? 'text-green-700' :
                    word.difficulty === 'intermediate' ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {word.difficulty === 'basic' ? '基础' :
                     word.difficulty === 'intermediate' ? '中级' : '高级'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* 背面 - 释义 */}
        <Animated.View
          style={[backAnimatedStyle]}
          className="absolute w-full h-full bg-primary/10 rounded-3xl border-2 border-primary/30 p-6 shadow-lg"
        >
          <View className="flex-1 justify-between">
            {/* 单词和音标 */}
            <View className="items-center gap-2">
              <Text className="text-3xl font-bold text-foreground">
                {word.word}
              </Text>
              {showPhonetic && word.phonetic && (
                <Text className="text-base text-muted">
                  {word.phonetic}
                </Text>
              )}
            </View>

            {/* 释义 */}
            <View className="flex-1 justify-center gap-3">
              {word.definitions.map((def, index) => (
                <View key={index} className="bg-surface rounded-xl p-4 border border-border">
                  <View className="flex-row items-start gap-2">
                    <Text className="text-sm font-semibold text-primary">
                      {def.partOfSpeech}.
                    </Text>
                    <Text className="flex-1 text-base text-foreground leading-relaxed">
                      {def.meaning}
                    </Text>
                  </View>
                </View>
              ))}

              {/* 例句 */}
              {showExamples && word.examples.length > 0 && (
                <View className="bg-surface rounded-xl p-4 border border-border mt-2">
                  <Text className="text-sm font-semibold text-primary mb-2">
                    💡 例句
                  </Text>
                  {word.examples.slice(0, 2).map((example, index) => (
                    <Text key={index} className="text-sm text-muted leading-relaxed mb-1">
                      • {example}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* 提示 */}
            <View className="items-center">
              <View className="bg-primary/20 rounded-xl px-4 py-2">
                <Text className="text-sm text-primary">
                  点击返回单词 →
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
}
