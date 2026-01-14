import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { GRAMMAR_TOPICS, type GradeLevel } from "@/lib/grammar-data";
import { EposLogo } from "@/components/epos-logo";

export default function LibraryScreen() {
  const colors = useColors();
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(9);

  const grades: GradeLevel[] = [7, 8, 9, 10, 11, 12];

  const handleGradeSelect = (grade: GradeLevel) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedGrade(grade);
  };

  // Get topics for selected grade
  const topics = GRAMMAR_TOPICS.filter((topic) => topic.gradeLevel === selectedGrade);

  // Group topics by category
  const topicsByCategory = topics.reduce(
    (acc, topic) => {
      if (!acc[topic.category]) {
        acc[topic.category] = [];
      }
      acc[topic.category].push(topic);
      return acc;
    },
    {} as Record<string, typeof topics>
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "basic":
        return colors.success;
      case "intermediate":
        return colors.warning;
      case "advanced":
        return colors.error;
      default:
        return colors.muted;
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="p-6 gap-5">
          {/* Logo */}
          <EposLogo />

          {/* Header */}
          <View className="pt-4">
            <Text className="text-3xl font-bold text-foreground">语法库</Text>
            <Text className="text-base text-muted mt-1">
              基于人教版教材的语法学习
            </Text>
          </View>

          {/* Grade Level Tabs */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-3">选择年级：</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {grades.map((grade) => (
                  <TouchableOpacity
                    key={grade}
                    onPress={() => handleGradeSelect(grade)}
                    style={{
                      backgroundColor:
                        selectedGrade === grade ? colors.primary : colors.surface,
                      borderColor: selectedGrade === grade ? colors.primary : colors.border,
                      borderWidth: 1,
                    }}
                    className="px-5 py-3 rounded-full"
                  >
                    <Text
                      style={{
                        color: selectedGrade === grade ? "#ffffff" : colors.foreground,
                      }}
                      className="font-semibold"
                    >
                      {grade} 年级
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Topics by Category */}
          <View className="gap-4">
            {Object.entries(topicsByCategory).map(([category, categoryTopics]) => (
              <View key={category}>
                <Text className="text-lg font-semibold text-foreground mb-3">{category}</Text>
                <View className="gap-3">
                  {categoryTopics.map((topic) => (
                    <View
                      key={topic.id}
                      className="bg-surface rounded-2xl p-5 border border-border"
                    >
                      <View className="flex-row items-start justify-between mb-2">
                        <Text className="text-base font-semibold text-foreground flex-1">
                          {topic.title}
                        </Text>
                        <View
                          className="px-3 py-1 rounded-full"
                          style={{ backgroundColor: `${getDifficultyColor(topic.difficulty)}20` }}
                        >
                          <Text
                            className="text-xs font-medium capitalize"
                            style={{ color: getDifficultyColor(topic.difficulty) }}
                          >
                            {topic.difficulty}
                          </Text>
                        </View>
                      </View>

                      <Text className="text-sm text-muted leading-relaxed mb-3">
                        {topic.description}
                      </Text>

                      <View className="flex-row items-center justify-between">
                        <Text className="text-xs text-primary">📚 {topic.pepReference}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            if (Platform.OS !== "web") {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }
                            // TODO: Navigate to lesson detail
                          }}
                          className="px-4 py-2 rounded-full"
                          style={{ backgroundColor: `${colors.primary}20` }}
                        >
                          <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                            学习
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Empty State */}
          {topics.length === 0 && (
            <View className="bg-surface rounded-2xl p-8 border border-border items-center">
              <Text className="text-base text-muted">此年级暂无主题</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
