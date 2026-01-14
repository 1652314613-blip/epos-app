import { useState, useEffect } from "react";
import { ScrollView, Text, View, Alert, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { addWord, type Word, type Definition } from "@/lib/vocabulary-storage";

export default function WordDetailScreen() {
  const colors = useColors();
  const params = useLocalSearchParams();
  const [wordData, setWordData] = useState<any>(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (params.wordData) {
      try {
        const data = JSON.parse(params.wordData as string);
        setWordData(data);
      } catch (error) {
        console.error("Error parsing word data:", error);
      }
    }
  }, [params.wordData]);

  const handleAddToVocabulary = async () => {
    if (!wordData) return;

    try {
      await addWord({
        word: wordData.word,
        phonetic: wordData.phonetic || "",
        definitions: wordData.definitions || [],
        examples: wordData.examples || [],
      });

      setIsAdded(true);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert("添加成功", "单词已添加到单词本");
    } catch (error) {
      Alert.alert("添加失败", "请稍后重试");
    }
  };

  if (!wordData) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">加载中...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Back Button */}
          <AnimatedButton
            onPress={() => router.back()}
            variant="secondary"
            className="self-start px-4 py-2"
          >
            <Text className="text-primary font-semibold">← 返回</Text>
          </AnimatedButton>

          {/* Word Header */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
            <View className="gap-2">
              <Text className="text-4xl font-bold text-foreground">{wordData.word}</Text>
              {wordData.phonetic && (
                <Text className="text-lg text-muted">{wordData.phonetic}</Text>
              )}
            </View>

            {/* Add to Vocabulary Button */}
            {!params.wordId && (
              <AnimatedButton
                onPress={handleAddToVocabulary}
                disabled={isAdded}
                variant={isAdded ? "secondary" : "primary"}
                className="py-3"
              >
                <Text className={`font-semibold ${isAdded ? "text-primary" : "text-background"}`}>
                  {isAdded ? "✓ 已添加到单词本" : "+ 添加到单词本"}
                </Text>
              </AnimatedButton>
            )}
          </View>

          {/* Definitions */}
          <View className="gap-4">
            <Text className="text-xl font-bold text-foreground">📖 释义</Text>
            {wordData.definitions && wordData.definitions.length > 0 ? (
              wordData.definitions.map((def: Definition, index: number) => (
                <View key={index} className="bg-surface rounded-2xl p-4 border border-border gap-2">
                  <View className="flex-row items-center gap-2">
                    <View className="bg-primary/20 px-3 py-1 rounded-full">
                      <Text className="text-xs font-semibold text-primary">{def.partOfSpeech}</Text>
                    </View>
                  </View>
                  <Text className="text-base text-foreground font-medium">{def.meaning}</Text>
                  {def.exampleSentence && (
                    <View className="mt-2 pl-3 border-l-2" style={{ borderLeftColor: colors.muted }}>
                      <Text className="text-sm text-muted italic">{def.exampleSentence}</Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text className="text-muted">暂无释义</Text>
            )}
          </View>

          {/* Examples */}
          {wordData.examples && wordData.examples.length > 0 && (
            <View className="gap-4">
              <Text className="text-xl font-bold text-foreground">💡 例句</Text>
              {wordData.examples.map((example: string, index: number) => (
                <View key={index} className="bg-surface rounded-2xl p-4 border border-border">
                  <Text className="text-sm text-foreground">{example}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Memory Tip */}
          {wordData.memoryTip && (
            <View className="bg-warning/10 rounded-2xl p-4 border border-warning/30 gap-2">
              <Text className="text-base font-semibold text-foreground">💡 记忆技巧</Text>
              <Text className="text-sm text-foreground">{wordData.memoryTip}</Text>
            </View>
          )}

          {/* Word Root */}
          {wordData.wordRoot && (
            <View className="bg-primary/10 rounded-2xl p-4 border border-primary/30 gap-2">
              <Text className="text-base font-semibold text-foreground">🌱 词根词缀</Text>
              <Text className="text-sm text-foreground">{wordData.wordRoot}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
