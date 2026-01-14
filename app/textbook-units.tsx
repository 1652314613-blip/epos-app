import { useState } from "react";
import { ScrollView, Text, View, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedListItem } from "@/components/animated-list-item";

export default function TextbookUnitsScreen() {
  const colors = useColors();
  const params = useLocalSearchParams();
  
  const grade = parseInt(params.grade as string);
  const book = params.book as string;
  const title = params.title as string;
  const unitCount = parseInt(params.unitCount as string);

  const units = Array.from({ length: unitCount }, (_, i) => i + 1);

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Back Button */}
          <AnimatedButton
            onPress={() => router.back()}
            variant="secondary"
            className="self-start px-4 py-2"
          >
            <Text className="text-primary font-semibold">← 返回</Text>
          </AnimatedButton>

          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">{title}</Text>
            <Text className="text-sm text-muted">选择单元学习词汇和语法</Text>
          </View>

          {/* Units List */}
          <View className="gap-3">
            {units.map((unit, index) => (
              <AnimatedListItem key={unit} index={index}>
                <AnimatedButton
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    router.push({
                      pathname: "/textbook-unit-learning" as any,
                      params: {
                        grade,
                        book,
                        unit,
                        bookTitle: title,
                      },
                    });
                  }}
                  variant="secondary"
                  className="bg-surface border border-border p-0"
                >
                  <View className="p-4 w-full flex-row items-center justify-between">
                    <Text className="text-xl font-bold text-foreground">Unit {unit}</Text>
                    <View className="bg-primary/20 px-3 py-1 rounded-full">
                      <Text className="text-xs font-semibold text-primary">开始学习</Text>
                    </View>
                  </View>
                </AnimatedButton>
              </AnimatedListItem>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
