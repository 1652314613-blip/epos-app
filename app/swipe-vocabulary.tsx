/**
 * Swipe Vocabulary Learning Page (Enhanced & Optimized)
 * 
 * 优化内容:
 * 1. 布局重构 - 下移卡片,增加顶部Safe Area间距
 * 2. 卡片美化 - 添加边框和阴影效果
 * 3. 交互按钮优化 - 精致的卡片样式,缩小高度
 * 4. 视觉风格一致性 - Dark Mode + 微妙色彩细节
 */

import { useState, useEffect } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { Flashcard } from "@/components/flashcard";
import { AnimatedButton } from "@/components/animated-button";
import { useColors } from "@/hooks/use-colors";
import { getTextbookData } from "@/lib/textbook-data-combined";
import type { TextbookWord } from "@/lib/textbook-vocabulary";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

type MasteryLevel = "unknown" | "learning" | "familiar" | "mastered";

interface CardProgress {
  wordId: string;
  masteryLevel: MasteryLevel;
  reviewCount: number;
  lastReviewed: number;
  nextReview: number;
}

export default function SwipeVocabularyScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ unit?: string; book?: string }>();
  
  const [vocabulary, setVocabulary] = useState<TextbookWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<Map<string, CardProgress>>(new Map());
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    unknown: 0,
    learning: 0,
    familiar: 0,
    mastered: 0,
  });
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    loadVocabulary();
    loadProgress();
  }, [params.unit, params.book]);

  const loadVocabulary = () => {
    const data = getTextbookData();
    let vocabList: TextbookWord[] = [];

    const { unit, book } = params;

    if (book && unit) {
      const bookData = data.books.find((b) => b.book === book);
      if (bookData) {
        const unitData = bookData.units.find((u) => u.unit === parseInt(unit));
        if (unitData) {
          vocabList = unitData.words;
        }
      }
    } else if (book) {
      const bookData = data.books.find((b) => b.book === book);
      if (bookData) {
        vocabList = bookData.units.flatMap((u) => u.words);
      }
    } else {
      vocabList = data.books.flatMap((b) => b.units.flatMap((u) => u.words));
    }

    const shuffled = vocabList.sort(() => Math.random() - 0.5);
    setVocabulary(shuffled);
    setSessionStats((prev) => ({ ...prev, total: shuffled.length }));
  };

  const loadProgress = async () => {
    try {
      const stored = await AsyncStorage.getItem("flashcard_progress");
      if (stored) {
        const progressData = JSON.parse(stored);
        setProgress(new Map(Object.entries(progressData)));
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  };

  const saveProgress = async (newProgress: Map<string, CardProgress>) => {
    try {
      const progressData = Object.fromEntries(newProgress);
      await AsyncStorage.setItem("flashcard_progress", JSON.stringify(progressData));
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const updateWordProgress = (wordId: string, masteryLevel: MasteryLevel) => {
    const now = Date.now();
    const existing = progress.get(wordId);
    
    const intervals = {
      unknown: 0,
      learning: 1000 * 60 * 60 * 24,
      familiar: 1000 * 60 * 60 * 24 * 3,
      mastered: 1000 * 60 * 60 * 24 * 7,
    };

    const newProgress: CardProgress = {
      wordId,
      masteryLevel,
      reviewCount: (existing?.reviewCount || 0) + 1,
      lastReviewed: now,
      nextReview: now + intervals[masteryLevel],
    };

    const updatedProgress = new Map(progress);
    updatedProgress.set(wordId, newProgress);
    setProgress(updatedProgress);
    saveProgress(updatedProgress);

    setSessionStats((prev) => ({
      ...prev,
      [masteryLevel]: prev[masteryLevel] + 1,
    }));

    // 分级触觉反馈
    if (Platform.OS !== "web") {
      switch (masteryLevel) {
        case "unknown":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case "learning":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case "familiar":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "mastered":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }, 100);
          break;
      }
    }
  };

  const handleMastery = (level: MasteryLevel) => {
    const currentWord = vocabulary[currentIndex];
    if (currentWord) {
      updateWordProgress(currentWord.id, level);
    }

    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSessionStats({
      total: vocabulary.length,
      unknown: 0,
      learning: 0,
      familiar: 0,
      mastered: 0,
    });
    setIsCompleted(false);
    loadVocabulary();
  };

  if (vocabulary.length === 0) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-2xl font-bold text-foreground">加载中...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (isCompleted) {
    const totalReviewed = sessionStats.unknown + sessionStats.learning + sessionStats.familiar + sessionStats.mastered;
    const masteryRate = totalReviewed > 0 
      ? Math.round(((sessionStats.familiar + sessionStats.mastered) / totalReviewed) * 100)
      : 0;

    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-6">
          <Text className="text-4xl">🎉</Text>
          <Text className="text-3xl font-bold text-foreground">完成学习！</Text>
          
          <View className="w-full max-w-sm bg-surface rounded-2xl p-6 gap-4 border border-border">
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted">总词汇数</Text>
              <Text className="text-xl font-bold text-foreground">{vocabulary.length}</Text>
            </View>
            
            <View className="h-px bg-border" />
            
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted">😕 不认识</Text>
              <Text className="text-xl font-bold text-red-600">{sessionStats.unknown}</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted">🤔 学习中</Text>
              <Text className="text-xl font-bold text-yellow-600">{sessionStats.learning}</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted">😊 熟悉</Text>
              <Text className="text-xl font-bold text-blue-600">{sessionStats.familiar}</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted">🎉 掌握</Text>
              <Text className="text-xl font-bold text-green-600">{sessionStats.mastered}</Text>
            </View>
            
            <View className="h-px bg-border my-2" />
            
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted">掌握率</Text>
              <Text className="text-2xl font-bold text-primary">{masteryRate}%</Text>
            </View>
          </View>

          <View className="flex-row gap-4 mt-4">
            <AnimatedButton onPress={handleRestart} variant="primary">
              <Text className="text-base font-semibold text-background px-4">
                再来一次
              </Text>
            </AnimatedButton>

            <AnimatedButton onPress={() => router.back()} variant="secondary">
              <Text className="text-base font-semibold text-foreground px-4">
                返回
              </Text>
            </AnimatedButton>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const currentWord = vocabulary[currentIndex];
  const currentProgress = progress.get(currentWord.id);

  return (
    <ScreenContainer>
      <View className="flex-1 px-5 pt-16 pb-5 gap-4">
        {/* 标题和进度 - 增加顶部Safe Area间距 */}
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="w-8 h-8 items-center justify-center"
          >
            <Text className="text-xl text-foreground">←</Text>
          </Pressable>
          
          <View className="flex-1 items-center">
            <Text className="text-lg font-semibold text-foreground">
              滑动学单词
            </Text>
            <Text className="text-xs text-muted">
              {currentIndex + 1} / {vocabulary.length}
            </Text>
          </View>
          
          <View className="w-8" />
        </View>

        {/* 翻转卡片 - 居中垂直对齐,添加边框和阴影 */}
        <View className="flex-1 items-center justify-center">
          <View 
            style={{ 
              width: '100%', 
              maxWidth: 340, 
              aspectRatio: 0.75,
              // 添加极其细微的边框和阴影
              borderWidth: 0.5,
              borderColor: colors.border,
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Flashcard word={currentWord} />
          </View>
        </View>

        {/* 掌握程度选择 - 精致卡片样式,缩小高度 */}
        <View className="gap-2">
          <Text className="text-sm font-medium text-muted text-center mb-1">
            你对这个单词的掌握程度?
          </Text>
          
          {/* 第一行 */}
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => handleMastery("unknown")}
              onPressIn={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={({ pressed }) => ([
                {
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderWidth: 0.5,
                  borderColor: colors.border,
                  opacity: pressed ? 0.6 : 1,
                  // 微妙的阴影
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.03,
                  shadowRadius: 2,
                  elevation: 1,
                }
              ])}
            >
              <View className="items-center gap-0.5">
                <Text className="text-xl">😕</Text>
                <Text className="text-xs font-medium text-foreground">不认识</Text>
                <Text className="text-[9px] text-gray-400">立即复习</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => handleMastery("learning")}
              onPressIn={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={({ pressed }) => ([
                {
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderWidth: 0.5,
                  borderColor: colors.border,
                  opacity: pressed ? 0.6 : 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.03,
                  shadowRadius: 2,
                  elevation: 1,
                }
              ])}
            >
              <View className="items-center gap-0.5">
                <Text className="text-xl">🤔</Text>
                <Text className="text-xs font-medium text-foreground">学习中</Text>
                <Text className="text-[9px] text-gray-400">1天后</Text>
              </View>
            </Pressable>
          </View>

          {/* 第二行 */}
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => handleMastery("familiar")}
              onPressIn={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={({ pressed }) => ([
                {
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderWidth: 0.5,
                  borderColor: colors.border,
                  opacity: pressed ? 0.6 : 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.03,
                  shadowRadius: 2,
                  elevation: 1,
                }
              ])}
            >
              <View className="items-center gap-0.5">
                <Text className="text-xl">😊</Text>
                <Text className="text-xs font-medium text-foreground">熟悉</Text>
                <Text className="text-[9px] text-gray-400">3天后</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => handleMastery("mastered")}
              onPressIn={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
              style={({ pressed }) => ([
                {
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderWidth: 0.5,
                  borderColor: colors.border,
                  opacity: pressed ? 0.6 : 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.03,
                  shadowRadius: 2,
                  elevation: 1,
                }
              ])}
            >
              <View className="items-center gap-0.5">
                <Text className="text-xl">🎉</Text>
                <Text className="text-xs font-medium text-foreground">掌握</Text>
                <Text className="text-[9px] text-gray-400">7天后</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* 导航按钮 - 半透明背景或幽灵按钮样式 */}
        <View className="flex-row gap-2">
          <Pressable
            onPress={handlePrevious}
            disabled={currentIndex === 0}
            style={({ pressed }) => ([
              {
                flex: 1,
                backgroundColor: 'transparent',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderWidth: 0.5,
                borderColor: colors.border,
                alignItems: 'center',
                opacity: currentIndex === 0 ? 0.3 : pressed ? 0.5 : 1,
              }
            ])}
          >
            <Text className="text-sm font-medium text-foreground">← 上一个</Text>
          </Pressable>

          <Pressable
            onPress={() => handleMastery("learning")}
            style={({ pressed }) => ([
              {
                flex: 1,
                backgroundColor: 'transparent',
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderWidth: 0.5,
                borderColor: colors.border,
                alignItems: 'center',
                opacity: pressed ? 0.5 : 1,
              }
            ])}
          >
            <Text className="text-sm font-medium text-foreground">跳过 →</Text>
          </Pressable>
        </View>

        {/* 当前单词进度提示 */}
        {currentProgress && (
          <View 
            style={{
              backgroundColor: colors.surface,
              borderRadius: 8,
              padding: 8,
              borderWidth: 0.5,
              borderColor: colors.border,
            }}
          >
            <Text className="text-[10px] text-muted text-center">
              已复习 {currentProgress.reviewCount} 次 •{" "}
              {currentProgress.masteryLevel === "unknown" && "待学习"}
              {currentProgress.masteryLevel === "learning" && "学习中"}
              {currentProgress.masteryLevel === "familiar" && "已熟悉"}
              {currentProgress.masteryLevel === "mastered" && "已掌握"}
            </Text>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
