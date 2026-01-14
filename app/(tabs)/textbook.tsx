import { useState, useEffect } from "react";
import { ScrollView, Text, View, Alert, Platform } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedListItem } from "@/components/animated-list-item";
import { getTextbookBooks, getBooksByGrade, type TEXTBOOK_BOOKS } from "@/lib/textbook-vocabulary";

export default function TextbookScreen() {
  const colors = useColors();
  const [selectedGrade, setSelectedGrade] = useState<number>(7);
  const [books, setBooks] = useState<typeof TEXTBOOK_BOOKS>([]);

  useEffect(() => {
    loadBooks();
  }, [selectedGrade]);

  const loadBooks = async () => {
    const gradeBooks = await getBooksByGrade(selectedGrade);
    setBooks(gradeBooks);
  };

  const grades = [7, 8, 9, 10, 11, 12];

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">教材学习</Text>
            <Text className="text-sm text-muted">人教版初高中英语教材同步学习（词汇+语法）</Text>
          </View>

          {/* Grade Selector */}
          <View className="gap-3">
            <Text className="text-base font-semibold text-foreground">选择年级</Text>
            <View className="flex-row flex-wrap gap-2">
              {grades.map((grade) => (
                <AnimatedButton
                  key={grade}
                  onPress={() => setSelectedGrade(grade)}
                  variant={selectedGrade === grade ? "primary" : "secondary"}
                  className="px-4 py-2"
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selectedGrade === grade ? "text-background" : "text-primary"
                    }`}
                  >
                    {grade <= 9 ? `初${grade - 6}` : `高${grade - 9}`}
                  </Text>
                </AnimatedButton>
              ))}
            </View>
          </View>

          {/* Books List */}
          <View className="gap-3">
            <Text className="text-base font-semibold text-foreground">教材列表</Text>
            {books.length === 0 ? (
              <View className="bg-surface rounded-2xl p-6 items-center gap-2">
                <Text className="text-4xl">📚</Text>
                <Text className="text-base font-semibold text-foreground">暂无教材</Text>
                <Text className="text-sm text-muted">该年级暂无可用教材</Text>
              </View>
            ) : (
              books.map((book, index) => (
                <AnimatedListItem key={`${book.grade}_${book.book}`} index={index}>
                  <AnimatedButton
                    onPress={() => {
                      router.push({
                        pathname: "/textbook-units" as any,
                        params: {
                          grade: book.grade,
                          book: book.book,
                          title: book.title,
                          unitCount: book.unitCount,
                        },
                      });
                    }}
                    variant="secondary"
                    className="bg-surface border border-border p-0"
                  >
                    <View className="p-4 w-full">
                      <View className="flex-row items-center justify-between">
                        <View className="gap-1">
                          <Text className="text-lg font-bold text-foreground">{book.title}</Text>
                          <Text className="text-sm text-muted">共 {book.unitCount} 个单元</Text>
                        </View>
                        <View className="bg-primary/20 px-3 py-1 rounded-full">
                          <Text className="text-xs font-semibold text-primary">
                            {book.grade <= 9 ? `初${book.grade - 6}` : `高${book.grade - 9}`}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </AnimatedButton>
                </AnimatedListItem>
              ))
            )}
          </View>

          {/* Info Card */}
          <View className="bg-primary/10 rounded-2xl p-4 border border-primary/30 gap-2">
            <Text className="text-base font-semibold text-foreground">💡 使用提示</Text>
            <Text className="text-sm text-foreground">
              • 选择对应年级和教材{"\n"}
              • 点击单元学习词汇和语法{"\n"}
              • 词汇可以批量添加到单词本{"\n"}
              • 语法点配有详细讲解和例句{"\n"}
              • 与学校教学进度同步
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
