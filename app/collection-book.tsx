import { useState, useCallback } from "react";
import { ScrollView, Text, View, TouchableOpacity, Platform, Alert, TextInput } from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { router, useFocusEffect } from "expo-router";
import {
  getCollectionBook,
  removeFromCollection,
  toggleCollectionFavorite,
  updateCollectionCategory,
  type CollectionItem,
} from "@/lib/storage";
import { COMMON_UPGRADES } from "@/services/enhancement-service";

export default function CollectionBookScreen() {
  const colors = useColors();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [filter, setFilter] = useState<"all" | "favorite" | "vocabulary" | "phrase">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Reload data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const data = await getCollectionBook();
    setCollection(data);
  };

  const handleDelete = (id: string) => {
    if (Platform.OS === "web") {
      if (confirm("确定要删除这个收藏吗？")) {
        performDelete(id);
      }
    } else {
      Alert.alert("删除收藏", "确定要删除这个收藏吗？", [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: () => performDelete(id),
        },
      ]);
    }
  };

  const performDelete = async (id: string) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await removeFromCollection(id);
    await loadData();
  };

  const handleToggleFavorite = async (id: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await toggleCollectionFavorite(id);
    await loadData();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "intermediate":
        return "#3B82F6"; // Blue
      case "advanced":
        return "#8B5CF6"; // Purple
      case "expert":
        return "#EC4899"; // Pink
      default:
        return colors.muted;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "intermediate":
        return "中级";
      case "advanced":
        return "高级";
      case "expert":
        return "专家";
      default:
        return "未知";
    }
  };

  const filteredItems = collection.filter((item) => {
    // Apply filter
    if (filter === "favorite" && !item.isFavorite) return false;
    if (filter === "vocabulary" && item.type !== "vocabulary") return false;
    if (filter === "phrase" && item.type !== "phrase") return false;

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        item.original.toLowerCase().includes(query) ||
        item.enhanced.toLowerCase().includes(query) ||
        item.explanation.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="p-6 gap-5">
          {/* Header */}
          <View className="pt-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-bold text-foreground">积累本</Text>
                <Text className="text-base text-muted mt-1">收藏好词好句，提升表达水平</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  router.back();
                }}
                className="px-4 py-2 rounded-full"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-sm font-medium text-foreground">返回</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border items-center">
              <Text className="text-2xl font-bold text-primary">{collection.length}</Text>
              <Text className="text-xs text-muted mt-1">总收藏</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border items-center">
              <Text className="text-2xl font-bold text-warning">
                {collection.filter((i) => i.isFavorite).length}
              </Text>
              <Text className="text-xs text-muted mt-1">重点标记</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border items-center">
              <Text className="text-2xl font-bold text-success">
                {collection.filter((i) => i.reviewCount > 0).length}
              </Text>
              <Text className="text-xs text-muted mt-1">已复习</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View
            className="flex-row items-center px-4 py-3 rounded-full border"
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          >
            <Text className="text-base mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-base"
              style={{ color: colors.foreground }}
              placeholder="搜索表达或解释..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {[
                { key: "all", label: "全部" },
                { key: "favorite", label: "重点标记" },
                { key: "vocabulary", label: "词汇" },
                { key: "phrase", label: "短语" },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setFilter(tab.key as any);
                  }}
                  style={{
                    backgroundColor: filter === tab.key ? colors.primary : colors.surface,
                    borderColor: filter === tab.key ? colors.primary : colors.border,
                    borderWidth: 1,
                  }}
                  className="px-4 py-2 rounded-full"
                >
                  <Text
                    style={{
                      color: filter === tab.key ? "#ffffff" : colors.foreground,
                    }}
                    className="font-semibold text-sm"
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Collection Items */}
          <View>
            {filteredItems.length === 0 ? (
              <View className="bg-surface rounded-2xl p-8 border border-border items-center">
                <Text className="text-base text-muted">
                  {searchQuery ? "没有找到匹配的内容" : "暂无收藏"}
                </Text>
                <Text className="text-sm text-muted mt-2">
                  {!searchQuery && "在语法检查结果中点击\"收藏\"按钮来添加好词好句"}
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {filteredItems.map((item, index) => (
                  <View key={item.id} className="bg-surface rounded-2xl p-5 border border-border">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center gap-2">
                        <View
                          className="px-3 py-1 rounded-full"
                          style={{ backgroundColor: `${getLevelColor(item.level)}20` }}
                        >
                          <Text
                            className="text-xs font-medium"
                            style={{ color: getLevelColor(item.level) }}
                          >
                            {getLevelLabel(item.level)}
                          </Text>
                        </View>
                        {item.examTag && (
                          <View
                            className="px-3 py-1 rounded-full"
                            style={{ backgroundColor: `${colors.warning}20` }}
                          >
                            <Text className="text-xs font-medium" style={{ color: colors.warning }}>
                              {item.examTag}
                            </Text>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity onPress={() => handleToggleFavorite(item.id)}>
                        <Text className="text-xl">{item.isFavorite ? "⭐" : "☆"}</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Original vs Enhanced */}
                    <View className="gap-2 mb-3">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-xs text-muted">原始：</Text>
                        <Text className="text-sm text-muted line-through">{item.original}</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-xs text-success">高级：</Text>
                        <Text className="text-sm font-semibold text-success">{item.enhanced}</Text>
                      </View>
                    </View>

                    {/* Explanation */}
                    <Text className="text-sm text-foreground leading-relaxed mb-2">
                      {item.explanation}
                    </Text>

                    {/* Example */}
                    <View
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${colors.primary}10` }}
                    >
                      <Text className="text-xs text-muted mb-1">例句：</Text>
                      <Text className="text-sm text-foreground italic">{item.example}</Text>
                    </View>

                    {/* Actions */}
                    <View className="flex-row gap-2 mt-3">
                      <TouchableOpacity
                        onPress={() => handleDelete(item.id)}
                        className="px-4 py-2 rounded-full"
                        style={{ backgroundColor: `${colors.error}20` }}
                      >
                        <Text className="font-medium text-sm" style={{ color: colors.error }}>
                          删除
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
