import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import { useColors } from "@/hooks/use-colors";
import type { GrammarError } from "@/lib/grammar-checker";
import { getErrorTypeInfo, getExamRelevance } from "@/lib/error-type-colors";

interface KnowledgeCardProps {
  visible: boolean;
  error: GrammarError | null;
  onClose: () => void;
}

/**
 * Knowledge Card Component
 * 
 * Displays detailed explanation of grammar errors with:
 * - Error type and icon
 * - Explanation
 * - Textbook chapter reference
 * - Exam relevance tag
 */
export function KnowledgeCard({ visible, error, onClose }: KnowledgeCardProps) {
  const colors = useColors();

  if (!error) return null;

  const errorInfo = getErrorTypeInfo(error.type);
  const examTag = getExamRelevance(error.type);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center p-6"
        onPress={onClose}
      >
        <Pressable
          className="bg-background rounded-3xl p-6 w-full max-w-md shadow-lg"
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-4">
              {/* Header with icon and type */}
              <View className="flex-row items-center gap-3">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: errorInfo.color + "20" }}
                >
                  <Text className="text-2xl">{errorInfo.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-foreground">{errorInfo.label}</Text>
                  {examTag && (
                    <View
                      className="self-start px-2 py-1 rounded-full mt-1"
                      style={{ backgroundColor: "#F59E0B20" }}
                    >
                      <Text className="text-xs font-semibold" style={{ color: "#F59E0B" }}>
                        🎯 {examTag}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Error details */}
              <View className="bg-surface rounded-2xl p-4 gap-3">
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm text-muted">错误：</Text>
                  <Text className="text-sm text-error line-through flex-1">{error.incorrect}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm text-muted">改为：</Text>
                  <Text className="text-sm text-success font-semibold flex-1">{error.correct}</Text>
                </View>
              </View>

              {/* Explanation */}
              <View className="bg-surface rounded-2xl p-4">
                <Text className="text-sm font-semibold text-foreground mb-2">💡 为什么错了？</Text>
                <Text className="text-sm text-foreground leading-relaxed">{error.explanation}</Text>
              </View>

              {/* Textbook reference */}
              {errorInfo.textbookChapter && (
                <View
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: errorInfo.color + "10" }}
                >
                  <Text className="text-sm font-semibold text-foreground mb-1">
                    📚 相关教材章节
                  </Text>
                  <Text className="text-sm text-foreground">{errorInfo.textbookChapter}</Text>
                </View>
              )}

              {/* PEP reference if available */}
              {error.pepReference && (
                <View className="bg-surface rounded-2xl p-4">
                  <Text className="text-xs text-muted">
                    📖 人教版参考：{error.pepReference}
                  </Text>
                </View>
              )}

              {/* Close button */}
              <Pressable
                className="bg-primary rounded-full py-3 items-center active:opacity-80"
                onPress={onClose}
              >
                <Text className="text-background font-semibold">知道了</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
