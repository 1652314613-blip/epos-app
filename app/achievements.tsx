import { useState, useEffect } from "react";
import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedListItem } from "@/components/animated-list-item";
import {
  getUserLevel,
  getUserAchievements,
  getRarityColor,
  getRarityLabel,
  type Achievement,
  type UserLevel,
} from "@/services/gamification-service";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48 - 16) / 2; // 2列布局,考虑padding和gap

export default function AchievementsScreen() {
  const colors = useColors();
  const [level, setLevel] = useState<UserLevel | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [levelData, achievementsData] = await Promise.all([
        getUserLevel(),
        getUserAchievements(),
      ]);
      setLevel(levelData);
      setAchievements(achievementsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="p-6 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-sm text-muted mt-4">正在加载...</Text>
      </ScreenContainer>
    );
  }

  if (!level) {
    return (
      <ScreenContainer className="p-6 items-center justify-center">
        <Text className="text-lg text-foreground">加载失败</Text>
      </ScreenContainer>
    );
  }

  const categories = [
    { id: "all", label: "全部", icon: "🏆" },
    { id: "learning", label: "学习", icon: "📚" },
    { id: "mastery", label: "掌握", icon: "⭐" },
    { id: "streak", label: "坚持", icon: "🔥" },
    { id: "milestone", label: "里程碑", icon: "🎯" },
  ];

  const filteredAchievements = selectedCategory === "all"
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">成就与等级</Text>
            <Text className="text-sm text-muted">你的学习历程</Text>
          </View>

          {/* Level Card */}
          <View className="bg-gradient-to-br rounded-3xl p-6 border-2" style={{ backgroundColor: colors.primary + "10", borderColor: colors.primary }}>
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-sm text-muted">当前等级</Text>
                <Text className="text-3xl font-bold text-foreground">Lv.{level.level}</Text>
                <Text className="text-base font-semibold" style={{ color: colors.primary }}>
                  {level.title}
                </Text>
              </View>
              <View className="w-20 h-20 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary }}>
                <Text className="text-4xl">🎓</Text>
              </View>
            </View>

            {/* XP Progress Bar */}
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-muted">经验值</Text>
                <Text className="text-xs font-semibold text-foreground">
                  {level.currentXP} / {level.nextLevelXP} XP
                </Text>
              </View>
              <View className="h-3 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${(level.currentXP / level.nextLevelXP) * 100}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
              <Text className="text-xs text-muted text-center">
                距离下一级还需 {level.nextLevelXP - level.currentXP} XP
              </Text>
            </View>

            {/* Total XP */}
            <View className="mt-4 pt-4 border-t border-border flex-row items-center justify-between">
              <Text className="text-sm text-muted">累计经验</Text>
              <Text className="text-lg font-bold" style={{ color: colors.primary }}>
                {level.totalXP} XP
              </Text>
            </View>
          </View>

          {/* Achievement Progress */}
          <View className="bg-surface rounded-2xl p-5 border border-border gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">勋章收集进度</Text>
              <Text className="text-base font-bold" style={{ color: colors.primary }}>
                {unlockedCount}/{achievements.length}
              </Text>
            </View>
            
            <View className="h-3 bg-border rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: colors.primary,
                }}
              />
            </View>
            
            <Text className="text-sm text-muted text-center">
              已解锁 {progressPercent}% 的勋章
            </Text>
          </View>

          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                className="px-4 py-2 rounded-full flex-row items-center gap-2"
                style={{
                  backgroundColor: selectedCategory === cat.id ? colors.primary : colors.surface,
                  borderWidth: 1,
                  borderColor: selectedCategory === cat.id ? colors.primary : colors.border,
                }}
              >
                <Text className="text-base">{cat.icon}</Text>
                <Text
                  className="text-sm font-semibold"
                  style={{
                    color: selectedCategory === cat.id ? "#FFFFFF" : colors.foreground,
                  }}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Achievements Grid */}
          <View className="flex-row flex-wrap gap-4">
            {filteredAchievements.map((achievement, index) => (
              <View
                key={achievement.id}
                style={{ width: cardWidth }}
              >
                <AnimatedListItem index={index}>
                  <View
                    className="rounded-2xl p-4 gap-3 border-2"
                    style={{
                      backgroundColor: achievement.unlocked ? colors.surface : colors.background,
                      borderColor: achievement.unlocked ? getRarityColor(achievement.rarity) : colors.border,
                      opacity: achievement.unlocked ? 1 : 0.5,
                    }}
                  >
                    {/* Icon and Rarity */}
                    <View className="items-center gap-2">
                      <View
                        className="w-16 h-16 rounded-full items-center justify-center"
                        style={{
                          backgroundColor: achievement.unlocked
                            ? getRarityColor(achievement.rarity) + "20"
                            : colors.border,
                        }}
                      >
                        <Text className="text-4xl">{achievement.icon}</Text>
                      </View>
                      
                      {achievement.unlocked && (
                        <View
                          className="px-2 py-1 rounded-full"
                          style={{ backgroundColor: getRarityColor(achievement.rarity) }}
                        >
                          <Text className="text-xs font-bold text-white">
                            {getRarityLabel(achievement.rarity)}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Title and Description */}
                    <View className="gap-1">
                      <Text
                        className="text-sm font-bold text-center"
                        style={{ color: achievement.unlocked ? colors.foreground : colors.muted }}
                      >
                        {achievement.title}
                      </Text>
                      <Text
                        className="text-xs text-center leading-relaxed"
                        style={{ color: colors.muted }}
                      >
                        {achievement.description}
                      </Text>
                    </View>

                    {/* Requirement */}
                    {!achievement.unlocked && (
                      <View className="bg-background rounded-lg p-2">
                        <Text className="text-xs text-muted text-center">
                          {achievement.requirement.description}
                        </Text>
                      </View>
                    )}

                    {/* Unlocked Date */}
                    {achievement.unlocked && achievement.unlockedAt && (
                      <Text className="text-xs text-muted text-center">
                        {new Date(achievement.unlockedAt).toLocaleDateString("zh-CN")}
                      </Text>
                    )}

                    {/* Lock Icon */}
                    {!achievement.unlocked && (
                      <View className="absolute top-2 right-2">
                        <Ionicons name="lock-closed" size={16} color={colors.muted} />
                      </View>
                    )}
                  </View>
                </AnimatedListItem>
              </View>
            ))}
          </View>

          {/* Empty State */}
          {filteredAchievements.length === 0 && (
            <View className="bg-surface rounded-2xl p-6 items-center gap-2">
              <Text className="text-4xl">🏆</Text>
              <Text className="text-base font-semibold text-foreground">暂无勋章</Text>
              <Text className="text-sm text-muted text-center">
                在这个分类下还没有勋章
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
