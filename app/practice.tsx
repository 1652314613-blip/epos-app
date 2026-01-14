import { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { incrementPracticeCount } from "@/lib/storage";

interface Exercise {
  incorrect: string;
  correct: string;
  explanation: string;
  errorType: string;
}

export default function PracticeScreen() {
  const params = useLocalSearchParams();
  const colors = useColors();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const wrongBookItemId = params.wrongBookItemId as string;
  const errorTypes = params.errorTypes ? JSON.parse(params.errorTypes as string) : [];

  const generateMutation = trpc.practice.generateExercises.useMutation({
    onSuccess: (data) => {
      setExercises(data.exercises);
    },
    onError: (error) => {
      console.error("Failed to generate exercises:", error);
      alert("生成练习题失败，请重试");
    },
  });

  useEffect(() => {
    // Generate exercises on mount
    generateMutation.mutate({
      errorTypes,
      originalSentence: "",
      count: 5,
      gradeLevel: 9,
    });
  }, []);

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const currentExercise = exercises[currentIndex];
    const correct =
      userAnswer.trim().toLowerCase() === currentExercise.correct.trim().toLowerCase();

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
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

  const handleNext = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setShowResult(false);
      setIsCorrect(false);
    } else {
      // Completed all exercises
      setCompleted(true);
      // Update practice count
      if (wrongBookItemId) {
        await incrementPracticeCount(wrongBookItemId);
      }
    }
  };

  const handleRetry = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleFinish = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  if (generateMutation.isPending) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 items-center justify-center p-6">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-base text-muted mt-4">正在生成练习题...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (completed) {
    const percentage = Math.round((score / exercises.length) * 100);
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 items-center justify-center p-6 gap-6">
          <View
            className="w-32 h-32 rounded-full items-center justify-center"
            style={{
              backgroundColor:
                percentage >= 80
                  ? `${colors.success}20`
                  : percentage >= 60
                    ? `${colors.warning}20`
                    : `${colors.error}20`,
            }}
          >
            <Text
              className="text-5xl font-bold"
              style={{
                color:
                  percentage >= 80 ? colors.success : percentage >= 60 ? colors.warning : colors.error,
              }}
            >
              {percentage}%
            </Text>
          </View>

          <View className="items-center gap-2">
            <Text className="text-2xl font-bold text-foreground">练习完成！</Text>
            <Text className="text-base text-muted">
              正确 {score} / {exercises.length} 题
            </Text>
          </View>

          <View className="w-full gap-3">
            <TouchableOpacity
              onPress={() => {
                setCurrentIndex(0);
                setUserAnswer("");
                setShowResult(false);
                setIsCorrect(false);
                setScore(0);
                setCompleted(false);
              }}
              style={{ backgroundColor: colors.primary }}
              className="py-4 rounded-full items-center"
            >
              <Text className="text-white font-semibold text-base">再练一次</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleFinish}
              style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
              className="py-4 rounded-full items-center"
            >
              <Text className="font-semibold text-base" style={{ color: colors.foreground }}>
                返回
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (exercises.length === 0) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-base text-muted">暂无练习题</Text>
        </View>
      </ScreenContainer>
    );
  }

  const currentExercise = exercises[currentIndex];

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="p-6 gap-5">
          {/* Progress Header */}
          <View className="pt-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-semibold text-foreground">
                练习 {currentIndex + 1} / {exercises.length}
              </Text>
              <Text className="text-sm text-muted">
                得分: {score} / {currentIndex + (showResult ? 1 : 0)}
              </Text>
            </View>
            <View className="h-2 bg-surface rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
                style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
              />
            </View>
          </View>

          {/* Error Type Badge */}
          <View className="flex-row flex-wrap gap-2">
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <Text className="text-xs font-medium" style={{ color: colors.primary }}>
                {currentExercise.errorType}
              </Text>
            </View>
          </View>

          {/* Question */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-sm font-semibold text-muted mb-3">找出并改正下面句子的错误：</Text>
            <View className="bg-error/10 rounded-xl p-4">
              <Text className="text-base text-foreground leading-relaxed">
                {currentExercise.incorrect}
              </Text>
            </View>
          </View>

          {/* Answer Input */}
          {!showResult ? (
            <View className="bg-surface rounded-2xl p-5 border border-border">
              <Text className="text-sm font-semibold text-foreground mb-3">你的答案：</Text>
              <TextInput
                value={userAnswer}
                onChangeText={setUserAnswer}
                placeholder="输入正确的句子..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={3}
                returnKeyType="done"
                className="bg-background rounded-xl p-4 text-base text-foreground min-h-[100px]"
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  textAlignVertical: "top",
                }}
              />

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!userAnswer.trim()}
                style={{
                  backgroundColor: !userAnswer.trim() ? colors.muted : colors.primary,
                }}
                className="mt-4 py-3 rounded-full items-center"
              >
                <Text className="text-white font-semibold text-base">提交答案</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {/* Result */}
              <View
                className="rounded-2xl p-5 border mb-4"
                style={{
                  backgroundColor: isCorrect ? `${colors.success}10` : `${colors.error}10`,
                  borderColor: isCorrect ? colors.success : colors.error,
                }}
              >
                <View className="flex-row items-center gap-2 mb-3">
                  <Text className="text-2xl">{isCorrect ? "✓" : "✗"}</Text>
                  <Text
                    className="text-lg font-bold"
                    style={{ color: isCorrect ? colors.success : colors.error }}
                  >
                    {isCorrect ? "正确！" : "不太对"}
                  </Text>
                </View>

                {!isCorrect && (
                  <View className="gap-3">
                    <View>
                      <Text className="text-xs text-muted mb-1">你的答案：</Text>
                      <Text className="text-sm text-foreground">{userAnswer}</Text>
                    </View>
                    <View>
                      <Text className="text-xs text-muted mb-1">正确答案：</Text>
                      <Text className="text-sm font-medium" style={{ color: colors.success }}>
                        {currentExercise.correct}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Explanation */}
              <View className="bg-surface rounded-2xl p-5 border border-border mb-4">
                <Text className="text-sm font-semibold text-foreground mb-2">💡 解释：</Text>
                <Text className="text-sm text-foreground leading-relaxed">
                  {currentExercise.explanation}
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="gap-3">
                {!isCorrect && (
                  <TouchableOpacity
                    onPress={handleRetry}
                    style={{ backgroundColor: colors.warning }}
                    className="py-3 rounded-full items-center"
                  >
                    <Text className="text-white font-semibold text-base">重新作答</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleNext}
                  style={{ backgroundColor: colors.primary }}
                  className="py-3 rounded-full items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    {currentIndex < exercises.length - 1 ? "下一题" : "完成练习"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
