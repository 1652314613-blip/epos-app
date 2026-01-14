import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  getAllWrongQuestions,
  updateMasteryLevel,
  markQuestionAsMastered,
  deleteWrongQuestion,
  type WrongQuestion
} from '../lib/wrong-book';
import { trpc } from '../lib/trpc';

export default function WrongQuestionDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [question, setQuestion] = useState<WrongQuestion | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadQuestion();
  }, [params.id]);

  const loadQuestion = async () => {
    const questions = await getAllWrongQuestions();
    const found = questions.find(q => q.id === params.id);
    if (found) {
      setQuestion(found);
    }
  };

  const handleBreakthrough = () => {
    if (!question) return;
    
    router.push({
      pathname: "/wrong-question-breakthrough",
      params: {
        questionId: question.id,
        errorCategory: question.category || "语法错误",
        grammarPoint: question.grammarPointTitle,
        gradeLevel: "8",
      },
    });
  };

  const generateExercises = async () => {
    if (!question) return;
    
    setLoading(true);
    try {
      const result = await trpc.exercise.generateTargetedExercise.mutate({
        wrongQuestionId: question.id,
        grammarPoint: question.grammarPointTitle,
        category: question.category || '语法错误',
        userAnswer: question.userAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        gradeLevel: 9
      });

      if (result.success && result.exercises) {
        setExercises(result.exercises);
        setCurrentExerciseIndex(0);
        setUserAnswers({});
        setShowResults(false);
      } else {
        Alert.alert('提示', result.error || '生成练习失败');
      }
    } catch (error) {
      console.error('Generate exercises error:', error);
      Alert.alert('错误', '生成练习失败,请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (exerciseIndex: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [exerciseIndex]: answer
    }));
  };

  const submitExercises = async () => {
    const correctCount = exercises.filter((ex, idx) => 
      userAnswers[idx] === ex.correctAnswer
    ).length;

    const isAllCorrect = correctCount === exercises.length;
    
    // 更新掌握度
    if (question) {
      await updateMasteryLevel(question.id, isAllCorrect);
      await loadQuestion();  // 重新加载以更新掌握度显示
    }

    setShowResults(true);

    // 如果全对,提示用户
    if (isAllCorrect) {
      Alert.alert(
        '太棒了! 🎉',
        '你已经完全掌握了这个知识点!',
        [
          {
            text: '标记为已掌握',
            onPress: async () => {
              if (question) {
                await markQuestionAsMastered(question.id);
                router.back();
              }
            }
          },
          { text: '继续练习', style: 'cancel' }
        ]
      );
    }
  };

  const getMasteryColor = (level: number) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 50) return 'bg-yellow-500';
    if (level >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (!question) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">加载中...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600 text-lg">← 返回</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                '确认删除',
                '确定要删除这道错题吗?',
                [
                  { text: '取消', style: 'cancel' },
                  {
                    text: '删除',
                    style: 'destructive',
                    onPress: async () => {
                      await deleteWrongQuestion(question.id);
                      router.back();
                    }
                  }
                ]
              );
            }}
          >
            <Text className="text-red-600">删除</Text>
          </TouchableOpacity>
        </View>
        
        <Text className="text-2xl font-bold text-gray-900 mb-2">错题详情</Text>
        
        {/* Mastery Level */}
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-600 mr-2">掌握度:</Text>
          <View className="flex-1 h-3 rounded-full bg-gray-200 mr-2">
            <View 
              className={`h-3 rounded-full ${getMasteryColor(question.masteryLevel)}`}
              style={{ width: `${question.masteryLevel}%` }}
            />
          </View>
          <Text className="text-sm font-bold text-gray-900">{question.masteryLevel}%</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Original Error */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className={`px-3 py-1 rounded ${
              question.category ? 'bg-blue-500' : 'bg-gray-500'
            } mr-2`}>
              <Text className="text-xs text-white font-medium">
                {question.category || '语法错误'}
              </Text>
            </View>
            <Text className="text-xs text-gray-500">
              {new Date(question.timestamp).toLocaleString()}
            </Text>
          </View>

          <Text className="text-lg font-bold text-gray-900 mb-3">
            {question.grammarPointTitle}
          </Text>

          <View className="bg-red-50 rounded-lg p-3 mb-3">
            <Text className="text-xs text-red-600 font-medium mb-2">❌ 你的答案</Text>
            <Text className="text-sm text-gray-900">{question.userAnswer}</Text>
          </View>

          <View className="bg-green-50 rounded-lg p-3 mb-3">
            <Text className="text-xs text-green-600 font-medium mb-2">✅ 正确答案</Text>
            <Text className="text-sm text-gray-900">{question.correctAnswer}</Text>
          </View>

          <View className="bg-blue-50 rounded-lg p-3">
            <Text className="text-xs text-blue-600 font-medium mb-2">💡 解析</Text>
            <Text className="text-sm text-gray-700 leading-5">{question.explanation}</Text>
          </View>

          <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <Text className="text-xs text-gray-500">
              已复习 {question.reviewCount} 次
            </Text>
            {question.lastReviewTime && (
              <Text className="text-xs text-gray-500">
                上次复习: {new Date(question.lastReviewTime).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>

        {/* Targeted Practice */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-2">🎯 专项突破</Text>
          <Text className="text-sm text-gray-600 mb-4">
            通过3道相似题目,巩固这个知识点
          </Text>

          <TouchableOpacity
            onPress={handleBreakthrough}
            className="rounded-lg py-4 bg-gradient-to-r from-purple-500 to-blue-500"
            style={{
              backgroundColor: '#667eea',
              shadowColor: '#667eea',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text className="text-center text-white font-bold text-base">
              🚀 开始专项突破
            </Text>
          </TouchableOpacity>
          
          {exercises.length === 0 ? (
            <TouchableOpacity
              onPress={generateExercises}
              disabled={loading}
              className={`rounded-lg py-3 mt-3 ${loading ? 'bg-gray-300' : 'bg-blue-500'}`}
            >
              <Text className="text-center text-white font-medium">
                {loading ? '生成中...' : '生成更多练习'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              {/* Exercise List */}
              {exercises.map((ex, idx) => (
                <View key={idx} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
                  <View className="flex-row items-center mb-2">
                    <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-2">
                      <Text className="text-xs text-white font-bold">{idx + 1}</Text>
                    </View>
                    <Text className="text-xs text-gray-500">{ex.scenario}</Text>
                  </View>

                  <Text className="text-sm text-gray-900 mb-3">{ex.question}</Text>

                  {/* Options */}
                  <View className="space-y-2">
                    {ex.options.map((option: string, optIdx: number) => {
                      const isSelected = userAnswers[idx] === option;
                      const isCorrect = option === ex.correctAnswer;
                      const showCorrect = showResults && isCorrect;
                      const showWrong = showResults && isSelected && !isCorrect;

                      return (
                        <TouchableOpacity
                          key={optIdx}
                          onPress={() => !showResults && handleAnswer(idx, option)}
                          disabled={showResults}
                          className={`p-3 rounded-lg border-2 ${
                            showCorrect
                              ? 'bg-green-50 border-green-500'
                              : showWrong
                              ? 'bg-red-50 border-red-500'
                              : isSelected
                              ? 'bg-blue-50 border-blue-500'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <Text className={`text-sm ${
                            showCorrect
                              ? 'text-green-700 font-medium'
                              : showWrong
                              ? 'text-red-700 font-medium'
                              : isSelected
                              ? 'text-blue-700 font-medium'
                              : 'text-gray-700'
                          }`}>
                            {showCorrect && '✅ '}
                            {showWrong && '❌ '}
                            {option}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Explanation (shown after submit) */}
                  {showResults && (
                    <View className="mt-3 bg-blue-50 rounded-lg p-3">
                      <Text className="text-xs text-blue-600 font-medium mb-1">💡 解析</Text>
                      <Text className="text-xs text-gray-700">{ex.explanation}</Text>
                    </View>
                  )}
                </View>
              ))}

              {/* Submit Button */}
              {!showResults ? (
                <TouchableOpacity
                  onPress={submitExercises}
                  disabled={Object.keys(userAnswers).length < exercises.length}
                  className={`rounded-lg py-3 mt-4 ${
                    Object.keys(userAnswers).length < exercises.length
                      ? 'bg-gray-300'
                      : 'bg-blue-500'
                  }`}
                >
                  <Text className="text-center text-white font-medium">
                    提交答案
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className="mt-4">
                  <View className="bg-blue-50 rounded-lg p-4 mb-3">
                    <Text className="text-center text-lg font-bold text-blue-900 mb-1">
                      正确率: {exercises.filter((ex, idx) => userAnswers[idx] === ex.correctAnswer).length}/{exercises.length}
                    </Text>
                    <Text className="text-center text-sm text-blue-700">
                      掌握度已更新为 {question.masteryLevel}%
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => {
                      setExercises([]);
                      setUserAnswers({});
                      setShowResults(false);
                    }}
                    className="bg-blue-500 rounded-lg py-3"
                  >
                    <Text className="text-center text-white font-medium">
                      重新生成练习
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Actions */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <TouchableOpacity
            onPress={async () => {
              await markQuestionAsMastered(question.id);
              Alert.alert('成功', '已标记为掌握!', [
                { text: '确定', onPress: () => router.back() }
              ]);
            }}
            className="bg-green-500 rounded-lg py-3 mb-3"
          >
            <Text className="text-center text-white font-medium">
              标记为已掌握
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push({
              pathname: '/grammar-point-detail',
              params: { pointId: question.grammarPointId }
            })}
            className="bg-gray-200 rounded-lg py-3"
          >
            <Text className="text-center text-gray-700 font-medium">
              查看语法点详情
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
