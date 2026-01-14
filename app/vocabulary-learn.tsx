import { useState, useEffect } from "react";
import { ScrollView, Text, View, Alert, Platform } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { getWordsToReview, getNewWords, updateWordReview, type Word } from "@/lib/vocabulary-storage";

export default function VocabularyLearnScreen() {
  const colors = useColors();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);
  const [mode, setMode] = useState<"review" | "new">("review");

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    // 先加载需要复习的单词
    const reviewWords = await getWordsToReview();
    
    if (reviewWords.length > 0) {
      setWords(reviewWords);
      setMode("review");
    } else {
      // 如果没有需要复习的，加载新单词
      const newWords = await getNewWords(10);
      setWords(newWords);
      setMode("new");
    }
  };

  const currentWord = words[currentIndex];

  const handleKnow = async (quality: number) => {
    if (!currentWord) return;

    await updateWordReview(currentWord.id, quality);
    setLearnedCount(learnedCount + 1);

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // 进入下一个单词
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      // 完成学习
      Alert.alert(
        "🎉 完成学习",
        `太棒了！你已经学习了 ${learnedCount + 1} 个单词`,
        [
          {
            text: "返回单词本",
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  if (words.length === 0) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-4xl">🎉</Text>
          <Text className="text-xl font-bold text-foreground">暂无需要学习的单词</Text>
          <Text className="text-sm text-muted text-center">
            今天的复习任务已完成！{"\n"}可以添加更多单词到单词本
          </Text>
          <AnimatedButton
            onPress={() => router.back()}
            variant="primary"
            className="px-6 py-3 mt-4"
          >
            <Text className="text-background font-semibold">返回单词本</Text>
          </AnimatedButton>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <AnimatedButton
              onPress={() => router.back()}
              variant="secondary"
              className="px-4 py-2"
            >
              <Text className="text-primary font-semibold">← 返回</Text>
            </AnimatedButton>
            <View className="flex-row items-center gap-2">
              <View className="bg-primary/20 px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold text-primary">
                  {mode === "review" ? "复习模式" : "学习新词"}
                </Text>
              </View>
              <Text className="text-sm text-muted">
                {currentIndex + 1} / {words.length}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="bg-surface rounded-full h-2 overflow-hidden">
            <View
              className="bg-primary h-full"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </View>

          {/* Word Card */}
          <View className="flex-1 items-center justify-center gap-6">
            <View className="bg-surface rounded-3xl p-8 border border-border w-full items-center gap-4">
              <Text className="text-5xl font-bold text-foreground text-center">
                {currentWord.word}
              </Text>
              
              {showAnswer && (
                <>
                  <Text className="text-xl text-muted">{currentWord.phonetic}</Text>
                  
                  <View className="w-full gap-3 mt-4">
                    {currentWord.definitions.map((def, index) => (
                      <View key={index} className="gap-1">
                        <View className="flex-row items-center gap-2">
                          <View className="bg-primary/20 px-2 py-1 rounded">
                            <Text className="text-xs font-semibold text-primary">{def.partOfSpeech}</Text>
                          </View>
                          <Text className="text-base text-foreground font-medium flex-1">{def.meaning}</Text>
                        </View>
                        {def.exampleSentence && (
                          <Text className="text-sm text-muted italic ml-2">{def.exampleSentence}</Text>
                        )}
                      </View>
                    ))}
                  </View>

                  {currentWord.examples.length > 0 && (
                    <View className="w-full mt-4 p-4 bg-background rounded-xl">
                      <Text className="text-xs font-semibold text-muted mb-2">例句：</Text>
                      <Text className="text-sm text-foreground">{currentWord.examples[0]}</Text>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Action Buttons */}
            {!showAnswer ? (
              <AnimatedButton
                onPress={() => setShowAnswer(true)}
                variant="primary"
                className="w-full py-4"
              >
                <Text className="text-background font-bold text-lg">显示答案</Text>
              </AnimatedButton>
            ) : (
              <View className="w-full gap-3">
                <Text className="text-sm text-muted text-center mb-2">你掌握这个单词吗？</Text>
                
                <View className="flex-row gap-3">
                  <AnimatedButton
                    onPress={() => handleKnow(1)}
                    variant="secondary"
                    className="flex-1 py-4 bg-error/10 border-error/30"
                  >
                    <Text className="text-error font-semibold">不认识</Text>
                  </AnimatedButton>
                  
                  <AnimatedButton
                    onPress={() => handleKnow(3)}
                    variant="secondary"
                    className="flex-1 py-4 bg-warning/10 border-warning/30"
                  >
                    <Text className="text-warning font-semibold">模糊</Text>
                  </AnimatedButton>
                  
                  <AnimatedButton
                    onPress={() => handleKnow(5)}
                    variant="secondary"
                    className="flex-1 py-4 bg-success/10 border-success/30"
                  >
                    <Text className="text-success font-semibold">认识</Text>
                  </AnimatedButton>
                </View>
              </View>
            )}
          </View>

          {/* Stats */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-around">
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary">{learnedCount}</Text>
                <Text className="text-xs text-muted mt-1">已学习</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-muted">{words.length - currentIndex - 1}</Text>
                <Text className="text-xs text-muted mt-1">剩余</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">{words.length}</Text>
                <Text className="text-xs text-muted mt-1">总计</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
