/**
 * 错题专项突破页面
 * 根据错题知识点,AI实时生成3道针对性练习题
 */

import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";
import { trpc } from "@/lib/trpc";
import * as Haptics from "expo-haptics";
import { updateMasteryLevel } from "@/lib/wrong-book";
import { Ionicons } from "@expo/vector-icons";

interface Exercise {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
}

export default function WrongQuestionBreakthroughScreen() {
  const colors = useColors();
  const params = useLocalSearchParams();
  
  const questionId = params.questionId as string;
  const errorCategory = params.errorCategory as string;
  const grammarPoint = params.grammarPoint as string;
  const gradeLevel = parseInt(params.gradeLevel as string) || 8;
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const generateExercisesMutation = trpc.grammar.generateTargetedExercises.useMutation();

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const result = await generateExercisesMutation.mutateAsync({
        errorCategory,
        grammarPoint,
        difficulty: "medium",
        gradeLevel,
      });
      
      if (result.exercises && result.exercises.length > 0) {
        setExercises(result.exercises);
      } else {
        Alert.alert("提示", "暂时无法生成练习题,请稍后重试");
        router.back();
      }
    } catch (error) {
      console.error("加载练习题失败:", error);
      Alert.alert("错误", "加载练习题失败,请检查网络连接");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (answer: string) => {
    if (showExplanation) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      Alert.alert("提示", "请先选择一个答案");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowExplanation(true);

    const currentExercise = exercises[currentIndex];
    const isCorrect = selectedAnswer === currentExercise.correctAnswer;
    
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentIndex < exercises.length - 1) {
      // 下一题
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // 完成所有练习
      const accuracy = (correctCount / exercises.length) * 100;
      const isCorrect = accuracy >= 60; // 60%以上算掌握
      
      // 更新错题掌握度
      await updateMasteryLevel(questionId, isCorrect);
      
      Alert.alert(
        "练习完成!",
        `你答对了 ${correctCount}/${exercises.length} 道题\n正确率: ${accuracy.toFixed(0)}%\n\n${isCorrect ? "太棒了!继续保持!" : "再接再厉,多练习就会进步!"}`,
        [
          {
            text: "返回错题本",
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-base" style={{ color: colors.text }}>
          AI正在为你生成专项练习题...
        </Text>
      </View>
    );
  }

  if (exercises.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-6" style={{ backgroundColor: colors.background }}>
        <Text className="text-lg text-center" style={{ color: colors.text }}>
          暂无练习题
        </Text>
      </View>
    );
  }

  const currentExercise = exercises[currentIndex];
  const isCorrect = selectedAnswer === currentExercise.correctAnswer;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text className="text-xl font-bold text-white">
            专项突破
          </Text>
          <Text className="text-white text-base">
            {currentIndex + 1}/{exercises.length}
          </Text>
        </View>
        <Text className="text-white/80 text-sm mt-2">
          {grammarPoint} · {errorCategory}
        </Text>
      </LinearGradient>

      <ScrollView className="flex-1 p-5">
        {/* 题目 */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-5 shadow-sm">
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            {currentExercise.question}
          </Text>

          {/* 选项 */}
          <View className="gap-3">
            {currentExercise.options.map((option, index) => {
              const optionLetter = option.split(".")[0].trim();
              const isSelected = selectedAnswer === optionLetter;
              const isCorrectOption = optionLetter === currentExercise.correctAnswer;
              
              let bgColor = colors.card;
              let borderColor = colors.border;
              
              if (showExplanation) {
                if (isCorrectOption) {
                  bgColor = "#d4edda";
                  borderColor = "#28a745";
                } else if (isSelected && !isCorrect) {
                  bgColor = "#f8d7da";
                  borderColor = "#dc3545";
                }
              } else if (isSelected) {
                borderColor = colors.primary;
              }

              return (
                <Pressable
                  key={index}
                  onPress={() => handleSelectAnswer(optionLetter)}
                  disabled={showExplanation}
                  style={{
                    backgroundColor: bgColor,
                    borderWidth: 2,
                    borderColor: borderColor,
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 16 }}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 解析 */}
        {showExplanation && (
          <View
            className="rounded-2xl p-5 mb-5"
            style={{
              backgroundColor: isCorrect ? "#d4edda" : "#f8d7da",
            }}
          >
            <View className="flex-row items-center mb-3">
              <Ionicons
                name={isCorrect ? "checkmark-circle" : "close-circle"}
                size={24}
                color={isCorrect ? "#28a745" : "#dc3545"}
              />
              <Text
                className="text-lg font-bold ml-2"
                style={{ color: isCorrect ? "#28a745" : "#dc3545" }}
              >
                {isCorrect ? "回答正确!" : "回答错误"}
              </Text>
            </View>
            <Text className="text-base leading-6" style={{ color: "#333" }}>
              {currentExercise.explanation}
            </Text>
          </View>
        )}

        {/* 按钮 */}
        {!showExplanation ? (
          <Pressable
            onPress={handleSubmit}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text className="text-white text-lg font-semibold">
              提交答案
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleNext}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text className="text-white text-lg font-semibold">
              {currentIndex < exercises.length - 1 ? "下一题" : "完成练习"}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
