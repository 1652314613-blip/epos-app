import { useState, useEffect } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { AnimatedButton } from "@/components/animated-button";
import { trpc } from "@/lib/trpc";

type Exercise = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export default function GrammarExerciseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { grammarPoint, gradeLevel, grammarType, errorCategory } = params;
  
  // 优先使用grammarType，其次使用grammarPoint
  const targetGrammar = (grammarType as string) || (grammarPoint as string) || "语法练习";

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const generateMutation = trpc.practice.generateGrammarExercises.useMutation();

  useEffect(() => {
    generateExercises();
  }, []);

  const generateExercises = async () => {
    setIsLoading(true);
    try {
      const result = await generateMutation.mutateAsync({
        grammarPoint: targetGrammar,
        gradeLevel: parseInt(gradeLevel as string) || 7,
        count: 5,
      });

      setExercises(result.exercises);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating exercises:", error);
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (index: number) => {
    if (showExplanation) return;

    setSelectedAnswer(index);
    setShowExplanation(true);

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (index === exercises[currentIndex].correctAnswer) {
      setScore(score + 1);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);

      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      // 完成所有练习
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    generateExercises();

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-semibold text-foreground">
            正在生成练习题...
          </Text>
          <Text className="text-base text-muted mt-2">
            AI正在为你准备个性化练习
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (exercises.length === 0) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-xl font-semibold text-foreground">
            生成失败
          </Text>
          <Text className="text-base text-muted text-center">
            无法生成练习题，请稍后重试
          </Text>
          <AnimatedButton onPress={() => router.back()} variant="primary">
            <Text className="text-base font-semibold text-background">
              返回
            </Text>
          </AnimatedButton>
        </View>
      </ScreenContainer>
    );
  }

  const currentExercise = exercises[currentIndex];
  const isCompleted = currentIndex === exercises.length - 1 && showExplanation;

  return (
    <ScreenContainer className="p-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* 标题和进度 */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              📝 语法练习
            </Text>
            <Text className="text-base text-muted">
              {grammarPoint}
            </Text>
            <View className="flex-row items-center gap-2 mt-2">
              <Text className="text-sm text-muted">
                进度: {currentIndex + 1}/{exercises.length}
              </Text>
              <Text className="text-sm text-muted">•</Text>
              <Text className="text-sm text-muted">
                得分: {score}/{exercises.length}
              </Text>
            </View>
          </View>

          {!isCompleted ? (
            <>
              {/* 题目 */}
              <View className="bg-surface rounded-2xl p-6 border border-border">
                <Text className="text-lg font-semibold text-foreground leading-relaxed">
                  {currentExercise.question}
                </Text>
              </View>

              {/* 选项 */}
              <View className="gap-3">
                {currentExercise.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentExercise.correctAnswer;
                  const showResult = showExplanation;

                  let bgColor = "bg-surface";
                  let borderColor = "border-border";
                  let textColor = "text-foreground";

                  if (showResult) {
                    if (isCorrect) {
                      bgColor = "bg-green-50";
                      borderColor = "border-green-500";
                      textColor = "text-green-700";
                    } else if (isSelected) {
                      bgColor = "bg-red-50";
                      borderColor = "border-red-500";
                      textColor = "text-red-700";
                    }
                  } else if (isSelected) {
                    bgColor = "bg-primary/10";
                    borderColor = "border-primary";
                  }

                  return (
                    <View key={index}>
                      <AnimatedButton
                        onPress={() => handleSelectAnswer(index)}
                        variant="secondary"
                        disabled={showExplanation}
                      >
                        <View
                          className={`${bgColor} rounded-xl p-4 border-2 ${borderColor}`}
                        >
                          <Text className={`text-base font-medium ${textColor}`}>
                            {String.fromCharCode(65 + index)}. {option}
                          </Text>
                        </View>
                      </AnimatedButton>
                    </View>
                  );
                })}
              </View>

              {/* 解释 */}
              {showExplanation && (
                <View className="bg-surface rounded-2xl p-6 border border-border gap-3">
                  <Text className="text-lg font-semibold text-foreground">
                    {selectedAnswer === currentExercise.correctAnswer
                      ? "✅ 回答正确！"
                      : "❌ 回答错误"}
                  </Text>
                  <Text className="text-base text-foreground leading-relaxed">
                    {currentExercise.explanation}
                  </Text>
                </View>
              )}

              {/* 下一题按钮 */}
              {showExplanation && (
                <AnimatedButton onPress={handleNext} variant="primary">
                  <Text className="text-base font-semibold text-background">
                    {currentIndex < exercises.length - 1
                      ? "下一题 →"
                      : "查看结果"}
                  </Text>
                </AnimatedButton>
              )}
            </>
          ) : (
            /* 完成页面 */
            <View className="gap-6">
              <View className="bg-surface rounded-2xl p-8 border border-border items-center gap-4">
                <Text className="text-6xl">
                  {score === exercises.length
                    ? "🎉"
                    : score >= exercises.length * 0.6
                    ? "👍"
                    : "💪"}
                </Text>
                <Text className="text-2xl font-bold text-foreground">
                  练习完成！
                </Text>
                <Text className="text-xl text-foreground">
                  得分: {score}/{exercises.length}
                </Text>
                <Text className="text-base text-muted text-center">
                  {score === exercises.length
                    ? "太棒了！全部答对！"
                    : score >= exercises.length * 0.6
                    ? "做得不错！继续加油！"
                    : "别灰心，多练习就会进步！"}
                </Text>
              </View>

              <View className="gap-3">
                <AnimatedButton onPress={handleRestart} variant="primary">
                  <Text className="text-base font-semibold text-background">
                    🔄 重新练习
                  </Text>
                </AnimatedButton>
                <AnimatedButton
                  onPress={() => router.back()}
                  variant="secondary"
                >
                  <Text className="text-base font-semibold text-foreground">
                    返回
                  </Text>
                </AnimatedButton>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
