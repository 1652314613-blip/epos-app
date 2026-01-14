import { useState, useEffect } from "react";
import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import {
  generateVocabularyQuiz,
  calculateQuizScore,
  getScoreRating,
  type VocabularyQuiz,
  type QuizQuestion,
  type QuizResult,
} from "@/lib/vocabulary-quiz";
import { getFullVocabularyForUnit } from "@/lib/grade7a-vocabulary-full";
import { saveQuizHistory } from "@/lib/quiz-history-storage";
import { speakWord } from "@/lib/tts-utils";
import { addWord } from "@/lib/vocabulary-storage";

export default function VocabularyQuizScreen() {
  const colors = useColors();
  const params = useLocalSearchParams();
  
  const grade = parseInt(params.grade as string);
  const book = params.book as string;
  const unit = parseInt(params.unit as string);
  const unitTitle = params.unitTitle as string;

  const [quiz, setQuiz] = useState<VocabularyQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    initializeQuiz();
  }, []);

  const initializeQuiz = () => {
    try {
      const words = getFullVocabularyForUnit(unit);
      if (words.length === 0) {
        Alert.alert("提示", "该单元暂无词汇数据");
        router.back();
        return;
      }
      
      const generatedQuiz = generateVocabularyQuiz(grade, book, unit, words, 10);
      setQuiz(generatedQuiz);
      setStartTime(Date.now());
    } catch (error) {
      console.error("生成测试失败", error);
      Alert.alert("错误", "无法生成测试题目");
      router.back();
    }
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleMatchingAnswer = (word: string, meaning: string) => {
    setMatchingAnswers(prev => ({ ...prev, [word]: meaning }));
    
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleNext = () => {
    if (!quiz) return;

    // 保存匹配题答案
    if (currentQuestion?.type === "matching") {
      const question = currentQuestion;
      question.userMatches = { ...matchingAnswers };
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setMatchingAnswers({});
    } else {
      // 完成测试
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (!quiz) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const quizResult = calculateQuizScore(quiz, answers);
    quizResult.timeSpent = timeSpent;
    
    // 保存到历史记录
    await saveQuizHistory(quizResult, unitTitle);
    
    // 将错题单词添加到单词本
    if (quizResult.wrongWords.length > 0) {
      for (const word of quizResult.wrongWords) {
        try {
          await addWord({
            word: word.word,
            phonetic: word.phonetic,
            definitions: word.definitions,
            examples: word.examples || [],
          });
        } catch (error) {
          console.error(`添加单词 ${word.word} 到单词本失败`, error);
        }
      }
    }
    
    setResult(quizResult);
    
    if (Platform.OS !== "web") {
      if (quizResult.score >= 80) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (quizResult.score >= 60) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setMatchingAnswers({});
    setResult(null);
    initializeQuiz();
  };

  if (!quiz) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground text-lg">加载中...</Text>
      </ScreenContainer>
    );
  }

  if (result) {
    const rating = getScoreRating(result.score);
    
    return (
      <ScreenContainer>
        <ScrollView className="flex-1 p-6">
          <View className="items-center mb-8">
            <Text className="text-6xl mb-4">{rating.emoji}</Text>
            <Text className="text-3xl font-bold text-foreground mb-2">
              {result.score}分
            </Text>
            <Text className="text-xl text-primary font-semibold mb-2">
              {rating.rating}
            </Text>
            <Text className="text-base text-muted text-center">
              {rating.message}
            </Text>
          </View>

          <View className="bg-surface rounded-2xl p-6 mb-6">
            <View className="flex-row justify-between mb-4">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-primary">
                  {result.correctCount}
                </Text>
                <Text className="text-sm text-muted">答对</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-error">
                  {result.totalCount - result.correctCount}
                </Text>
                <Text className="text-sm text-muted">答错</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-foreground">
                  {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
                </Text>
                <Text className="text-sm text-muted">用时</Text>
              </View>
            </View>
          </View>

          {result.wrongWords.length > 0 && (
            <View className="bg-surface rounded-2xl p-6 mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-semibold text-foreground">
                  📝 需要复习的单词
                </Text>
                <View className="bg-primary/10 px-3 py-1 rounded-full">
                  <Text className="text-xs text-primary font-semibold">
                    已加入单词本
                  </Text>
                </View>
              </View>
              {result.wrongWords.map((word, index) => (
                <View key={index} className="mb-3 pb-3 border-b border-border last:border-b-0 flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">
                      {word.word}
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      {word.definitions[0].meaning}
                    </Text>
                  </View>
                  <AnimatedButton
                    onPress={() => {
                      if (Platform.OS !== "web") {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                      speakWord(word.word);
                    }}
                    className="bg-primary/10 rounded-full p-2 ml-2"
                  >
                    <Text className="text-primary text-base">🔊</Text>
                  </AnimatedButton>
                </View>
              ))}
            </View>
          )}

          <View className="flex-row gap-4">
            <AnimatedButton
              onPress={handleRetry}
              className="flex-1 bg-primary rounded-full py-4"
            >
              <Text className="text-background text-center font-semibold">
                再测一次
              </Text>
            </AnimatedButton>
            
            <AnimatedButton
              onPress={() => router.back()}
              className="flex-1 bg-surface rounded-full py-4"
            >
              <Text className="text-foreground text-center font-semibold">
                返回学习
              </Text>
            </AnimatedButton>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView className="flex-1">
        {/* 进度条 */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-muted">
              第 {currentQuestionIndex + 1} / {quiz.totalQuestions} 题
            </Text>
            <Text className="text-sm text-primary font-semibold">
              {unitTitle}
            </Text>
          </View>
          <View className="h-2 bg-surface rounded-full overflow-hidden">
            <View
              className="h-full bg-primary"
              style={{
                width: `${((currentQuestionIndex + 1) / quiz.totalQuestions) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* 题目内容 */}
        <View className="px-6">
          {currentQuestion?.type === "multiple_choice" && (
            <View>
              <Text className="text-xl font-semibold text-foreground mb-6">
                {currentQuestion.question}
              </Text>
              
              <View className="gap-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleAnswer(currentQuestion.id, option)}
                      className={`p-4 rounded-xl border-2 ${
                        isSelected
                          ? "bg-primary/10 border-primary"
                          : "bg-surface border-border"
                      }`}
                    >
                      <Text
                        className={`text-base font-medium ${
                          isSelected ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {currentQuestion?.type === "fill_blank" && (
            <View>
              <Text className="text-base text-muted mb-2">填空题</Text>
              <Text className="text-lg text-foreground mb-4 leading-relaxed">
                {currentQuestion.sentence}
              </Text>
              
              <Text className="text-sm text-primary mb-2">
                {currentQuestion.hint}
              </Text>
              
              <TextInput
                className="bg-surface border-2 border-border rounded-xl px-4 py-3 text-base text-foreground"
                placeholder="请输入单词"
                placeholderTextColor={colors.muted}
                value={answers[currentQuestion.id] || ""}
                onChangeText={(text) => handleAnswer(currentQuestion.id, text)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          {currentQuestion?.type === "matching" && (
            <View>
              <Text className="text-xl font-semibold text-foreground mb-2">
                匹配题
              </Text>
              <Text className="text-sm text-muted mb-6">
                将左边的英文单词与右边的中文释义配对
              </Text>
              
              <View className="gap-3">
                {currentQuestion.pairs.map((pair, index) => (
                  <View key={index} className="flex-row items-center gap-3">
                    <View className="flex-1 bg-surface rounded-xl p-4">
                      <Text className="text-base font-semibold text-foreground">
                        {pair.word}
                      </Text>
                    </View>
                    
                    <Text className="text-muted">→</Text>
                    
                    <TouchableOpacity
                      onPress={() => handleMatchingAnswer(pair.word, pair.meaning)}
                      className={`flex-1 rounded-xl p-4 border-2 ${
                        matchingAnswers[pair.word] === pair.meaning
                          ? "bg-primary/10 border-primary"
                          : "bg-surface border-border"
                      }`}
                    >
                      <Text
                        className={`text-base ${
                          matchingAnswers[pair.word] === pair.meaning
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {pair.meaning}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 下一题按钮 */}
        <View className="px-6 py-6">
          <AnimatedButton
            onPress={handleNext}
            className="bg-primary rounded-full py-4"
            disabled={
              currentQuestion?.type === "fill_blank" &&
              !answers[currentQuestion.id]
            }
          >
            <Text className="text-background text-center font-semibold text-base">
              {currentQuestionIndex < quiz.questions.length - 1 ? "下一题" : "提交测试"}
            </Text>
          </AnimatedButton>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
