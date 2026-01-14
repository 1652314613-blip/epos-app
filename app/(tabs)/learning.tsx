import { ScrollView, Text, View, Platform } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedListItem } from "@/components/animated-list-item";
import { EposLogo } from "@/components/epos-logo";

export default function LearningCenterScreen() {
  const colors = useColors();

  const learningModules = [
    {
      id: "textbook",
      title: "📚 教材学习",
      description: "人教版初高中英语教材同步学习",
      subtitle: "词汇+语法 | 与学校进度同步",
      route: "/textbook" as any,
      color: colors.primary,
    },
    {
      id: "vocabulary",
      title: "📖 单词本",
      description: "个人单词本和智能记忆",
      subtitle: "间隔重复算法 | 高效记忆",
      route: "/vocabulary" as any,
      color: "#10B981",
    },
    {
      id: "swipe",
      title: "💖 滑卡学单词",
      description: "趣味滑卡式学习，让记单词像玩游戏",
      subtitle: "右滑认识 | 左滑不认识",
      route: "/swipe-vocabulary" as any,
      color: "#EC4899",
    },
    {
      id: "collection",
      title: "✨ 积累本",
      description: "收藏好词好句，提升表达水平",
      subtitle: "高级表达 | 考试加分项",
      route: "/collection-book" as any,
      color: "#F59E0B",
    },

  ];

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Logo */}
          <EposLogo />

          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">学习中心</Text>
            <Text className="text-sm text-muted">
              选择学习模块，开始你的英语学习之旅
            </Text>
          </View>

          {/* Learning Modules */}
          <View className="gap-4">
            {learningModules.map((module, index) => (
              <AnimatedListItem key={module.id} index={index}>
                <AnimatedButton
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    router.push(module.route);
                  }}
                  variant="secondary"
                  className="bg-surface border border-border p-0"
                >
                  <View className="p-5 w-full gap-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-2xl font-bold text-foreground">
                        {module.title}
                      </Text>
                      <View className="bg-primary/20 px-3 py-1 rounded-full">
                        <Text className="text-xs font-semibold text-primary">
                          进入 →
                        </Text>
                      </View>
                    </View>
                    <Text className="text-base text-foreground">
                      {module.description}
                    </Text>
                    <Text className="text-sm text-muted">{module.subtitle}</Text>
                  </View>
                </AnimatedButton>
              </AnimatedListItem>
            ))}
          </View>

          {/* Quick Stats */}
          <View className="bg-primary/10 rounded-2xl p-5 border border-primary/30 gap-3">
            <Text className="text-base font-semibold text-foreground">
              💡 学习建议
            </Text>
            <Text className="text-sm text-foreground leading-relaxed">
              • 建议按照教材学习模块跟随学校进度{"\n"}
              • 单词本用于记忆和复习生词{"\n"}
              • 积累本收藏高级表达，提升作文分数{"\n"}
              • 语法库可以系统学习语法知识{"\n"}
              • 配合首页的语法检查功能，学以致用
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
