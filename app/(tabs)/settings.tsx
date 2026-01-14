import { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Switch, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { GradeLevel } from "@/lib/grammar-data";

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(9);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const grades: GradeLevel[] = [7, 8, 9, 10, 11, 12];

  const handleGradeSelect = (grade: GradeLevel) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedGrade(grade);
  };

  const toggleNotifications = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="p-6 gap-5">
          {/* Header */}
          <View className="pt-4">
            <Text className="text-3xl font-bold text-foreground">设置</Text>
            <Text className="text-base text-muted mt-1">自定义你的学习体验</Text>
          </View>

          {/* Learning Section */}
          <View>
            <Text className="text-sm font-semibold text-muted mb-3">学习</Text>

            {/* Grade Level */}
            <View className="bg-surface rounded-2xl p-5 border border-border">
              <Text className="text-base font-semibold text-foreground mb-3">
                当前年级
              </Text>
              <Text className="text-sm text-muted mb-4">
                选择你的年级以查看相关语法主题
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {grades.map((grade) => (
                  <TouchableOpacity
                    key={grade}
                    onPress={() => handleGradeSelect(grade)}
                    style={{
                      backgroundColor:
                        selectedGrade === grade ? colors.primary : colors.background,
                      borderColor: selectedGrade === grade ? colors.primary : colors.border,
                      borderWidth: 1,
                    }}
                    className="px-4 py-2 rounded-full"
                  >
                    <Text
                      style={{
                        color: selectedGrade === grade ? "#ffffff" : colors.foreground,
                      }}
                      className="font-medium"
                    >
                      {grade} 年级
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Preferences Section */}
          <View>
            <Text className="text-sm font-semibold text-muted mb-3">偏好设置</Text>

            {/* Notifications */}
            <View className="bg-surface rounded-2xl border border-border overflow-hidden">
              <View className="flex-row items-center justify-between p-5">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    每日提醒
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    每天提醒你练习
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              <View
                className="h-px"
                style={{ backgroundColor: colors.border }}
              />

              {/* Theme (Display only - controlled by system) */}
              <View className="flex-row items-center justify-between p-5">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">主题</Text>
                  <Text className="text-sm text-muted mt-1">
                    当前: {colorScheme === "dark" ? "深色" : "浅色"}
                  </Text>
                </View>
                <Text className="text-sm text-muted">系统</Text>
              </View>
            </View>
          </View>

          {/* About Section */}
          <View>
            <Text className="text-sm font-semibold text-muted mb-3">关于</Text>

            <View className="bg-surface rounded-2xl border border-border">
              <TouchableOpacity
                className="flex-row items-center justify-between p-5"
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
              >
                <Text className="text-base text-foreground">应用版本</Text>
                <Text className="text-sm text-muted">1.0.0</Text>
              </TouchableOpacity>

              <View
                className="h-px"
                style={{ backgroundColor: colors.border }}
              />

              <TouchableOpacity
                className="flex-row items-center justify-between p-5"
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
              >
                <Text className="text-base text-foreground">关于人教版教材</Text>
                <Text className="text-sm text-muted">›</Text>
              </TouchableOpacity>

              <View
                className="h-px"
                style={{ backgroundColor: colors.border }}
              />

              <TouchableOpacity
                className="flex-row items-center justify-between p-5"
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  router.push("/privacy" as any);
                }}
              >
                <Text className="text-base text-foreground">隐私政策</Text>
                <Text className="text-sm text-muted">›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Card */}
          <View className="bg-primary/10 rounded-2xl p-5 border border-primary/30">
            <Text className="text-sm text-foreground leading-relaxed">
              这个应用帮助中国学生基于人教版（7-12年级）教材提高英语语法水平。
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
