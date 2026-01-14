/**
 * Login Screen - Minimalist Black & White Style
 * 
 * 设计特点:
 * - 黑白极简风格，与首页保持一致
 * - 简洁的排版和布局
 * - 流畅的动画效果
 * - 支持多种登录方式
 */

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
  const colors = useColors();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 动画值
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    // 模拟登录
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(tabs)");
    }, 1500);
  };

  const handleGuestLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/(tabs)");
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <ScreenContainer className="bg-background" edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 返回按钮 */}
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: colors.muted + "20",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 40,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Text style={{ fontSize: 20, color: colors.foreground }}>←</Text>
          </Pressable>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* 标题部分 */}
            <View style={{ marginBottom: 48 }}>
              {/* Logo */}
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "300",
                  letterSpacing: 3,
                  color: colors.foreground,
                  marginBottom: 16,
                }}
              >
                EPOS
              </Text>
              
              {/* 欢迎文本 */}
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "600",
                  color: colors.foreground,
                  marginBottom: 12,
                  lineHeight: 36,
                }}
              >
                欢迎回来
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: colors.muted,
                  lineHeight: 22,
                }}
              >
                登录以继续学习英语语法
              </Text>
            </View>

            {/* 登录表单 */}
            <View style={{ marginBottom: 32, gap: 16 }}>
              {/* 邮箱输入 */}
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "500",
                    color: colors.foreground,
                    marginBottom: 8,
                    letterSpacing: 0.5,
                  }}
                >
                  邮箱地址
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.muted + "80"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                  style={{
                    backgroundColor: colors.muted + "10",
                    borderWidth: 1,
                    borderColor: colors.muted + "30",
                    borderRadius: 10,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 15,
                    color: colors.foreground,
                    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
                  }}
                />
              </View>

              {/* 密码输入 */}
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "500",
                    color: colors.foreground,
                    marginBottom: 8,
                    letterSpacing: 0.5,
                  }}
                >
                  密码
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.muted + "80"}
                  secureTextEntry
                  editable={!isLoading}
                  style={{
                    backgroundColor: colors.muted + "10",
                    borderWidth: 1,
                    borderColor: colors.muted + "30",
                    borderRadius: 10,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 15,
                    color: colors.foreground,
                    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
                  }}
                />
              </View>

              {/* 忘记密码 */}
              <Pressable
                style={({ pressed }) => ({
                  alignSelf: "flex-end",
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.muted,
                    fontWeight: "500",
                  }}
                >
                  忘记密码?
                </Text>
              </Pressable>
            </View>

            {/* 登录按钮 */}
            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => ({
                backgroundColor: colors.foreground,
                borderRadius: 10,
                paddingVertical: 16,
                alignItems: "center",
                marginBottom: 24,
                opacity: pressed || isLoading ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: colors.background,
                  letterSpacing: 0.5,
                }}
              >
                {isLoading ? "登录中..." : "登录"}
              </Text>
            </Pressable>

            {/* 分隔线 */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 24,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: colors.muted + "30",
                }}
              />
              <Text
                style={{
                  marginHorizontal: 16,
                  fontSize: 13,
                  color: colors.muted,
                }}
              >
                或
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: colors.muted + "30",
                }}
              />
            </View>

            {/* 第三方登录 */}
            <View style={{ gap: 12, marginBottom: 24 }}>
              <SocialLoginButton
                icon="🍎"
                text="使用 Apple 登录"
                colors={colors}
                onPress={() => {}}
              />
              <SocialLoginButton
                icon="🔵"
                text="使用 Google 登录"
                colors={colors}
                onPress={() => {}}
              />
            </View>

            {/* 游客登录 */}
            <Pressable
              onPress={handleGuestLogin}
              style={({ pressed }) => ({
                paddingVertical: 12,
                alignItems: "center",
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: colors.muted,
                  fontWeight: "500",
                }}
              >
                以游客身份继续
              </Text>
            </Pressable>

            {/* 注册提示 */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 32,
                gap: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: colors.muted,
                }}
              >
                还没有账号?
              </Text>
              <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.foreground,
                  }}
                >
                  立即注册
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

// 第三方登录按钮组件
function SocialLoginButton({
  icon,
  text,
  colors,
  onPress,
}: {
  icon: string;
  text: string;
  colors: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.muted + "15",
        borderWidth: 1,
        borderColor: colors.muted + "30",
        borderRadius: 10,
        paddingVertical: 14,
        opacity: pressed ? 0.6 : 1,
        gap: 12,
      })}
    >
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "500",
          color: colors.foreground,
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
}
