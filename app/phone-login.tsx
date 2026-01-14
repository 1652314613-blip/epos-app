import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/lib/auth-context";
import * as AppleAuthentication from 'expo-apple-authentication';
import { signInWithApple, isAppleAuthAvailable } from '@/lib/apple-auth-service';

/**
 * 手机号验证码登录页面
 */
export default function PhoneLoginScreen() {
  const colors = useColors();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);

  // Check if Apple Authentication is available
  useEffect(() => {
    checkAppleAuth();
  }, []);

  const checkAppleAuth = async () => {
    const available = await isAppleAuthAvailable();
    setAppleAuthAvailable(available);
  };

  // 发送验证码
  const sendCodeMutation = trpc.sms.sendCode.useMutation();
  // 验证并登录
  const verifyMutation = trpc.sms.verifyAndLogin.useMutation();

  /**
   * 验证手机号格式
   */
  const isValidPhone = (phone: string): boolean => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  /**
   * 发送验证码
   */
  const handleSendCode = async () => {
    if (!isValidPhone(phoneNumber)) {
      if (Platform.OS === "web") {
        alert("请输入正确的手机号");
      } else {
        Alert.alert("提示", "请输入正确的手机号");
      }
      return;
    }

    setLoading(true);
    try {
      const result = await sendCodeMutation.mutateAsync({
        phoneNumber,
        type: "login",
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // 开发模式下显示验证码
      if (result.code) {
        if (Platform.OS === "web") {
          alert(`验证码已发送！开发模式下验证码为：${result.code}`);
        } else {
          Alert.alert("验证码已发送", `开发模式下验证码为：${result.code}`);
        }
      } else {
        if (Platform.OS === "web") {
          alert("验证码已发送，请查收短信");
        } else {
          Alert.alert("提示", "验证码已发送，请查收短信");
        }
      }

      // 切换到验证码输入步骤
      setStep("code");

      // 开始倒计时（60秒）
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      if (Platform.OS === "web") {
        alert(error.message || "发送验证码失败");
      } else {
        Alert.alert("错误", error.message || "发送验证码失败");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 验证验证码并登录
   */
  const handleVerifyAndLogin = async () => {
    if (code.length !== 6) {
      if (Platform.OS === "web") {
        alert("请输入6位验证码");
      } else {
        Alert.alert("提示", "请输入6位验证码");
      }
      return;
    }

    setLoading(true);
    try {
      const result = await verifyMutation.mutateAsync({
        phoneNumber,
        code,
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // 保存用户信息到AuthContext
      await login(result.user);

      if (Platform.OS === "web") {
        alert("登录成功！");
      } else {
        Alert.alert("成功", "登录成功！");
      }

      // 返回上一页或跳转到首页
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      if (Platform.OS === "web") {
        alert(error.message || "登录失败");
      } else {
        Alert.alert("错误", error.message || "登录失败");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 返回上一步
   */
  const handleBack = () => {
    if (step === "code") {
      setStep("phone");
      setCode("");
    } else {
      router.back();
    }
  };

  /**
   * Apple登录
   */
  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const appleResult = await signInWithApple();
      
      // Send Apple credentials to backend for verification
      // TODO: Implement backend Apple auth verification
      // For now, just log the user in with Apple ID
      // TODO: Send Apple credentials to backend for verification
      // For now, create a temporary user object
      const tempUser = {
        id: appleResult.user,
        email: appleResult.email || `${appleResult.user}@apple.privaterelay.com`,
        name: appleResult.fullName?.givenName || 'Apple User',
      };
      await login(tempUser);

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // 登录成功，跳转
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error('Apple Sign In error:', error);
      if (Platform.OS === "web") {
        alert(error.message || "Apple登录失败");
      } else {
        Alert.alert("错误", error.message || "Apple登录失败");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1">
        {/* 标题 */}
        <View className="items-center mb-12 mt-8">
          <Text className="text-3xl font-bold text-foreground mb-2">
            {step === "phone" ? "手机号登录" : "输入验证码"}
          </Text>
          <Text className="text-base text-muted text-center">
            {step === "phone"
              ? "请输入您的手机号"
              : `验证码已发送至 ${phoneNumber}`}
          </Text>
        </View>

        {/* 输入区域 */}
        {step === "phone" ? (
          <View className="mb-6">
            <TextInput
              className="bg-surface border border-border rounded-2xl px-6 py-4 text-lg text-foreground"
              placeholder="请输入手机号"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              maxLength={11}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!loading}
            />
          </View>
        ) : (
          <View className="mb-6">
            <TextInput
              className="bg-surface border border-border rounded-2xl px-6 py-4 text-lg text-foreground text-center tracking-widest"
              placeholder="请输入6位验证码"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
              editable={!loading}
              autoFocus
            />

            {/* 重新发送按钮 */}
            <TouchableOpacity
              onPress={handleSendCode}
              disabled={countdown > 0 || loading}
              className="mt-4 items-center"
            >
              <Text
                className={`text-base ${
                  countdown > 0 ? "text-muted" : "text-primary font-semibold"
                }`}
              >
                {countdown > 0 ? `${countdown}秒后重新发送` : "重新发送验证码"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 按钮 */}
        <View className="gap-4">
          <Pressable
            onPress={step === "phone" ? handleSendCode : handleVerifyAndLogin}
            disabled={loading}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                borderRadius: 9999,
                paddingVertical: 16,
                alignItems: "center",
              },
              pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text className="text-background text-lg font-semibold">
                {step === "phone" ? "获取验证码" : "登录"}
              </Text>
            )}
          </Pressable>

          <TouchableOpacity
            onPress={handleBack}
            disabled={loading}
            className="py-4 items-center"
          >
            <Text className="text-muted text-base">
              {step === "phone" ? "返回" : "使用其他手机号"}
            </Text>
          </TouchableOpacity>

          {/* Apple登录按钮 - 仅在iOS上显示 */}
          {appleAuthAvailable && step === "phone" && (
            <>
              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-border" />
                <Text className="mx-4 text-muted text-sm">或</Text>
                <View className="flex-1 h-px bg-border" />
              </View>

              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={9999}
                style={{
                  width: '100%',
                  height: 50,
                }}
                onPress={handleAppleSignIn}
              />
            </>
          )}
        </View>

        {/* 提示信息 */}
        <View className="mt-auto mb-8">
          <Text className="text-sm text-muted text-center">
            登录即表示您同意我们的服务条款和隐私政策
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
