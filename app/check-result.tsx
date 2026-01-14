import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { ScrollView, Text, View, Platform, TextInput, ActivityIndicator, Pressable, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import type { GrammarError } from "@/lib/grammar-checker";
import { addToWrongBook } from "@/lib/storage";
import { trpc } from "@/lib/trpc";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedListItem } from "@/components/animated-list-item";
import { KnowledgeCard } from "@/components/knowledge-card";
import { HighlightedText } from "@/components/highlighted-text";
import { getErrorTypeInfo, getExamRelevance } from "@/lib/error-type-colors";
import { Ionicons } from "@expo/vector-icons";
import type { PolishSuggestion } from "@/services/native-polish-service";
import { EposLogo } from "@/components/epos-logo";

interface GrammarCheckResult {
  original: string;
  corrected: string;
  errors: GrammarError[];
  overallScore: number;
  suggestions: string[];
}

export default function CheckResultScreen() {
  const params = useLocalSearchParams();
  const colors = useColors();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedError, setSelectedError] = useState<GrammarError | null>(null);
  const [showKnowledgeCard, setShowKnowledgeCard] = useState(false);
  const [polishSuggestion, setPolishSuggestion] = useState<PolishSuggestion | null>(null);
  const [isLoadingPolish, setIsLoadingPolish] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Parse result from params
  const result: GrammarCheckResult = params.result
    ? JSON.parse(params.result as string)
    : {
        original: "",
        corrected: "",
        errors: [],
        overallScore: 100,
        suggestions: [],
      };

  const gradeLevel = params.gradeLevel ? Number(params.gradeLevel) : 9;

  // Load suggested questions when component mounts
  useEffect(() => {
    if (result.errors.length > 0) {
      loadSuggestedQuestions();
    }
  }, []);

  const suggestQuestionsMutation = trpc.grammar.suggestQuestions.useMutation({
    onSuccess: (response) => {
      setSuggestedQuestions(response.questions);
      setIsLoadingSuggestions(false);
    },
    onError: (error) => {
      console.error("Failed to load suggested questions:", error);
      setIsLoadingSuggestions(false);
    },
  });

  const loadSuggestedQuestions = () => {
    setIsLoadingSuggestions(true);
    suggestQuestionsMutation.mutate({
      errors: result.errors.map((e) => ({
        type: e.type,
        category: e.category,
        explanation: e.explanation,
      })),
      gradeLevel,
    });
  };

  const answerQuestionMutation = trpc.grammar.answerQuestion.useMutation({
    onSuccess: (response) => {
      setAnswer(response.answer);
      setQuestion("");
      setIsAsking(false);
    },
    onError: (error) => {
      console.error("Failed to get answer:", error);
      setAnswer("抱歉，获取回答时出现了问题。请稍后再试。");
      setIsAsking(false);
    },
  });

  const polishMutation = trpc.polish.generatePolish.useMutation({
    onSuccess: (response) => {
      setPolishSuggestion(response);
      setIsLoadingPolish(false);
    },
    onError: (error) => {
      console.error("Failed to generate polish:", error);
      setIsLoadingPolish(false);
    },
  });

  const loadPolishSuggestion = () => {
    if (result.corrected && !polishSuggestion && !isLoadingPolish) {
      setIsLoadingPolish(true);
      polishMutation.mutate({
        originalSentence: result.original,
        correctedSentence: result.corrected,
        gradeLevel,
      });
    }
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsSpeaking(true);
    Speech.speak(text, {
      language: "en-US",
      rate: 0.9,
      pitch: 1.0,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleAskQuestion = (questionText: string) => {
    if (!questionText.trim()) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsAsking(true);
    setAnswer("");

    answerQuestionMutation.mutate({
      question: questionText,
      originalSentence: result.original,
      errors: result.errors.map((e) => ({
        type: e.type,
        category: e.category,
        explanation: e.explanation,
      })),
      gradeLevel,
    });
  };

  const handleSuggestedQuestionTap = (q: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    handleAskQuestion(q);
  };

  const handleNewCheck = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleAddToWrongBook = async () => {
    if (result.errors.length > 0) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      await addToWrongBook(result);
      alert("已添加到错题本");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#22C55E";
    if (score >= 70) return "#F59E0B";
    return "#EF4444";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#EF4444";
      case "important":
        return "#F59E0B";
      case "minor":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical":
        return "严重";
      case "important":
        return "重要";
      case "minor":
        return "轻微";
      default:
        return "一般";
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Logo */}
          <EposLogo />

          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">检查结果</Text>
            <View
              className="px-6 py-3 rounded-full"
              style={{ backgroundColor: getScoreColor(result.overallScore) + "20" }}
            >
              <Text className="text-2xl font-bold" style={{ color: getScoreColor(result.overallScore) }}>
                {result.overallScore} 分
              </Text>
            </View>
          </View>

          {/* Original Sentence */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-muted mb-2">原句</Text>
            <HighlightedText
              text={result.original}
              errors={result.errors}
              onErrorTap={(error) => {
                setSelectedError(error);
                setShowKnowledgeCard(true);
              }}
            />
          </View>

          {/* Corrected Sentence */}
          {result.corrected !== result.original && (
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold text-muted">改正后</Text>
                <TouchableOpacity
                  onPress={() => handleSpeak(result.corrected)}
                  className="flex-row items-center gap-1 px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.primary + "20" }}
                >
                  <Text className="text-base">{isSpeaking ? "⏸️" : "🔊"}</Text>
                  <Text className="text-xs font-medium" style={{ color: colors.primary }}>
                    {isSpeaking ? "正在播放" : "听发音"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text className="text-base text-foreground leading-relaxed">{result.corrected}</Text>
            </View>
          )}

          {/* Native Polish Card (AI润色) */}
          {result.corrected !== result.original && (
            <View className="bg-gradient-to-r rounded-2xl p-5 border-2" style={{ backgroundColor: "#FEF3C7", borderColor: "#F59E0B" }}>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <Text className="text-xl">✨</Text>
                  <Text className="text-lg font-bold" style={{ color: "#92400E" }}>
                    地道表达 (AI润色)
                  </Text>
                </View>
                {!polishSuggestion && !isLoadingPolish && (
                  <TouchableOpacity
                    onPress={loadPolishSuggestion}
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: "#F59E0B" }}
                  >
                    <Text className="text-xs font-semibold text-white">生成</Text>
                  </TouchableOpacity>
                )}
              </View>

              {isLoadingPolish ? (
                <View className="items-center py-4">
                  <ActivityIndicator size="small" color="#F59E0B" />
                  <Text className="text-xs text-muted mt-2">正在生成母语级表达...</Text>
                </View>
              ) : polishSuggestion ? (
                <View className="gap-3">
                  {/* Polished Sentence */}
                  <View className="bg-white rounded-xl p-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-xs font-semibold" style={{ color: "#92400E" }}>
                        母语级改写
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleSpeak(polishSuggestion.polishedSentence)}
                        className="flex-row items-center gap-1"
                      >
                        <Text className="text-sm">{isSpeaking ? "⏸️" : "🔊"}</Text>
                      </TouchableOpacity>
                    </View>
                    <Text className="text-base font-semibold" style={{ color: "#059669" }}>
                      {polishSuggestion.polishedSentence}
                    </Text>
                  </View>

                  {/* Improvements */}
                  <View className="gap-2">
                    <Text className="text-xs font-semibold" style={{ color: "#92400E" }}>
                      💡 改进点
                    </Text>
                    {polishSuggestion.improvements.map((improvement, index) => (
                      <View key={index} className="flex-row gap-2">
                        <Text className="text-sm" style={{ color: "#92400E" }}>•</Text>
                        <Text className="text-sm flex-1" style={{ color: "#78350F" }}>
                          {improvement}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Scoring Points */}
                  <View className="gap-2">
                    <Text className="text-xs font-semibold" style={{ color: "#92400E" }}>
                      🎯 考试加分点
                    </Text>
                    {polishSuggestion.scoringPoints.map((point, index) => (
                      <View key={index} className="flex-row gap-2">
                        <Text className="text-sm" style={{ color: "#92400E" }}>•</Text>
                        <Text className="text-sm flex-1" style={{ color: "#78350F" }}>
                          {point}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <Text className="text-sm" style={{ color: "#78350F" }}>
                  点击“生成”获取母语级改写建议和考试加分点
                </Text>
              )}
            </View>
          )}

          {/* Errors List */}
          {result.errors.length > 0 ? (
            <View className="gap-4">
              <Text className="text-lg font-semibold text-foreground">错误详情</Text>
              {result.errors.map((error, index) => {
                const errorInfo = getErrorTypeInfo(error.type);
                const examTag = getExamRelevance(error.type);
                return (
                <AnimatedListItem key={index} index={index}>
                  <Pressable
                    className="bg-surface rounded-2xl p-4 border border-border gap-3 active:opacity-80"
                    onPress={() => {
                      setSelectedError(error);
                      setShowKnowledgeCard(true);
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <View
                          className="w-8 h-8 rounded-full items-center justify-center"
                          style={{ backgroundColor: errorInfo.color + "20" }}
                        >
                          <Text className="text-base">{errorInfo.icon}</Text>
                        </View>
                        <Text className="text-sm font-semibold text-foreground">{errorInfo.label}</Text>
                        {examTag && (
                          <View
                            className="px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "#F59E0B20" }}
                          >
                            <Text className="text-xs font-semibold" style={{ color: "#F59E0B" }}>
                              {examTag}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <View className="gap-2">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm text-muted">错误：</Text>
                        <Text className="text-sm text-error line-through">{error.incorrect}</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm text-muted">改为：</Text>
                        <Text className="text-sm text-success font-semibold">{error.correct}</Text>
                      </View>
                    </View>

                    <View className="bg-background rounded-xl p-3">
                      <Text className="text-sm text-foreground leading-relaxed">{error.explanation}</Text>
                    </View>

                    {error.pepReference && (
                      <Text className="text-xs text-muted">📚 参考：{error.pepReference}</Text>
                    )}

                    {/* 去练习按钮 */}
                    <TouchableOpacity
                      onPress={() => {
                        // 跳转到语法练习页面，并自动加载相关语法点的题目
                        router.push({
                          pathname: "/grammar-exercise",
                          params: {
                            grammarType: error.type,
                            errorCategory: error.category,
                            gradeLevel: gradeLevel.toString(),
                          }
                        });
                      }}
                      className="flex-row items-center justify-center gap-2 py-3 rounded-xl mt-2"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Ionicons name="fitness-outline" size={18} color="white" />
                      <Text className="text-sm font-semibold text-white">去练习</Text>
                    </TouchableOpacity>
                  </Pressable>
                </AnimatedListItem>
                );
              })}
            </View>
          ) : (
            <View className="bg-surface rounded-2xl p-6 items-center gap-2">
              <Text className="text-4xl">🎉</Text>
              <Text className="text-lg font-bold text-foreground">太棒了！</Text>
              <Text className="text-sm text-muted text-center">这个句子没有发现语法错误，继续保持！</Text>
            </View>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
              <Text className="text-sm font-semibold text-foreground">💡 学习建议</Text>
              {result.suggestions.map((suggestion, index) => (
                <Text key={index} className="text-sm text-muted leading-relaxed">
                  • {suggestion}
                </Text>
              ))}
            </View>
          )}

          {/* Q&A Section */}
          {result.errors.length > 0 && (
            <View className="bg-surface rounded-2xl p-4 border border-border gap-4">
              <View className="gap-2">
                <Text className="text-lg font-bold text-foreground">💬 还有疑问？</Text>
                <Text className="text-sm text-muted">如果你对这个错误还有不明白的地方，可以继续提问</Text>
              </View>

              {/* Suggested Questions */}
              {isLoadingSuggestions ? (
                <View className="items-center py-4">
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text className="text-xs text-muted mt-2">正在为你准备相关问题...</Text>
                </View>
              ) : suggestedQuestions.length > 0 ? (
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-muted">猜你想问：</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {suggestedQuestions.map((q, index) => (
                      <AnimatedButton
                        key={index}
                        onPress={() => handleSuggestedQuestionTap(q)}
                        variant="secondary"
                        className="px-4 py-2 rounded-full"
                      >
                        <Text className="text-sm text-primary">{q}</Text>
                      </AnimatedButton>
                    ))}
                  </View>
                </View>
              ) : null}

              {/* Question Input */}
              <View className="gap-2">
                <TextInput
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="输入你的问题..."
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={2}
                  returnKeyType="done"
                  onSubmitEditing={() => handleAskQuestion(question)}
                  className="bg-background rounded-xl p-3 text-base text-foreground min-h-[60px]"
                  style={{ textAlignVertical: "top" }}
                />
                <AnimatedButton
                  onPress={() => handleAskQuestion(question)}
                  disabled={!question.trim() || isAsking}
                  variant="primary"
                  className="px-6 py-3 rounded-full"
                >
                  {isAsking ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-background font-semibold">提问</Text>
                  )}
                </AnimatedButton>
              </View>

              {/* Answer */}
              {answer && (
                <View className="bg-background rounded-xl p-4 gap-2">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base">👨‍🏫</Text>
                    <Text className="text-sm font-semibold text-foreground">老师的回答：</Text>
                  </View>
                  <Text className="text-sm text-foreground leading-relaxed">{answer}</Text>
                </View>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View className="gap-3">
            {result.errors.length > 0 && (
              <AnimatedButton
                onPress={handleAddToWrongBook}
                variant="secondary"
              >
                <Text className="text-primary font-semibold">📝 添加到错题本</Text>
              </AnimatedButton>
            )}

            <AnimatedButton
              onPress={handleNewCheck}
              variant="primary"
            >
              <Text className="text-background font-semibold">检查新句子</Text>
            </AnimatedButton>
          </View>
        </View>
      </ScrollView>

      {/* Knowledge Card Modal */}
      <KnowledgeCard
        visible={showKnowledgeCard}
        error={selectedError}
        onClose={() => setShowKnowledgeCard(false)}
      />
    </ScreenContainer>
  );
}
