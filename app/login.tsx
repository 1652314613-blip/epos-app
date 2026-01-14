/**
 * Login Screen - Manus Style
 * 
 * 设计特点:
 * - 简洁的登录界面
 * - 渐变背景
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
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/use-colors";
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
    <LinearGradient
      colors={["#667eea", "#764ba2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 32,
            paddingTop: 60,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* 返回按钮 */}
          <Pressable
            onPress={handleBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 40,
            }}
          >
            <Text style={{ fontSize: 20, color: "#ffffff" }}>←</Text>
          </Pressable>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* 标题 */}
            <View style={{ marginBottom: 48 }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#ffffff",
                  marginBottom: 8,
                }}
              >
                欢迎回来
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                登录以继续学习
              </Text>
            </View>

            {/* 登录表单 */}
            <View style={{ marginBottom: 32 }}>
              {/* 邮箱输入 */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  邮箱
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 16,
                    color: "#ffffff",
                  }}
                />
              </View>

              {/* 密码输入 */}
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#ffffff",
                    marginBottom: 8,
                  }}
                >
                  密码
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  secureTextEntry
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 16,
                    color: "#ffffff",
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
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.9)",
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
                backgroundColor: "#ffffff",
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: "center",
                marginBottom: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
                opacity: pressed || isLoading ? 0.8 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#667eea",
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
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
              />
              <Text
                style={{
                  marginHorizontal: 16,
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                或
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
              />
            </View>

            {/* 第三方登录 */}
            <View style={{ gap: 12, marginBottom: 24 }}>
              <SocialLoginButton
                icon="🍎"
                text="使用 Apple 登录"
                onPress={() => {}}
              />
              <SocialLoginButton
                icon="🔵"
                text="使用 Google 登录"
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
                  color: "rgba(255, 255, 255, 0.9)",
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
                marginTop: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                还没有账号?{" "}
              </Text>
              <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  立即注册
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// 第三方登录按钮组件
function SocialLoginButton({
  icon,
  text,
  onPress,
}: {
  icon: string;
  text: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 12,
        paddingVertical: 14,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ fontSize: 20, marginRight: 12 }}>{icon}</Text>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "500",
          color: "#ffffff",
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
}
