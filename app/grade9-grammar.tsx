import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { grade9GrammarPoints, grade9GrammarByUnit } from '../lib/grade9-grammar-data';

export default function Grade9GrammarScreen() {
  const router = useRouter();
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);

  const units = Object.keys(grade9GrammarByUnit).map(Number).sort((a, b) => a - b);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '从句': 'bg-blue-500',
      '语态': 'bg-purple-500',
      '时态': 'bg-green-500',
      '情态动词': 'bg-orange-500',
      '非谓语动词': 'bg-pink-500',
      '固定搭配': 'bg-yellow-500',
      '动词': 'bg-red-500',
      '句型': 'bg-indigo-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const filteredPoints = selectedUnit 
    ? grade9GrammarByUnit[selectedUnit] 
    : grade9GrammarPoints;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">九年级语法</Text>
        <Text className="text-sm text-gray-600 mt-1">
          {grade9GrammarPoints.length}个核心语法点
        </Text>
      </View>

      {/* Unit Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="bg-white border-b border-gray-200"
      >
        <View className="flex-row px-4 py-3 gap-2">
          <TouchableOpacity
            onPress={() => setSelectedUnit(null)}
            className={`px-4 py-2 rounded-full ${
              selectedUnit === null ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <Text className={`text-sm font-medium ${
              selectedUnit === null ? 'text-white' : 'text-gray-700'
            }`}>
              全部
            </Text>
          </TouchableOpacity>
          {units.map(unit => (
            <TouchableOpacity
              key={unit}
              onPress={() => setSelectedUnit(unit)}
              className={`px-4 py-2 rounded-full ${
                selectedUnit === unit ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <Text className={`text-sm font-medium ${
                selectedUnit === unit ? 'text-white' : 'text-gray-700'
              }`}>
                Unit {unit}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Grammar Points List */}
      <ScrollView className="flex-1 px-4 py-4">
        {filteredPoints.map((point) => (
          <TouchableOpacity
            key={point.id}
            onPress={() => router.push({
              pathname: '/grammar-point-detail',
              params: { id: point.id, grade: '9' }
            })}
            className="bg-white rounded-xl p-4 mb-3 shadow-sm border-l-4"
            style={{ borderLeftColor: getCategoryColor(point.category) }}
          >
            {/* Title */}
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {point.titleCn}
                </Text>
                <Text className="text-sm text-gray-600">
                  {point.title}
                </Text>
              </View>
              <View className="ml-2">
                <Text className="text-xs text-gray-500">
                  Unit {point.unit}
                </Text>
              </View>
            </View>

            {/* Tags */}
            <View className="flex-row flex-wrap gap-2 mb-2">
              <View className={`px-2 py-1 rounded ${getCategoryColor(point.category)}`}>
                <Text className="text-xs text-white font-medium">
                  {point.category}
                </Text>
              </View>
              {point.examTags?.map(tag => (
                <View 
                  key={tag}
                  className={`px-2 py-1 rounded ${
                    tag === '高考考点' ? 'bg-red-100' : 'bg-orange-100'
                  }`}
                >
                  <Text className={`text-xs font-medium ${
                    tag === '高考考点' ? 'text-red-700' : 'text-orange-700'
                  }`}>
                    {tag}
                  </Text>
                </View>
              ))}
              <View className={`px-2 py-1 rounded ${
                point.difficulty === 'advanced' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  point.difficulty === 'advanced' ? 'text-purple-700' : 'text-blue-700'
                }`}>
                  {point.difficulty === 'advanced' ? '高级' : '中级'}
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text className="text-sm text-gray-700 leading-5" numberOfLines={2}>
              {point.description}
            </Text>

            {/* Example */}
            {point.examples.length > 0 && (
              <View className="mt-3 bg-gray-50 rounded-lg p-3">
                <Text className="text-sm text-gray-800 mb-1">
                  {point.examples[0].en}
                </Text>
                <Text className="text-xs text-gray-600">
                  {point.examples[0].cn}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
