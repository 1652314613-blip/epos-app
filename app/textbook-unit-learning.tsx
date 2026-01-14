import { useState, useEffect } from "react";
import { ScrollView, Text, View, Alert, ActivityIndicator, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedListItem } from "@/components/animated-list-item";
import { trpc } from "@/lib/trpc";
import { getUnitVocabulary, saveUnitVocabulary, type TextbookUnit, type GrammarPoint } from "@/lib/textbook-vocabulary";
import { getUnitProgress, calculateUnitCompletion, type UnitProgress } from "@/services/unit-progress-service";
import { tagGrammarPoints, getTagColor, getTagBackgroundColor, type ExamTag, type TaggedItem } from "@/services/exam-tag-service";

export default function TextbookUnitLearningScreen() {
  const colors = useColors();
  const params = useLocalSearchParams();
  
  const grade = parseInt(params.grade as string);
  const book = params.book as string;
  const unit = parseInt(params.unit as string);
  const bookTitle = params.bookTitle as string;

  const [unitData, setUnitData] = useState<TextbookUnit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"vocabulary" | "grammar">("vocabulary");
  const [unitProgress, setUnitProgress] = useState<UnitProgress | null>(null);
  const [grammarTags, setGrammarTags] = useState<Map<string, TaggedItem>>(new Map());
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  const generateVocabMutation = trpc.textbook.generateUnitVocabulary.useMutation();
  const generateGrammarMutation = trpc.textbook.generateUnitGrammar.useMutation();

  useEffect(() => {
    loadUnitData();
  }, []);

  const loadUnitData = async () => {
    setIsLoading(true);
    
    // 对于七年级上册，优先使用增强版本地数据
    if (grade === 7 && book === "7A") {
      try {
        const { getGrade7AUnitEnhanced } = await import("@/lib/textbook-grade7a-data-enhanced");
        
        const localData = getGrade7AUnitEnhanced(unit);
        
        if (localData) {
          setUnitData(localData);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log("加载七年级上册增强数据失败，尝试从缓存加载", error);
      }
    }
    
    // 对于七年级下册，优先使用本地数据
    if (grade === 7 && book === "7B") {
      try {
        const { getGrade7BUnit } = await import("@/lib/textbook-grade7b-data");
        
        const localData = getGrade7BUnit(unit);
        
        if (localData) {
          setUnitData(localData);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log("加载七年级下册本地数据失败，尝试从缓存加载", error);
      }
    }
    
    // 其他教材：先尝试从缓存加载
    let cached = await getUnitVocabulary(grade, book, unit);
    
    if (!cached) {
      // 生成词汇
      try {
        const vocabResult = await generateVocabMutation.mutateAsync({
          grade,
          book,
          unit,
        });

        cached = {
          grade,
          book,
          unit,
          title: vocabResult.unitTitle || `Unit ${unit}`,
          wordCount: vocabResult.words.length,
          words: vocabResult.words.map((w: any, index: number) => ({
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
      } catch (error) {
        Alert.alert("加载失败", "无法加载单元内容，请检查网络后重试");
        setIsLoading(false);
        return;
      }
    }

    // 生成语法（如果还没有）
    if (!cached.grammar) {
      try {
        const vocabulary = cached.words.map(w => w.word);
        const grammarResult = await generateGrammarMutation.mutateAsync({
          grade,
          book,
          unit,
          unitTitle: cached.title,
          vocabulary,
        });

        cached.grammar = {
          points: grammarResult.grammarPoints.map((gp: any, index: number) => ({
            id: `${grade}_${book}_u${unit}_g${index}`,
            title: gp.title,
            category: gp.category,
            explanation: gp.explanation,
            rules: gp.rules,
            examples: gp.examples,
            commonMistakes: gp.commonMistakes,
          })),
          pointCount: grammarResult.grammarPoints.length,
        };
      } catch (error) {
        console.error("Error generating grammar:", error);
        // 语法生成失败不影响词汇显示
      }
    }

    // 保存到缓存
    await saveUnitVocabulary(cached);
    setUnitData(cached);
    
    // 加载进度
    const progress = await getUnitProgress(grade, book, unit);
    if (progress) {
      setUnitProgress(progress);
    } else {
      // 初始化进度
      setUnitProgress({
        grade,
        book,
        unit,
        vocabularyLearned: 0,
        vocabularyTotal: cached.words.length,
        grammarLearned: 0,
        grammarTotal: cached.grammar?.pointCount || 0,
        quizzesTaken: 0,
        lastStudied: new Date().toISOString(),
      });
    }
    
    setIsLoading(false);
    
    // 加载语法标签
    if (cached.grammar && cached.grammar.points.length > 0) {
      loadGrammarTags(cached.grammar.points);
    }
  };

  const loadGrammarTags = async (points: GrammarPoint[]) => {
    setIsLoadingTags(true);
    try {
      const tagged = await tagGrammarPoints(
        points.map(p => ({
          title: p.title,
          explanation: p.explanation,
          category: p.category,
        })),
        grade
      );
      
      const tagMap = new Map<string, TaggedItem>();
      points.forEach((point, index) => {
        if (tagged[index]) {
          tagMap.set(point.id, tagged[index]);
        }
      });
      setGrammarTags(tagMap);
    } catch (error) {
      console.error("Failed to load grammar tags:", error);
    }
    setIsLoadingTags(false);
  };

  if (isLoading) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-4">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-base text-muted">正在生成单元内容...</Text>
          <Text className="text-sm text-muted">首次加载需要10-20秒</Text>
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
            {unitData.theme && (
              <Text className="text-sm text-muted">主题：{unitData.theme}</Text>
            )}
          </View>

          {/* Progress Bar */}
          {unitProgress && (
            <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-foreground">📈 学习进度</Text>
                <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {calculateUnitCompletion(unitProgress)}%
                </Text>
              </View>
              
              {/* Progress Bar Visual */}
              <View className="h-2 rounded-full" style={{ backgroundColor: colors.border }}>
                <View 
                  className="h-2 rounded-full" 
                  style={{ 
                    backgroundColor: colors.primary,
                    width: `${calculateUnitCompletion(unitProgress)}%`,
                  }} 
                />
              </View>

              {/* Details */}
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-xs text-muted">词汇</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {unitProgress.vocabularyLearned}/{unitProgress.vocabularyTotal}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted">语法</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {unitProgress.grammarLearned}/{unitProgress.grammarTotal}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted">测试</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {unitProgress.quizzesTaken} 次
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Tab Selector */}
          <View className="flex-row gap-2">
            <AnimatedButton
              onPress={() => setActiveTab("vocabulary")}
              variant={activeTab === "vocabulary" ? "primary" : "secondary"}
              className="flex-1 py-3"
            >
              <Text
                className={`font-semibold ${
                  activeTab === "vocabulary" ? "text-background" : "text-primary"
                }`}
              >
                📚 词汇 ({unitData.wordCount})
              </Text>
            </AnimatedButton>
            <AnimatedButton
              onPress={() => setActiveTab("grammar")}
              variant={activeTab === "grammar" ? "primary" : "secondary"}
              className="flex-1 py-3"
            >
              <Text
                className={`font-semibold ${
                  activeTab === "grammar" ? "text-background" : "text-primary"
                }`}
              >
                📖 语法 ({unitData.grammar?.pointCount || 0})
              </Text>
            </AnimatedButton>
          </View>

          {/* Quiz Button */}
          {grade === 7 && book === "7A" && unitData.words.length > 0 && (
            <AnimatedButton
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                router.push({
                  pathname: "/vocabulary-quiz" as any,
                  params: {
                    grade,
                    book,
                    unit,
                    unitTitle: unitData.title,
                  },
                });
              }}
              className="bg-success rounded-2xl py-4 px-6 flex-row items-center justify-center gap-2"
            >
              <Text className="text-2xl">🎯</Text>
              <Text className="text-background font-bold text-lg">
                开始词汇测试
              </Text>
            </AnimatedButton>
          )}

          {/* Content */}
          {activeTab === "vocabulary" ? (
            <View className="gap-3">
              <AnimatedButton
                onPress={() => {
                  router.push({
                    pathname: "/textbook-unit-words" as any,
                    params: {
                      grade,
                      book,
                      unit,
                      bookTitle,
                    },
                  });
                }}
                variant="primary"
                className="py-3"
              >
                <Text className="text-background font-semibold">查看完整词汇表</Text>
              </AnimatedButton>

              <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
                <Text className="text-base font-semibold text-foreground">词汇学习</Text>
                <Text className="text-sm text-muted">
                  • 共 {unitData.wordCount} 个核心词汇{"\n"}
                  • 包含音标、释义和例句{"\n"}
                  • 可批量添加到单词本{"\n"}
                  • 支持卡片式记忆学习
                </Text>
              </View>
            </View>
          ) : (
            <View className="gap-3">
              {unitData.grammar && unitData.grammar.points.length > 0 ? (
                unitData.grammar.points.map((point, index) => (
                  <AnimatedListItem key={point.id} index={index}>
                    <AnimatedButton
                      onPress={() => {
                        router.push({
                          pathname: "/grammar-point-detail" as any,
                          params: {
                            pointId: point.id,
                            title: point.title,
                            category: point.category,
                            explanation: point.explanation,
                            rules: JSON.stringify(point.rules),
                            examples: JSON.stringify(point.examples),
                            commonMistakes: JSON.stringify(point.commonMistakes),
                          },
                        });
                      }}
                      variant="secondary"
                      className="bg-surface border border-border p-0"
                    >
                      <View className="p-4 w-full gap-2">
                        <View className="flex-row items-center justify-between">
                          <Text className="text-lg font-bold text-foreground flex-1">
                            {point.title}
                          </Text>
                          <View className="flex-row gap-2">
                            {grammarTags.get(point.id)?.tag && (
                              <View 
                                className="px-2 py-1 rounded-full"
                                style={{ 
                                  backgroundColor: getTagBackgroundColor(grammarTags.get(point.id)!.tag),
                                }}
                              >
                                <Text 
                                  className="text-xs font-semibold"
                                  style={{ color: getTagColor(grammarTags.get(point.id)!.tag) }}
                                >
                                  {grammarTags.get(point.id)!.tag}
                                </Text>
                              </View>
                            )}
                            <View className="bg-primary/20 px-3 py-1 rounded-full">
                              <Text className="text-xs font-semibold text-primary">
                                {point.category}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <Text className="text-sm text-muted" numberOfLines={2}>
                          {point.explanation}
                        </Text>
                        <Text className="text-xs text-primary">点击查看详细讲解 →</Text>
                      </View>
                    </AnimatedButton>
                  </AnimatedListItem>
                ))
              ) : (
                <View className="bg-surface rounded-2xl p-6 items-center gap-2">
                  <Text className="text-4xl">📖</Text>
                  <Text className="text-base font-semibold text-foreground">暂无语法内容</Text>
                  <Text className="text-sm text-muted">该单元的语法内容正在准备中</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
