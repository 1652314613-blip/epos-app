/**
 * Welcome Screen - Minimal Black & White Style
 * 
 * 设计特点:
 * - 纯黑背景
 * - 极简白色文字和线条
 * - 去除所有渐变和阴影
 * - Linear/Raycast/Vercel风格
 */

import { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";

export default function WelcomeScreen() {
  // 动画值
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 简单的淡入动画
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/login");
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/(tabs)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          paddingHorizontal: 32,
          paddingTop: 120,
          paddingBottom: 60,
        }}
      >
        {/* Logo和标题 */}
        <View style={{ alignItems: "center", marginBottom: 80 }}>
          {/* Logo图标 - 极简黑白 */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 24,
              backgroundColor: "#000000",
              borderWidth: 1,
              borderColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <Image 
              source={require("@/assets/images/epos-logo-minimal.png")} 
              style={{ width: 80, height: 80 }} 
            />
          </View>

          {/* 应用名称 - 大写加粗 */}
          <Text
            style={{
              fontSize: 48,
              fontWeight: "700",
              color: "#FFFFFF",
              marginBottom: 12,
              textAlign: "center",
              letterSpacing: 2,
            }}
          >
            EPOS
          </Text>

          {/* 副标题 - 小写加细 */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "300",
              color: "#FFFFFF",
              textAlign: "center",
              letterSpacing: 1,
              opacity: 0.6,
            }}
          >
            logic of language
          </Text>
        </View>

        {/* 特性列表 - 极简风格 */}
        <View style={{ marginBottom: 80 }}>
          <FeatureItem
            title="AI智能检查"
            description="实时语法分析,温柔友好的解释"
          />
          <FeatureItem
            title="系统化学习"
            description="25个语法点 + 50+练习题"
          />
          <FeatureItem
            title="科学记忆"
            description="间隔重复算法,高效掌握单词"
          />
        </View>

        {/* 按钮组 - 极简风格 */}
        <View style={{ gap: 16 }}>
          {/* 开始使用按钮 - 白色填充 */}
          <Pressable
            onPress={handleGetStarted}
            style={({ pressed }) => ({
              backgroundColor: "#FFFFFF",
              borderRadius: 0,
              paddingVertical: 18,
              paddingHorizontal: 32,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#000000",
                letterSpacing: 0.5,
              }}
            >
              开始使用
            </Text>
          </Pressable>

          {/* 跳过按钮 - 极细边框 */}
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => ({
              borderWidth: 0.5,
              borderColor: "#FFFFFF",
              borderRadius: 0,
              paddingVertical: 18,
              paddingHorizontal: 32,
              alignItems: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "300",
                color: "#FFFFFF",
                letterSpacing: 0.5,
              }}
            >
              跳过
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

// 特性项组件 - 极简风格
function FeatureItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View
      style={{
        borderWidth: 0.5,
        borderColor: "#FFFFFF",
        borderRadius: 0,
        padding: 20,
        marginBottom: 12,
        backgroundColor: "transparent",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          color: "#FFFFFF",
          marginBottom: 6,
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "300",
          color: "#FFFFFF",
          lineHeight: 20,
          opacity: 0.6,
          letterSpacing: 0.3,
        }}
      >
        {description}
      </Text>
    </View>
  );
}
