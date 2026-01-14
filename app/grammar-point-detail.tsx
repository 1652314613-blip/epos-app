import { View, Text, ScrollView, Platform, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedListItem } from "@/components/animated-list-item";
import TenseTimeline, { TenseExamples } from "@/components/tense-timeline";
import { 
  getGrammarPointById, 
  getRelatedGrammarPoints,
  type GrammarPoint 
} from "@/lib/grammar-points-data";
import { trpc } from "@/lib/trpc";
import { getWrongQuestionsByGrammarPoint, type WrongQuestion } from "@/lib/wrong-book";

export default function GrammarPointDetailScreen() {
  const colors = useColors();
  const params = useLocalSearchParams();
  
  // 支持新旧两种数据格式
  const pointId = params.pointId as string | undefined;
  
  // 如果有pointId,使用新的数据结构
  if (pointId) {
    const grammarPoint = getGrammarPointById(pointId);
    const relatedPoints = getRelatedGrammarPoints(pointId);

    if (!grammarPoint) {
      return (
        <ScreenContainer className="p-6">
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-xl font-semibold text-foreground">
              语法点不存在
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

    const handlePracticePress = () => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      router.push({
        pathname: "/grammar-exercise",
        params: {
          grammarPoint: grammarPoint.titleCn,
          grammarType: grammarPoint.title,
          gradeLevel: grammarPoint.grade === '7A' ? '7' : '7'
        }
      });
    };

    const loadAiExplanation = async () => {
      if (aiExplanation || loadingExplanation) return;
      
      setLoadingExplanation(true);
      try {
        // 调用AI生成两种模式的讲解
        const result = await trpc.grammar.generateDualExplanation.mutate({
          grammarPoint: grammarPoint.titleCn,
          category: grammarPoint.category,
          gradeLevel: grammarPoint.grade === '7A' ? 7 : 8,
        });
        setAiExplanation(result);
      } catch (error) {
        console.error('Load AI explanation failed:', error);
      } finally {
        setLoadingExplanation(false);
      }
    };

    const handleRelatedPointPress = (point: GrammarPoint) => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      router.push({
        pathname: "/grammar-point-detail",
        params: { pointId: point.id }
      });
    };

    const getDifficultyColor = (difficulty: string) => {
      const colors: Record<string, string> = {
        basic: 'bg-green-100 border-green-300 text-green-700',
        intermediate: 'bg-blue-100 border-blue-300 text-blue-700',
        advanced: 'bg-purple-100 border-purple-300 text-purple-700'
      };
      return colors[difficulty] || 'bg-gray-100 border-gray-300 text-gray-700';
    };

    const getDifficultyName = (difficulty: string) => {
      const names: Record<string, string> = {
        basic: '基础',
        intermediate: '中级',
        advanced: '高级'
      };
      return names[difficulty] || difficulty;
    };

    return (
      <ScreenContainer className="p-6">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="gap-6 pb-8">
            {/* 标题和标签 */}
            <View className="gap-3">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-3xl font-bold text-foreground">
                    {grammarPoint.titleCn}
                  </Text>
                  <Text className="text-lg text-muted mt-2">
                    {grammarPoint.title}
                  </Text>
                </View>
                <View className={`px-3 py-2 rounded-xl border ${getDifficultyColor(grammarPoint.difficulty)}`}>
                  <Text className="text-sm font-semibold">
                    {getDifficultyName(grammarPoint.difficulty)}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2 flex-wrap">
                <View className="px-3 py-1 bg-surface rounded-lg border border-border">
                  <Text className="text-sm text-muted">
                    {grammarPoint.grade} Unit {grammarPoint.unit}
                  </Text>
                </View>
                <View className="px-3 py-1 bg-surface rounded-lg border border-border">
                  <Text className="text-sm text-muted">
                    {grammarPoint.unitTitle}
                  </Text>
                </View>
                {/* 考点标签 */}
                {grammarPoint.examTags && grammarPoint.examTags.map((tag, index) => (
                  <View 
                    key={index} 
                    className={`px-3 py-1 rounded-lg border ${
                      tag === '中考频次' 
                        ? 'bg-orange-100 border-orange-300' 
                        : 'bg-red-100 border-red-300'
                    }`}
                  >
                    <Text className={`text-sm font-semibold ${
                      tag === '中考频次' ? 'text-orange-700' : 'text-red-700'
                    }`}>
                      {tag === '中考频次' ? '📝 中考频次' : '🎯 高考考点'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 描述 */}
            <View className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
              <Text className="text-base text-foreground leading-relaxed">
                {grammarPoint.description}
              </Text>
            </View>

            {/* 语法规则 */}
            <View className="gap-3">
              <Text className="text-xl font-bold text-foreground">
                📋 语法规则
              </Text>
              <View className="bg-surface rounded-2xl p-6 border border-border gap-3">
                {grammarPoint.rules.map((rule, index) => (
                  <View key={index} className="flex-row gap-3">
                    <Text className="text-base text-primary font-semibold">
                      {index + 1}.
                    </Text>
                    <Text className="flex-1 text-base text-foreground leading-relaxed">
                      {rule}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 例句 */}
            <View className="gap-3">
              <Text className="text-xl font-bold text-foreground">
                💬 例句
              </Text>
              {grammarPoint.examples.map((example, index) => (
                <View key={index} className="bg-surface rounded-2xl p-5 border border-border gap-2">
                  <Text className="text-base text-foreground font-medium leading-relaxed">
                    {example.en}
                  </Text>
                  <Text className="text-sm text-muted leading-relaxed">
                    {example.cn}
                  </Text>
                </View>
              ))}
            </View>

            {/* 常见错误 */}
            <View className="gap-3">
              <Text className="text-xl font-bold text-foreground">
                ⚠️ 常见错误
              </Text>
              {grammarPoint.commonMistakes.map((mistake, index) => (
                <View key={index} className="bg-surface rounded-2xl p-5 border border-border gap-3">
                  <View className="gap-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-semibold text-red-600">
                        ❌ 错误:
                      </Text>
                      <Text className="flex-1 text-base text-red-600 line-through">
                        {mistake.wrong}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-semibold text-green-600">
                        ✅ 正确:
                      </Text>
                      <Text className="flex-1 text-base text-green-600 font-medium">
                        {mistake.correct}
                      </Text>
                    </View>
                  </View>
                  <View className="pt-2 border-t border-border">
                    <Text className="text-sm text-muted leading-relaxed">
                      💡 {mistake.explanation}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* AI老师深度解释 */}
            <AITeacherSection grammarPoint={grammarPoint} />

            {/* 错题复温 */}
            <WrongQuestionReview grammarPointId={grammarPoint.id} grammarPointTitle={grammarPoint.titleCn} />

            {/* 相关语法点 */}
            {relatedPoints.length > 0 && (
              <View className="gap-3">
                <Text className="text-xl font-bold text-foreground">
                  🔗 相关语法点
                </Text>
                {relatedPoints.map((point) => (
                  <AnimatedButton
                    key={point.id}
                    onPress={() => handleRelatedPointPress(point)}
                    variant="secondary"
                  >
                    <View className="bg-surface rounded-xl p-4 border border-border">
                      <Text className="text-base font-semibold text-foreground">
                        {point.titleCn}
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        {point.title}
                      </Text>
                    </View>
                  </AnimatedButton>
                ))}
              </View>
            )}

            {/* 开始练习按钮 */}
            <View className="gap-3 mt-4">
              <AnimatedButton onPress={handlePracticePress} variant="primary">
                <Text className="text-lg font-semibold text-background">
                  ✏️ 开始练习
                </Text>
              </AnimatedButton>
              <AnimatedButton onPress={() => router.back()} variant="secondary">
                <Text className="text-base font-semibold text-foreground">
                  返回列表
                </Text>
              </AnimatedButton>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }
  
  // 旧的数据格式(兼容性)
  const title = params.title as string;
  const category = params.category as string;
  const explanation = params.explanation as string;
  const rules = JSON.parse(params.rules as string) as string[];
  const examples = JSON.parse(params.examples as string) as Array<{
    english: string;
    chinese: string;
    analysis?: string;
  }>;
  const commonMistakes = JSON.parse(params.commonMistakes as string) as string[];

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
            <View className="flex-row items-center gap-2">
              <View className="bg-primary/20 px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold text-primary">{category}</Text>
              </View>
            </View>
            <Text className="text-3xl font-bold text-foreground">{title}</Text>
          </View>

          {/* Explanation */}
          <View className="bg-primary/10 rounded-2xl p-4 border border-primary/30 gap-2">
            <Text className="text-base font-semibold text-foreground">📚 知识点讲解</Text>
            <Text className="text-sm text-foreground leading-relaxed">{explanation}</Text>
          </View>

          {/* Rules */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">📝 语法规则</Text>
            {rules.map((rule, index) => (
              <AnimatedListItem key={index} index={index}>
                <View className="bg-surface rounded-2xl p-4 border border-border">
                  <View className="flex-row gap-3">
                    <View className="bg-primary rounded-full w-6 h-6 items-center justify-center">
                      <Text className="text-xs font-bold text-background">{index + 1}</Text>
                    </View>
                    <Text className="text-sm text-foreground flex-1 leading-relaxed">{rule}</Text>
                  </View>
                </View>
              </AnimatedListItem>
            ))}
          </View>

          {/* Examples */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">💡 典型例句</Text>
            {examples.map((example, index) => (
              <AnimatedListItem key={index} index={index}>
                <View className="bg-surface rounded-2xl p-4 border border-border gap-2">
                  <Text className="text-base font-semibold text-foreground italic">
                    {example.english}
                  </Text>
                  <Text className="text-sm text-muted">{example.chinese}</Text>
                  {example.analysis && (
                    <View className="bg-primary/10 rounded-lg p-2 mt-1">
                      <Text className="text-xs text-primary">💭 {example.analysis}</Text>
                    </View>
                  )}
                </View>
              </AnimatedListItem>
            ))}
          </View>

          {/* Common Mistakes */}
          {commonMistakes.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground">⚠️ 常见错误</Text>
              {commonMistakes.map((mistake, index) => (
                <AnimatedListItem key={index} index={index}>
                  <View className="bg-error/10 rounded-2xl p-4 border border-error/30">
                    <Text className="text-sm text-foreground leading-relaxed">{mistake}</Text>
                  </View>
                </AnimatedListItem>
              ))}
            </View>
          )}

          {/* Practice Button */}
          <AnimatedButton
            onPress={() => {
              router.push({
                pathname: "/grammar-exercise",
                params: {
                  grammarPoint: title,
                  gradeLevel: 7,
                },
              });
            }}
            variant="primary"
            className="py-3"
          >
            <Text className="text-background font-semibold">📝 开始练习</Text>
          </AnimatedButton>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}


// AI老师深度解释组件
function AITeacherSection({ grammarPoint }: { grammarPoint: GrammarPoint }) {
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
  const [explanation, setExplanation] = useState<string>('');
  const [examples, setExamples] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const generateAIExplanation = async (selectedMode: 'simple' | 'advanced') => {
    setLoading(true);
    setMode(selectedMode);
    
    try {
      const prompt = selectedMode === 'simple'
        ? `请用简单易懂的语言解释"${grammarPoint.titleCn}"这个语法知识点,适合初学者理解。`
        : `请深入详细地解释"${grammarPoint.titleCn}"这个语法知识点,包括使用场景、注意事项和进阶用法。同时,请根据这个语法点生成3个有趣的"校园生活场景"例句,每个例句都要贴近中学生的日常生活。`;

      const result = await trpc.checkGrammar.mutate({
        text: prompt,
        mode: 'explain'
      });

      // 解析AI返回的内容
      const content = result.explanation || result.correctedText || '';
      
      // 如果是进阶版,尝试提取例句
      if (selectedMode === 'advanced') {
        const exampleMatches = content.match(/\d+\.\s*(.+?)(?=\n\d+\.|$)/gs);
        if (exampleMatches && exampleMatches.length >= 3) {
          setExamples(exampleMatches.slice(0, 3).map((ex: string) => ex.trim()));
          // 移除例句部分,只保留解释
          const explanationPart = content.split(/\n\d+\./)[0];
          setExplanation(explanationPart.trim());
        } else {
          setExplanation(content);
          setExamples([]);
        }
      } else {
        setExplanation(content);
        setExamples([]);
      }
      
      setExpanded(true);
    } catch (error) {
      console.error('AI解释生成失败:', error);
      setExplanation('抱歉,AI老师暂时无法生成解释,请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold text-foreground">
          🤖 AI老师解释
        </Text>
        {!expanded && (
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => generateAIExplanation('simple')}
              disabled={loading}
              className="px-4 py-2 bg-blue-100 border border-blue-300 rounded-lg"
            >
              <Text className="text-sm font-semibold text-blue-700">
                {loading && mode === 'simple' ? '生成中...' : '简单版'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => generateAIExplanation('advanced')}
              disabled={loading}
              className="px-4 py-2 bg-purple-100 border border-purple-300 rounded-lg"
            >
              <Text className="text-sm font-semibold text-purple-700">
                {loading && mode === 'advanced' ? '生成中...' : '进阶版'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading && (
        <View className="bg-surface rounded-2xl p-6 border border-border items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-sm text-muted mt-3">AI老师正在思考中...</Text>
        </View>
      )}

      {expanded && explanation && (
        <View className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 gap-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-bold text-foreground">
                {mode === 'simple' ? '📖 简单版解释' : '🎓 进阶版解释'}
              </Text>
            </View>
            <View className="flex-row gap-2">
              {mode === 'simple' && (
                <TouchableOpacity
                  onPress={() => generateAIExplanation('advanced')}
                  disabled={loading}
                  className="px-3 py-1 bg-purple-100 border border-purple-300 rounded-lg"
                >
                  <Text className="text-xs font-semibold text-purple-700">
                    切换进阶版
                  </Text>
                </TouchableOpacity>
              )}
              {mode === 'advanced' && (
                <TouchableOpacity
                  onPress={() => generateAIExplanation('simple')}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-100 border border-blue-300 rounded-lg"
                >
                  <Text className="text-xs font-semibold text-blue-700">
                    切换简单版
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => setExpanded(false)}
                className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg"
              >
                <Text className="text-xs font-semibold text-gray-700">
                  收起
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-base text-foreground leading-relaxed">
            {explanation}
          </Text>

          {/* 校园生活场景例句 */}
          {mode === 'advanced' && examples.length > 0 && (
            <View className="gap-3 mt-2">
              <Text className="text-base font-bold text-foreground">
                🏫 校园生活场景例句
              </Text>
              {examples.map((example, index) => (
                <View 
                  key={index} 
                  className="bg-white rounded-xl p-4 border border-purple-200"
                >
                  <Text className="text-sm text-foreground leading-relaxed">
                    {example}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {!expanded && !loading && (
        <View className="bg-surface rounded-2xl p-6 border border-border">
          <Text className="text-sm text-muted text-center leading-relaxed">
            点击上方按钮,让AI老师为你深度解释这个语法点 ✨
          </Text>
        </View>
      )}
    </View>
  );
}


// 错题复温组件
function WrongQuestionReview({ grammarPointId, grammarPointTitle }: { grammarPointId: string; grammarPointTitle: string }) {
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([]);
  const [explanationMode, setExplanationMode] = useState<'teacher' | 'simple'>('simple');
  const [aiExplanation, setAiExplanation] = useState<{ teacher: string; simple: string } | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWrongQuestions();
  }, [grammarPointId]);

  const loadWrongQuestions = async () => {
    setLoading(true);
    const questions = await getWrongQuestionsByGrammarPoint(grammarPointId);
    setWrongQuestions(questions);
    setLoading(false);
  };

  if (loading) {
    return null;  // 加载中不显示
  }

  if (wrongQuestions.length === 0) {
    return null;  // 没有错题不显示
  }

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold text-foreground">
          📝 错题复温
        </Text>
        <View className="px-3 py-1 bg-red-100 border border-red-300 rounded-lg">
          <Text className="text-sm font-semibold text-red-700">
            {wrongQuestions.length} 道错题
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          // 跳转到错题复习页面
          router.push({
            pathname: "/wrong-question-review",
            params: {
              grammarPointId,
              grammarPointTitle
            }
          });
        }}
        className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 gap-2">
            <Text className="text-base font-bold text-foreground">
              你在这个语法点有 {wrongQuestions.length} 道错题
            </Text>
            <Text className="text-sm text-muted">
              点击复习错题,巩固知识点 →
            </Text>
          </View>
          <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center">
            <Text className="text-2xl">📖</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
