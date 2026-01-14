/**
 * PWA安装引导组件
 * 为iOS Safari用户显示"添加到主屏幕"引导
 */

import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Animated, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PWA_PROMPT_DISMISSED_KEY = "@pwa_prompt_dismissed";

interface PWAInstallPromptProps {
  onDismiss?: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    checkShouldShow();
  }, []);

  const checkShouldShow = async () => {
    // 只在Web平台显示
    if (Platform.OS !== "web") {
      return;
    }

    // 检查是否已经是PWA模式
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) {
      return;
    }

    // 检查是否已经关闭过
    try {
      const dismissed = await AsyncStorage.getItem(PWA_PROMPT_DISMISSED_KEY);
      if (dismissed === "true") {
        return;
      }
    } catch (error) {
      console.error("Failed to check PWA prompt status:", error);
    }

    // 检测iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS && isSafari) {
      setVisible(true);
      showAnimation();
    }
  };

  const showAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDismiss = async () => {
    try {
      await AsyncStorage.setItem(PWA_PROMPT_DISMISSED_KEY, "true");
    } catch (error) {
      console.error("Failed to save PWA prompt status:", error);
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      onDismiss?.();
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        right: 20,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        zIndex: 9999,
      }}
    >
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
        {/* 关闭按钮 */}
        <Pressable
          onPress={handleDismiss}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            padding: 4,
          }}
        >
          <Ionicons name="close" size={20} color="#999" />
        </Pressable>

        {/* 标题 */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: "#0A0E27",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 24 }}>📱</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>
              安装Epos到主屏幕
            </Text>
            <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
              获得更好的使用体验
            </Text>
          </View>
        </View>

        {/* 安装步骤 */}
        <View style={{ marginBottom: 16 }}>
          <InstallStep number={1} text="点击底部的分享按钮" icon="share-outline" />
          <InstallStep number={2} text="选择'添加到主屏幕'" icon="add-circle-outline" />
          <InstallStep number={3} text="点击'添加'完成安装" icon="checkmark-circle-outline" />
        </View>

        {/* 特性说明 */}
        <View
          style={{
            backgroundColor: "#F3F4F6",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <Text style={{ fontSize: 12, color: "#666", lineHeight: 18 }}>
            ✨ 离线访问 | 🚀 快速启动 | 📱 原生体验
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

// 安装步骤组件
const InstallStep: React.FC<{ number: number; text: string; icon: string }> = ({
  number,
  text,
  icon,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: "#00D9FF",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "bold", color: "#FFF" }}>
          {number}
        </Text>
      </View>
      <Ionicons name={icon as any} size={16} color="#00D9FF" style={{ marginRight: 8 }} />
      <Text style={{ fontSize: 14, color: "#333", flex: 1 }}>
        {text}
      </Text>
    </View>
  );
};

export default PWAInstallPrompt;
