import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { EposLogo } from '@/components/epos-logo';
import { useColors } from '@/hooks/use-colors';
import {
  getAllWrongQuestions,
  getWrongCategories,
  getWrongBookStats,
  getQuestionsForReview,
  type WrongQuestion
} from '../lib/wrong-book';

export default function WrongBookScreen() {
  const router = useRouter();
  const [questions, setQuestions] = useState<WrongQuestion[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'category' | 'review'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [allQuestions, cats, statistics] = await Promise.all([
      getAllWrongQuestions(),
      getWrongCategories(),
      getWrongBookStats()
    ]);
    
    setQuestions(allQuestions.filter(q => !q.mastered));
    setCategories(cats);
    setStats(statistics);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '时态变化': 'bg-blue-500',
      '主谓一致': 'bg-purple-500',
      '冠词误用': 'bg-green-500',
      '搭配错误': 'bg-orange-500',
      '语序错误': 'bg-pink-500',
      '介词误用': 'bg-yellow-500',
      '词性混淆': 'bg-red-500',
      '其他': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getMasteryColor = (level: number) => {
    if (level >= 80) return 'bg-green-500';
    if (level >= 50) return 'bg-yellow-500';
    if (level >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const filteredQuestions = selectedCategory
    ? questions.filter(q => q.category === selectedCategory)
    : questions;

  const colors = useColors();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Logo */}
      <View className="bg-white px-4 pt-4 pb-2 border-b border-gray-200">
        <EposLogo />
      </View>

      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">智能诊断中心</Text>
        {stats && (
          <View className="flex-row gap-4 mt-3">
            <View>
              <Text className="text-sm text-gray-600">待复习</Text>
              <Text className="text-xl font-bold text-blue-600">{stats.unmastered}</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-600">已掌握</Text>
              <Text className="text-xl font-bold text-green-600">{stats.mastered}</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-600">总计</Text>
              <Text className="text-xl font-bold text-gray-900">{stats.total}</Text>
            </View>
          </View>
        )}
      </View>

      {/* View Mode Tabs */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row px-4 py-3">
          <TouchableOpacity
            onPress={() => {
              setViewMode('all');
              setSelectedCategory(null);
            }}
            className={`flex-1 py-2 rounded-lg mr-2 ${
              viewMode === 'all' ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <Text className={`text-center font-medium ${
              viewMode === 'all' ? 'text-white' : 'text-gray-700'
            }`}>
              全部错题
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setViewMode('category')}
            className={`flex-1 py-2 rounded-lg mr-2 ${
              viewMode === 'category' ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <Text className={`text-center font-medium ${
              viewMode === 'category' ? 'text-white' : 'text-gray-700'
            }`}>
              分类诊断
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setViewMode('review')}
            className={`flex-1 py-2 rounded-lg ${
              viewMode === 'review' ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <Text className={`text-center font-medium ${
              viewMode === 'review' ? 'text-white' : 'text-gray-700'
            }`}>
              智能复习
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter (when in category mode) */}
      {viewMode === 'category' && categories.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="bg-white border-b border-gray-200"
        >
          <View className="flex-row px-4 py-3 gap-2">
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === null ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <Text className={`text-sm font-medium ${
                selectedCategory === null ? 'text-white' : 'text-gray-700'
              }`}>
                全部
              </Text>
            </TouchableOpacity>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.category}
                onPress={() => setSelectedCategory(cat.category)}
                className={`px-4 py-2 rounded-full flex-row items-center ${
                  selectedCategory === cat.category ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  selectedCategory === cat.category ? 'text-white' : 'text-gray-700'
                }`}>
                  {cat.category}
                </Text>
                <View className={`ml-2 px-2 py-0.5 rounded-full ${
                  selectedCategory === cat.category ? 'bg-white/30' : 'bg-gray-300'
                }`}>
                  <Text className={`text-xs font-bold ${
                    selectedCategory === cat.category ? 'text-white' : 'text-gray-700'
                  }`}>
                    {cat.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Content */}
      <ScrollView 
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Category View */}
        {viewMode === 'category' && (
          <View>
            {categories.map(cat => (
              <View key={cat.category} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View className={`w-1 h-8 rounded ${getCategoryColor(cat.category)} mr-3`} />
                    <View>
                      <Text className="text-lg font-bold text-gray-900">{cat.category}</Text>
                      <Text className="text-sm text-gray-600">{cat.count}道错题</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-gray-500 mb-1">平均掌握度</Text>
                    <View className="flex-row items-center">
                      <View className={`w-16 h-2 rounded-full bg-gray-200 mr-2`}>
                        <View 
                          className={`h-2 rounded-full ${getMasteryColor(cat.avgMasteryLevel)}`}
                          style={{ width: `${cat.avgMasteryLevel}%` }}
                        />
                      </View>
                      <Text className="text-sm font-bold text-gray-900">{cat.avgMasteryLevel}%</Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory(cat.category);
                    setViewMode('all');
                  }}
                  className="bg-blue-50 rounded-lg py-2"
                >
                  <Text className="text-center text-blue-600 font-medium">
                    查看该类错题
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* All Questions View */}
        {viewMode === 'all' && (
          <View>
            {filteredQuestions.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Text className="text-6xl mb-4">🎉</Text>
                <Text className="text-lg font-bold text-gray-900 mb-2">太棒了!</Text>
                <Text className="text-gray-600">
                  {selectedCategory ? '该分类下暂无错题' : '暂无错题记录'}
                </Text>
              </View>
            ) : (
              filteredQuestions.map((question) => (
                <TouchableOpacity
                  key={question.id}
                  onPress={() => router.push({
                    pathname: '/wrong-question-detail',
                    params: { id: question.id }
                  })}
                  className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                >
                  {/* Header */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        {question.category && (
                          <View className={`px-2 py-1 rounded ${getCategoryColor(question.category)} mr-2`}>
                            <Text className="text-xs text-white font-medium">
                              {question.category}
                            </Text>
                          </View>
                        )}
                        <Text className="text-xs text-gray-500">
                          {new Date(question.timestamp).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text className="text-sm font-bold text-gray-900 mb-1">
                        {question.grammarPointTitle}
                      </Text>
                    </View>
                    
                    {/* Mastery Level */}
                    <View className="items-end ml-2">
                      <Text className="text-xs text-gray-500 mb-1">掌握度</Text>
                      <View className="flex-row items-center">
                        <View className="w-12 h-2 rounded-full bg-gray-200 mr-1">
                          <View 
                            className={`h-2 rounded-full ${getMasteryColor(question.masteryLevel)}`}
                            style={{ width: `${question.masteryLevel}%` }}
                          />
                        </View>
                        <Text className="text-xs font-bold text-gray-900">
                          {question.masteryLevel}%
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Question */}
                  <View className="bg-red-50 rounded-lg p-3 mb-2">
                    <Text className="text-xs text-red-600 font-medium mb-1">❌ 你的答案</Text>
                    <Text className="text-sm text-gray-900">{question.userAnswer}</Text>
                  </View>

                  <View className="bg-green-50 rounded-lg p-3 mb-2">
                    <Text className="text-xs text-green-600 font-medium mb-1">✅ 正确答案</Text>
                    <Text className="text-sm text-gray-900">{question.correctAnswer}</Text>
                  </View>

                  {/* Stats */}
                  <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
                    <Text className="text-xs text-gray-500">
                      已复习 {question.reviewCount} 次
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-xs text-blue-600 font-medium">点击查看详情</Text>
                      <Text className="text-blue-600 ml-1">→</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Review Mode */}
        {viewMode === 'review' && (
          <View>
            <View className="bg-blue-50 rounded-xl p-4 mb-4">
              <Text className="text-lg font-bold text-blue-900 mb-2">🎯 智能复习计划</Text>
              <Text className="text-sm text-blue-700 leading-5">
                根据你的学习情况,我们为你推荐了最需要复习的错题。这些题目会根据掌握度、复习时间和错误频率智能排序。
              </Text>
            </View>

            <TouchableOpacity
              onPress={async () => {
                const reviewQuestions = await getQuestionsForReview(10);
                // TODO: 导航到复习页面
                console.log('开始复习:', reviewQuestions);
              }}
              className="bg-blue-500 rounded-xl p-4 mb-4 shadow-sm"
            >
              <Text className="text-center text-white font-bold text-lg">
                开始智能复习 (推荐10题)
              </Text>
            </TouchableOpacity>

            <View className="bg-white rounded-xl p-4">
              <Text className="text-sm font-bold text-gray-900 mb-3">复习建议</Text>
              <View className="space-y-2">
                <View className="flex-row items-start">
                  <Text className="text-blue-500 mr-2">•</Text>
                  <Text className="text-sm text-gray-700 flex-1">
                    每天复习10-15道错题,效果最佳
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <Text className="text-blue-500 mr-2">•</Text>
                  <Text className="text-sm text-gray-700 flex-1">
                    重点关注掌握度低于50%的题目
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <Text className="text-blue-500 mr-2">•</Text>
                  <Text className="text-sm text-gray-700 flex-1">
                    同一类型错误连续答对3次即可标记为已掌握
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
