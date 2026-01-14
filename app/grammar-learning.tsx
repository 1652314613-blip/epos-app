import { useState } from "react";
import { View, Text, ScrollView, Platform, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { AnimatedButton } from "@/components/animated-button";
import { 
  grammarPoints, 
  grammarPointsByGrade, 
  grammarPointsByCategory,
  grammarPointsByDifficulty,
  type GrammarPoint 
} from "@/lib/grammar-points-data";

type ViewMode = 'grade' | 'category' | 'difficulty';

export default function GrammarLearningScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('grade');
  const [selectedGrade, setSelectedGrade] = useState<'7A' | '7B' | '9'>('7A');

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleGrammarPointPress = (point: GrammarPoint) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push({
      pathname: "/grammar-point-detail",
      params: { pointId: point.id }
    });
  };

  const handlePracticePress = (point: GrammarPoint) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push({
      pathname: "/grammar-exercise",
      params: {
        grammarPoint: point.titleCn,
        grammarType: point.title,
        gradeLevel: point.grade === '7A' ? '7' : '7'
      }
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      tense: '⏰',
      pronoun: '👤',
      noun: '📦',
      sentence: '💬',
      modifier: '✨',
      conjunction: '🔗',
      number: '🔢'
    };
    return icons[category] || '📚';
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      tense: '时态',
      pronoun: '代词',
      noun: '名词',
      sentence: '句型',
      modifier: '修饰词',
      conjunction: '连词与情态动词',
      number: '数词'
    };
    return names[category] || category;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      basic: 'bg-green-100 border-green-300',
      intermediate: 'bg-blue-100 border-blue-300',
      advanced: 'bg-purple-100 border-purple-300'
    };
    return colors[difficulty] || 'bg-gray-100 border-gray-300';
  };

  const getDifficultyTextColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      basic: 'text-green-700',
      intermediate: 'text-blue-700',
      advanced: 'text-purple-700'
    };
    return colors[difficulty] || 'text-gray-700';
  };

  const getDifficultyName = (difficulty: string) => {
    const names: Record<string, string> = {
      basic: '基础',
      intermediate: '中级',
      advanced: '高级'
    };
    return names[difficulty] || difficulty;
  };

  const getCategoryBorderColor = (category: string) => {
    const colors: Record<string, string> = {
      tense: 'border-l-blue-500',
      pronoun: 'border-l-purple-500',
      noun: 'border-l-green-500',
      sentence: 'border-l-orange-500',
      modifier: 'border-l-pink-500',
      conjunction: 'border-l-indigo-500',
      number: 'border-l-yellow-500'
    };
    return colors[category] || 'border-l-gray-500';
  };

  const renderGrammarPointCard = (point: GrammarPoint) => (
    <View key={point.id} className={`bg-surface rounded-2xl p-4 border-l-4 border border-border gap-3 ${getCategoryBorderColor(point.category)}`}>
      {/* 标题和标签 */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">
              {point.titleCn}
            </Text>
            <Text className="text-sm text-muted mt-1">
              {point.title}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full border ${getDifficultyColor(point.difficulty)}`}>
            <Text className={`text-xs font-semibold ${getDifficultyTextColor(point.difficulty)}`}>
              {getDifficultyName(point.difficulty)}
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center gap-2 flex-wrap">
          <Text className="text-xs text-muted">
            {getCategoryIcon(point.category)} {getCategoryName(point.category)}
          </Text>
          <Text className="text-xs text-muted">•</Text>
          <Text className="text-xs text-muted">
            {point.grade} Unit {point.unit}
          </Text>
          {/* 考点标签 */}
          {point.examTags && point.examTags.map((tag, index) => (
            <View key={index}>
              <Text className="text-xs text-muted">•</Text>
              <View className={`px-2 py-0.5 rounded ${
                tag === '中考频次' ? 'bg-orange-100' : 'bg-red-100'
              }`}>
                <Text className={`text-xs font-semibold ${
                  tag === '中考频次' ? 'text-orange-700' : 'text-red-700'
                }`}>
                  {tag === '中考频次' ? '📝' : '🎯'} {tag}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 描述 */}
      <Text className="text-sm text-foreground leading-relaxed" numberOfLines={2}>
        {point.description}
      </Text>

      {/* 按钮 */}
      <View className="flex-row gap-2">
        <View className="flex-1">
          <AnimatedButton 
            onPress={() => handleGrammarPointPress(point)}
            variant="secondary"
          >
            <Text className="text-sm font-semibold text-foreground text-center">
              📖 学习
            </Text>
          </AnimatedButton>
        </View>
        <View className="flex-1">
          <AnimatedButton 
            onPress={() => handlePracticePress(point)}
            variant="primary"
          >
            <Text className="text-sm font-semibold text-background text-center">
              ✏️ 练习
            </Text>
          </AnimatedButton>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* 标题 */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              📚 语法学习
            </Text>
            <Text className="text-base text-muted">
              系统学习七年级英语语法知识点
            </Text>
          </View>

          {/* 统计卡片 */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-primary/10 rounded-xl p-4 border border-primary/20">
              <Text className="text-2xl font-bold text-primary">
                {grammarPoints.length}
              </Text>
              <Text className="text-sm text-muted mt-1">
                语法知识点
              </Text>
            </View>
            <View className="flex-1 bg-green-50 rounded-xl p-4 border border-green-200">
              <Text className="text-2xl font-bold text-green-600">
                {grammarPointsByGrade['7A'].length}
              </Text>
              <Text className="text-sm text-muted mt-1">
                七年级上册
              </Text>
            </View>
            <View className="flex-1 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <Text className="text-2xl font-bold text-blue-600">
                {grammarPointsByGrade['7B'].length}
              </Text>
              <Text className="text-sm text-muted mt-1">
                七年级下册
              </Text>
            </View>
          </View>

          {/* 查看模式切换 */}
          <View className="gap-3">
            <Text className="text-base font-semibold text-foreground">
              查看方式
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleViewModeChange('grade')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                  viewMode === 'grade' 
                    ? 'bg-primary border-primary' 
                    : 'bg-surface border-border'
                }`}
              >
                <Text className={`text-sm font-semibold text-center ${
                  viewMode === 'grade' ? 'text-background' : 'text-foreground'
                }`}>
                  📖 按年级
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleViewModeChange('category')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                  viewMode === 'category' 
                    ? 'bg-primary border-primary' 
                    : 'bg-surface border-border'
                }`}
              >
                <Text className={`text-sm font-semibold text-center ${
                  viewMode === 'category' ? 'text-background' : 'text-foreground'
                }`}>
                  🏷️ 按类别
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleViewModeChange('difficulty')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                  viewMode === 'difficulty' 
                    ? 'bg-primary border-primary' 
                    : 'bg-surface border-border'
                }`}
              >
                <Text className={`text-sm font-semibold text-center ${
                  viewMode === 'difficulty' ? 'text-background' : 'text-foreground'
                }`}>
                  ⭐ 按难度
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 按年级查看 */}
          {viewMode === 'grade' && (
            <View className="gap-4">
              {/* 年级切换 */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => {
                    setSelectedGrade('7A');
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                    selectedGrade === '7A' 
                      ? 'bg-green-500 border-green-500' 
                      : 'bg-surface border-border'
                  }`}
                >
                  <Text className={`text-base font-semibold text-center ${
                    selectedGrade === '7A' ? 'text-white' : 'text-foreground'
                  }`}>
                    七年级上册 ({grammarPointsByGrade['7A'].length}个)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedGrade('7B');
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                    selectedGrade === '7B' 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'bg-surface border-border'
                  }`}
                >
                  <Text className={`text-base font-semibold text-center ${
                    selectedGrade === '7B' ? 'text-white' : 'text-foreground'
                  }`}>
                    七年级下册 ({grammarPointsByGrade['7B'].length}个)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 语法点列表 */}
              <View className="gap-3">
                {grammarPointsByGrade[selectedGrade].map(point => renderGrammarPointCard(point))}
              </View>
            </View>
          )}

          {/* 按类别查看 */}
          {viewMode === 'category' && (
            <View className="gap-4">
              {Object.entries(grammarPointsByCategory).map(([category, points]) => (
                <View key={category} className="gap-3">
                  <Text className="text-lg font-bold text-foreground">
                    {getCategoryIcon(category)} {getCategoryName(category)} ({points.length}个)
                  </Text>
                  {points.map(point => renderGrammarPointCard(point))}
                </View>
              ))}
            </View>
          )}

          {/* 按难度查看 */}
          {viewMode === 'difficulty' && (
            <View className="gap-4">
              {Object.entries(grammarPointsByDifficulty).map(([difficulty, points]) => (
                <View key={difficulty} className="gap-3">
                  <Text className="text-lg font-bold text-foreground">
                    {difficulty === 'basic' ? '🟢' : difficulty === 'intermediate' ? '🔵' : '🟣'} {getDifficultyName(difficulty)} ({points.length}个)
                  </Text>
                  {points.map(point => renderGrammarPointCard(point))}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
