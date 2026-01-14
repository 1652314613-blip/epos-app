import { useState, useEffect } from "react";
import { ScrollView, Text, View, TextInput, ActivityIndicator, Alert, Platform } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedListItem } from "@/components/animated-list-item";
import { trpc } from "@/lib/trpc";
import { getAllWords, deleteWord, getVocabularyStats, type Word, type VocabularyStats } from "@/lib/vocabulary-storage";

export default function VocabularyScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [stats, setStats] = useState<VocabularyStats | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "new" | "learning" | "familiar" | "mastered">("all");

  const lookupMutation = trpc.dictionary.lookup.useMutation();

  useEffect(() => {
    loadWords();
    loadStats();
  }, []);

  const loadWords = async () => {
    const allWords = await getAllWords();
    setWords(allWords);
  };

  const loadStats = async () => {
    const vocabStats = await getVocabularyStats();
    setStats(vocabStats);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await lookupMutation.mutateAsync({ word: searchQuery.trim() });
      
      // 导航到查词结果页面
      router.push({
        pathname: "/word-detail" as any,
        params: {
          wordData: JSON.stringify(result),
        },
      });
      
      setSearchQuery("");
    } catch (error) {
      Alert.alert("查词失败", "请检查网络连接后重试");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeleteWord = async (wordId: string) => {
    Alert.alert(
      "删除单词",
      "确定要从单词本中删除这个单词吗？",
      [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: async () => {
            await deleteWord(wordId);
            await loadWords();
            await loadStats();
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
        },
      ]
    );
  };

  const filteredWords = words.filter((word) => {
    if (selectedFilter !== "all" && word.masteryLevel !== selectedFilter) {
      return false;
    }
    return true;
  });

  const getMasteryColor = (level: string) => {
    switch (level) {
      case "new":
        return colors.muted;
      case "learning":
        return colors.warning;
      case "familiar":
        return colors.primary;
      case "mastered":
        return colors.success;
      default:
        return colors.muted;
    }
  };

  const getMasteryLabel = (level: string) => {
    switch (level) {
      case "new":
        return "新词";
      case "learning":
        return "学习中";
      case "familiar":
        return "熟悉";
      case "mastered":
        return "已掌握";
      default:
        return "未知";
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">单词本</Text>
            <Text className="text-sm text-muted">查词、背单词、掌握词汇</Text>
          </View>

          {/* Search Box */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
            <Text className="text-sm font-semibold text-foreground">🔍 查词</Text>
            <View className="flex-row gap-2">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="输入要查询的单词..."
                placeholderTextColor={colors.muted}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                className="flex-1 bg-background rounded-xl px-4 py-3 text-base text-foreground"
              />
              <AnimatedButton
                onPress={handleSearch}
                disabled={!searchQuery.trim() || isSearching}
                variant="primary"
                className="px-6 py-3"
              >
                {isSearching ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-background font-semibold">查询</Text>
                )}
              </AnimatedButton>
            </View>
          </View>

          {/* Stats */}
          {stats && (
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm font-semibold text-foreground mb-3">📊 学习统计</Text>
              <View className="flex-row flex-wrap gap-4">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-primary">{stats.totalWords}</Text>
                  <Text className="text-xs text-muted mt-1">总单词</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold" style={{ color: colors.warning }}>
                    {stats.learningWords}
                  </Text>
                  <Text className="text-xs text-muted mt-1">学习中</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-success">{stats.masteredWords}</Text>
                  <Text className="text-xs text-muted mt-1">已掌握</Text>
                </View>
                <View className="items-center">
                  <Text className="text-2xl font-bold text-foreground">{stats.todayLearned}</Text>
                  <Text className="text-xs text-muted mt-1">今日新增</Text>
                </View>
              </View>
            </View>
          )}

          {/* Start Learning Button */}
          {words.length > 0 && (
            <AnimatedButton
              onPress={() => {
                router.push("/vocabulary-learn" as any);
              }}
              variant="primary"
              className="py-4"
            >
              <Text className="text-background font-bold text-lg">🎯 开始学习</Text>
            </AnimatedButton>
          )}

          {/* Filter Tabs */}
          {words.length > 0 && (
            <View className="flex-row gap-2">
              {["all", "new", "learning", "familiar", "mastered"].map((filter) => (
                <AnimatedButton
                  key={filter}
                  onPress={() => setSelectedFilter(filter as any)}
                  variant={selectedFilter === filter ? "primary" : "secondary"}
                  className="px-4 py-2"
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedFilter === filter ? "text-background" : "text-primary"
                    }`}
                  >
                    {filter === "all" ? "全部" : getMasteryLabel(filter)}
                  </Text>
                </AnimatedButton>
              ))}
            </View>
          )}

          {/* Words List */}
          <View className="gap-3">
            {filteredWords.length === 0 ? (
              <View className="bg-surface rounded-2xl p-6 items-center gap-2">
                <Text className="text-4xl">📚</Text>
                <Text className="text-base font-semibold text-foreground">单词本是空的</Text>
                <Text className="text-sm text-muted text-center">
                  {words.length === 0 ? "在上方查词后添加到单词本吧！" : "没有符合条件的单词"}
                </Text>
              </View>
            ) : (
              filteredWords.map((word, index) => (
                <AnimatedListItem key={word.id} index={index}>
                  <AnimatedButton
                    onPress={() => {
                      router.push({
                        pathname: "/word-detail" as any,
                        params: {
                          wordData: JSON.stringify({
                            word: word.word,
                            phonetic: word.phonetic,
                            definitions: word.definitions,
                            examples: word.examples,
                          }),
                          wordId: word.id,
                        },
                      });
                    }}
                    variant="secondary"
                    className="bg-surface border border-border p-0"
                  >
                    <View className="p-4 w-full">
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-2">
                          <Text className="text-lg font-bold text-foreground">{word.word}</Text>
                          <Text className="text-sm text-muted">{word.phonetic}</Text>
                        </View>
                        <View
                          className="px-3 py-1 rounded-full"
                          style={{ backgroundColor: getMasteryColor(word.masteryLevel) + "20" }}
                        >
                          <Text className="text-xs font-semibold" style={{ color: getMasteryColor(word.masteryLevel) }}>
                            {getMasteryLabel(word.masteryLevel)}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-sm text-muted" numberOfLines={2}>
                        {word.definitions[0]?.meaning || ""}
                      </Text>
                      {word.reviewCount > 0 && (
                        <Text className="text-xs text-muted mt-2">
                          已复习 {word.reviewCount} 次 · 下次复习：
                          {new Date(word.nextReviewAt).toLocaleDateString("zh-CN")}
                        </Text>
                      )}
                    </View>
                  </AnimatedButton>
                </AnimatedListItem>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
