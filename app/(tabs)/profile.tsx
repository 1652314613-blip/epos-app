import { useState, useEffect } from "react";
import { ScrollView, Text, View, Platform, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedListItem } from "@/components/animated-list-item";
import { LearningTrendChart } from "@/components/learning-trend-chart";
import { VocabularyMasteryChart } from "@/components/vocabulary-mastery-chart";
import { AbilityRadarChart } from "@/components/ability-radar-chart";
import { getUserSettings, saveUserSettings, getCheckHistory, type UserSettings } from "@/lib/storage";
import { getVocabularyStats } from "@/lib/vocabulary-storage";
import { calculateAbilityScores, type AbilityScores } from "@/services/ability-radar-service";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";

export default function ProfileScreen() {
  const colors = useColors();
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    gradeLevel: 7,
    notificationsEnabled: true,
    dailyGoal: 5,
  });
  const [stats, setStats] = useState({
    totalChecks: 0,
    correctCount: 0,
    errorCount: 0,
    vocabularyTotal: 0,
    vocabularyMastered: 0,
    learningStreak: 0,
  });
  const [abilityScores, setAbilityScores] = useState<AbilityScores | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedSettings = await getUserSettings();
    setSettings(savedSettings);

    if (useMockData) {
      // 使用模拟数据
      setStats({
        totalChecks: 127,
        correctCount: 98,
        errorCount: 29,
        vocabularyTotal: 456,
        vocabularyMastered: 312,
        learningStreak: 15,
      });
      setAbilityScores({
        grammar: 85,
        vocabulary: 78,
        reading: 92,
        writing: 73,
        listening: 88,
        speaking: 70,
      });
    } else {
      const history = await getCheckHistory();
      const totalChecks = history.length;
      const correctCount = history.filter((h) => h.result.errors.length === 0).length;
      const errorCount = totalChecks - correctCount;

      const vocabStats = await getVocabularyStats();

      setStats({
        totalChecks,
        correctCount,
        errorCount,
        vocabularyTotal: vocabStats.totalWords,
        vocabularyMastered: vocabStats.masteredWords,
        learningStreak: vocabStats.streak,
      });

      // 加载能力雷达图数据
      const scores = await calculateAbilityScores();
      setAbilityScores(scores);
    }
  };

  const handleGradeLevelChange = async (grade: 7 | 8 | 9 | 10 | 11 | 12) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const newSettings = { ...settings, gradeLevel: grade };
    setSettings(newSettings);
    await saveUserSettings(newSettings);
  };

  const handleClearData = () => {
    Alert.alert(
      "清除数据",
      "确定要清除所有学习数据吗？此操作不可恢复。",
      [
        { text: "取消", style: "cancel" },
        {
          text: "确定",
          style: "destructive",
          onPress: async () => {
            // TODO: 实现清除数据功能
            Alert.alert("提示", "数据清除功能开发中");
          },
        },
      ]
    );
  };

  const accuracyRate =
    stats.totalChecks > 0
      ? Math.round((stats.correctCount / stats.totalChecks) * 100)
      : 0;

  const vocabMasteryRate =
    stats.vocabularyTotal > 0
      ? Math.round((stats.vocabularyMastered / stats.vocabularyTotal) * 100)
      : 0;

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">我的</Text>
            {user ? (
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-muted">
                  {user.name || `用户${user.phoneNumber?.slice(-4)}`}
                </Text>
                <Text className="text-xs text-muted">·</Text>
                <Text className="text-sm text-muted">{user.phoneNumber}</Text>
              </View>
            ) : (
              <Text className="text-sm text-muted">学习进度和个人设置</Text>
            )}
          </View>

          {/* Mock Data Toggle (Development Only) */}
          {__DEV__ && (
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-foreground">🔧 模拟数据模式</Text>
                <AnimatedButton
                  onPress={() => {
                    setUseMockData(!useMockData);
                    setTimeout(() => loadData(), 100);
                  }}
                  className="px-4 py-2 rounded-full"
                  style={{ backgroundColor: useMockData ? colors.primary : colors.border }}
                >
                  <Text className="text-xs font-semibold" style={{ color: useMockData ? "white" : colors.muted }}>
                    {useMockData ? "已开启" : "已关闭"}
                  </Text>
                </AnimatedButton>
              </View>
              <Text className="text-xs text-muted mt-2">
                开启后将显示模拟的学习数据，方便测试界面效果
              </Text>
            </View>
          )}

          {/* Empty State or Learning Stats */}
          {stats.totalChecks === 0 && !useMockData ? (
            <View className="bg-surface rounded-2xl p-8 border border-border items-center gap-4">
              <Text className="text-6xl">🚀</Text>
              <View className="items-center gap-2">
                <Text className="text-xl font-bold text-foreground">开始你的学习之旅</Text>
                <Text className="text-sm text-muted text-center">
                  还没有学习记录，去首页开始第一次语法检查吧！
                </Text>
              </View>
              <AnimatedButton
                onPress={() => router.push("/")}
                className="px-6 py-3 rounded-full"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-sm font-semibold text-white">去检查语法</Text>
              </AnimatedButton>
            </View>
          ) : (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground">📊 学习统计</Text>
            
            {/* Stats Cards */}
            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center gap-1">
                <Text className="text-3xl font-bold text-primary">
                  {stats.totalChecks}
                </Text>
                <Text className="text-xs text-muted">已检查</Text>
              </View>
              <View className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center gap-1">
                <Text className="text-3xl font-bold text-success">
                  {stats.correctCount}
                </Text>
                <Text className="text-xs text-muted">正确</Text>
              </View>
              <View className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center gap-1">
                <Text className="text-3xl font-bold text-error">
                  {stats.errorCount}
                </Text>
                <Text className="text-xs text-muted">错误</Text>
              </View>
            </View>

            {/* Accuracy */}
            <View className="bg-primary/10 rounded-2xl p-4 border border-primary/30">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-base font-semibold text-foreground">
                  语法正确率
                </Text>
                <Text className="text-2xl font-bold text-primary">
                  {accuracyRate}%
                </Text>
              </View>
              <View className="bg-background rounded-full h-2 overflow-hidden">
                <View
                  className="bg-primary h-full"
                  style={{ width: `${accuracyRate}%` }}
                />
              </View>
            </View>

            {/* Vocabulary Stats */}
            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-2xl p-4 border border-border gap-2">
                <Text className="text-sm text-muted">单词本</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {stats.vocabularyTotal}
                </Text>
                <Text className="text-xs text-muted">
                  已掌握 {stats.vocabularyMastered} 个
                </Text>
              </View>
              <View className="flex-1 bg-surface rounded-2xl p-4 border border-border gap-2">
                <Text className="text-sm text-muted">学习连续</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {stats.learningStreak}
                </Text>
                <Text className="text-xs text-muted">天</Text>
              </View>
            </View>

            {/* Vocabulary Mastery */}
            <View className="bg-success/10 rounded-2xl p-4 border border-success/30">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-base font-semibold text-foreground">
                  单词掌握度
                </Text>
                <Text className="text-2xl font-bold text-success">
                  {vocabMasteryRate}%
                </Text>
              </View>
              <View className="bg-background rounded-full h-2 overflow-hidden">
                <View
                  className="bg-success h-full"
                  style={{ width: `${vocabMasteryRate}%` }}
                />
              </View>
            </View>
          </View>
          )}

          {/* Ability Radar Chart */}
          {abilityScores && (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground">🎯 能力雷达图</Text>
              <View className="bg-surface rounded-2xl p-6 border border-border items-center">
                {abilityScores.vocabulary === 0 && 
                 abilityScores.grammar === 0 && 
                 abilityScores.authenticity === 0 && 
                 abilityScores.perseverance === 0 && 
                 abilityScores.difficulty === 0 ? (
                  <View className="items-center gap-3 py-8">
                    <Text className="text-5xl">🚀</Text>
                    <Text className="text-lg font-bold text-foreground">开启你的学习之旅</Text>
                    <Text className="text-sm text-muted text-center">
                      完成首次语法检查、添加单词或学习教材内容{"\n"}
                      就能看到你的能力评估啦！
                    </Text>
                  </View>
                ) : (
                  <AbilityRadarChart scores={abilityScores} size={250} />
                )}
              </View>
            </View>
          )}

          {/* Charts */}
          <View className="gap-4">
            <LearningTrendChart />
            <VocabularyMasteryChart />
          </View>

          {/* Quick Actions */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">📦 快捷功能</Text>
            
            {/* Score Report */}
            <AnimatedButton
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push("/score-report" as any);
              }}
              className="bg-gradient-to-r rounded-2xl p-4 border-2 flex-row items-center justify-between"
              style={{ backgroundColor: colors.primary + "10", borderColor: colors.primary }}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-3xl">📈</Text>
                <View>
                  <Text className="text-base font-semibold text-foreground">
                    我的提分报告
                  </Text>
                  <Text className="text-xs text-muted">
                    查看学习数据和提分建议
                  </Text>
                </View>
              </View>
              <Text className="text-primary text-xl">›</Text>
            </AnimatedButton>
            
            {/* Achievements */}
            <AnimatedButton
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push("/achievements" as any);
              }}
              className="bg-gradient-to-r rounded-2xl p-4 border-2 flex-row items-center justify-between"
              style={{ backgroundColor: "#F59E0B10", borderColor: "#F59E0B" }}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-3xl">🏆</Text>
                <View>
                  <Text className="text-base font-semibold text-foreground">
                    成就与等级
                  </Text>
                  <Text className="text-xs text-muted">
                    查看你的勋章和等级进度
                  </Text>
                </View>
              </View>
              <Text style={{ color: "#F59E0B" }} className="text-xl">›</Text>
            </AnimatedButton>
            
            {user ? (
              <AnimatedButton
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  Alert.alert(
                    "退出登录",
                    "确定要退出登录吗？",
                    [
                      { text: "取消", style: "cancel" },
                      {
                        text: "确定",
                        style: "destructive",
                        onPress: async () => {
                          await logout();
                          Alert.alert("提示", "已退出登录");
                        },
                      },
                    ]
                  );
                }}
                className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-3xl">🚪</Text>
                  <View>
                    <Text className="text-base font-semibold text-foreground">
                      退出登录
                    </Text>
                    <Text className="text-xs text-muted">
                      退出当前账号
                    </Text>
                  </View>
                </View>
                <Text className="text-primary text-xl">›</Text>
              </AnimatedButton>
            ) : (
              <AnimatedButton
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  router.push("/phone-login" as any);
                }}
                className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-3xl">📱</Text>
                  <View>
                    <Text className="text-base font-semibold text-foreground">
                      手机号登录
                    </Text>
                    <Text className="text-xs text-muted">
                      使用手机号验证码登录
                    </Text>
                  </View>
                </View>
                <Text className="text-primary text-xl">›</Text>
              </AnimatedButton>
            )}

            <AnimatedButton
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push("/quiz-history" as any);
              }}
              className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-3xl">📊</Text>
                <View>
                  <Text className="text-base font-semibold text-foreground">
                    测试历史
                  </Text>
                  <Text className="text-xs text-muted">
                    查看你的学习进步轨迹
                  </Text>
                </View>
              </View>
              <Text className="text-primary text-xl">›</Text>
            </AnimatedButton>
          </View>

          {/* Settings */}
          <View className="gap-3">
            <Text className="text-lg font-bold text-foreground">⚙️ 设置</Text>

            {/* Grade Level */}
            <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
              <Text className="text-base font-semibold text-foreground">
                年级设置
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {([7, 8, 9, 10, 11, 12] as const).map((grade) => (
                  <AnimatedButton
                    key={grade}
                    onPress={() => handleGradeLevelChange(grade)}
                    variant={settings.gradeLevel === grade ? "primary" : "secondary"}
                    className="px-4 py-2"
                  >
                    <Text
                      className={`font-semibold ${
                        settings.gradeLevel === grade
                          ? "text-background"
                          : "text-primary"
                      }`}
                    >
                      {grade}年级
                    </Text>
                  </AnimatedButton>
                ))}
              </View>
            </View>

            {/* Data Management */}
            <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
              <Text className="text-base font-semibold text-foreground">
                数据管理
              </Text>
              <AnimatedButton
                onPress={handleClearData}
                variant="secondary"
                className="bg-error/10 border-error/30 py-3"
              >
                <Text className="text-error font-semibold">清除所有数据</Text>
              </AnimatedButton>
            </View>
          </View>

          {/* About */}
          <View className="bg-primary/10 rounded-2xl p-4 border border-primary/30 gap-2">
            <Text className="text-base font-semibold text-foreground">
              📱 关于应用
            </Text>
            <Text className="text-sm text-foreground">
              语法助手 v1.0{"\n"}
              专为中国初高中学生设计的英语学习应用
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
