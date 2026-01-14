import { useState, useEffect } from "react";
import { ScrollView, Text, View, Alert, ActivityIndicator, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedListItem } from "@/components/animated-list-item";
import { trpc } from "@/lib/trpc";
import { getUnitVocabulary, saveUnitVocabulary, type TextbookUnit, type TextbookWord } from "@/lib/textbook-vocabulary";
import { addWord } from "@/lib/vocabulary-storage";
import { speakWord, speakSentence } from "@/lib/tts-utils";

export default function TextbookUnitWordsScreen() {
  const colors = useColors();
  const params = useLocalSearchParams();
  
  const grade = parseInt(params.grade as string);
  const book = params.book as string;
  const unit = parseInt(params.unit as string);
  const bookTitle = params.bookTitle as string;

  const [unitData, setUnitData] = useState<TextbookUnit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingAll, setIsAddingAll] = useState(false);

  const generateMutation = trpc.textbook.generateUnitVocabulary.useMutation();

  useEffect(() => {
    loadUnitData();
  }, []);

  const loadUnitData = async () => {
    setIsLoading(true);
    
    // 先尝试从缓存加载
    const cached = await getUnitVocabulary(grade, book, unit);
    if (cached) {
      setUnitData(cached);
      setIsLoading(false);
      return;
    }

    // 缓存不存在，使用AI生成
    try {
      const result = await generateMutation.mutateAsync({
        grade,
        book,
        unit,
      });

      // 转换格式
      const unitVocabulary: TextbookUnit = {
        grade,
        book,
        unit,
        title: result.unitTitle || `Unit ${unit}`,
        wordCount: result.words.length,
        words: result.words.map((w: any, index: number) => ({
          id: `${grade}_${book}_u${unit}_${index}`,
          word: w.word,
          phonetic: w.phonetic,
          grade,
          book,
          unit,
          definitions: [
            {
              partOfSpeech: w.partOfSpeech,
              meaning: w.meaning,
              exampleSentence: w.examples[0] || "",
            },
          ],
          examples: w.examples || [],
          difficulty: "basic" as const,
          frequency: "high" as const,
        })),
      };

      // 保存到缓存
      await saveUnitVocabulary(unitVocabulary);
      setUnitData(unitVocabulary);
    } catch (error) {
      Alert.alert("加载失败", "无法加载单元词汇，请检查网络后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllWords = async () => {
    if (!unitData || unitData.words.length === 0) return;

    setIsAddingAll(true);
    try {
      for (const word of unitData.words) {
        await addWord({
          word: word.word,
          phonetic: word.phonetic,
          definitions: word.definitions,
          examples: word.examples,
        });
      }

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert("添加成功", `已将 ${unitData.words.length} 个单词添加到单词本`);
    } catch (error) {
      Alert.alert("添加失败", "请稍后重试");
    } finally {
      setIsAddingAll(false);
    }
  };

  const handleAddSingleWord = async (word: TextbookWord) => {
    try {
      await addWord({
        word: word.word,
        phonetic: word.phonetic,
        definitions: word.definitions,
        examples: word.examples,
      });

      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      Alert.alert("添加成功", `"${word.word}" 已添加到单词本`);
    } catch (error) {
      Alert.alert("添加失败", "请稍后重试");
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-4">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-base text-muted">正在生成单元词汇表...</Text>
          <Text className="text-sm text-muted">首次加载需要几秒钟</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!unitData) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-4xl">😕</Text>
          <Text className="text-base font-semibold text-foreground">加载失败</Text>
          <AnimatedButton onPress={loadUnitData} variant="primary" className="px-6 py-3">
            <Text className="text-background font-semibold">重试</Text>
          </AnimatedButton>
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

          {/* Header */}
          <View className="gap-2">
            <Text className="text-sm text-muted">{bookTitle}</Text>
            <Text className="text-3xl font-bold text-foreground">{unitData.title}</Text>
            <Text className="text-sm text-muted">共 {unitData.wordCount} 个单词</Text>
          </View>

          {/* Add All Button */}
          <AnimatedButton
            onPress={handleAddAllWords}
            disabled={isAddingAll}
            variant="primary"
            className="py-3"
          >
            {isAddingAll ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-background font-semibold">+ 全部添加到单词本</Text>
            )}
          </AnimatedButton>

          {/* Words List */}
          <View className="gap-3">
            {unitData.words.map((word, index) => (
              <AnimatedListItem key={word.id} index={index}>
                <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 gap-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-xl font-bold text-foreground">{word.word}</Text>
                        <Text className="text-sm text-muted">{word.phonetic}</Text>
                        <AnimatedButton
                          onPress={() => {
                            if (Platform.OS !== "web") {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }
                            speakWord(word.word);
                          }}
                          className="bg-primary/10 rounded-full p-2"
                        >
                          <Text className="text-primary text-base">🔊</Text>
                        </AnimatedButton>
                      </View>
                      {word.definitions.map((def, defIndex) => (
                        <View key={defIndex} className="gap-1">
                          <View className="flex-row items-center gap-2">
                            <View className="bg-primary/20 px-2 py-1 rounded">
                              <Text className="text-xs font-semibold text-primary">{def.partOfSpeech}</Text>
                            </View>
                            <Text className="text-base text-foreground flex-1">{def.meaning}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    <AnimatedButton
                      onPress={() => handleAddSingleWord(word)}
                      variant="secondary"
                      className="bg-primary/10 border-primary/30 px-3 py-1"
                    >
                      <Text className="text-xs font-semibold text-primary">+ 添加</Text>
                    </AnimatedButton>
                  </View>

                  {word.examples.length > 0 && (
                    <View className="pl-3 border-l-2" style={{ borderLeftColor: colors.muted }}>
                      {word.examples.map((example, exIndex) => (
                        <Text key={exIndex} className="text-sm text-muted italic">
                          {example}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </AnimatedListItem>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
