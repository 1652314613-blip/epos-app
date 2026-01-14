import { useState } from "react";
import { View, Text, Image, TextInput, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { AnimatedButton } from "@/components/animated-button";
import { trpc } from "@/lib/trpc";

export default function PhotoRecognitionScreen() {
  const colors = useColors();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [textType, setTextType] = useState<"word" | "sentence" | "text">("text");

  const recognizeMutation = trpc.ocr.recognizeText.useMutation();

  const pickImage = async (source: "camera" | "library") => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      let result;
      
      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("需要相机权限", "请在设置中允许访问相机");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 0.8,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("需要相册权限", "请在设置中允许访问相册");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        setRecognizedText("");
        setTextType("text");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("错误", "选择图片失败，请重试");
    }
  };

  const recognizeText = async () => {
    if (!image) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsProcessing(true);

    try {
      // 将图片转换为base64
      const response = await fetch(image);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        try {
          const result = await recognizeMutation.mutateAsync({
            imageBase64: base64data,
          });

          setRecognizedText(result.text);
          setTextType(result.type as "word" | "sentence" | "text");
          setIsProcessing(false);

          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        } catch (error) {
          console.error("Recognition error:", error);
          Alert.alert("识别失败", "请确保图片清晰且包含英文文字");
          setIsProcessing(false);
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("错误", "处理图片失败，请重试");
      setIsProcessing(false);
    }
  };

  const handleGrammarCheck = () => {
    if (!recognizedText.trim()) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    router.push({
      pathname: "/check-result",
      params: {
        sentence: recognizedText,
        gradeLevel: 7,
      },
    });
  };

  const handleLookupWord = () => {
    if (!recognizedText.trim()) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    router.push({
      pathname: "/word-detail",
      params: {
        word: recognizedText.trim(),
      },
    });
  };

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 gap-6">
        {/* 标题 */}
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">📷 拍照识别</Text>
          <Text className="text-base text-muted">
            拍摄或选择包含英文的图片，自动识别文字并进行语法检查或查词
          </Text>
        </View>

        {/* 图片选择按钮 */}
        {!image && (
          <View className="flex-1 items-center justify-center gap-6">
            <View className="items-center gap-3">
              <View className="bg-primary/10 rounded-full p-8">
                <Text className="text-6xl">📷</Text>
              </View>
              <Text className="text-xl font-semibold text-foreground">
                选择图片或拍照
              </Text>
              <Text className="text-sm text-muted text-center px-8">
                支持识别英文句子和单词
              </Text>
            </View>

            <View className="w-full gap-3">
              <AnimatedButton onPress={() => pickImage("camera")} variant="primary">
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-2xl">📸</Text>
                  <Text className="text-lg font-semibold text-background">拍照</Text>
                </View>
              </AnimatedButton>

              <AnimatedButton onPress={() => pickImage("library")} variant="secondary">
                <View className="flex-row items-center justify-center gap-2">
                  <Text className="text-2xl">🖼️</Text>
                  <Text className="text-lg font-semibold text-foreground">相册</Text>
                </View>
              </AnimatedButton>
            </View>
          </View>
        )}

        {/* 图片预览 */}
        {image && (
          <View className="gap-4">
            <View className="bg-surface rounded-2xl overflow-hidden border border-border">
              <Image
                source={{ uri: image }}
                className="w-full h-64"
                resizeMode="contain"
              />
            </View>

            {!recognizedText && (
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <AnimatedButton
                    onPress={recognizeText}
                    variant="primary"
                    disabled={isProcessing}
                  >
                    <Text className="text-base font-semibold text-background">
                      {isProcessing ? "识别中..." : "🔍 识别文字"}
                    </Text>
                  </AnimatedButton>
                </View>
                <AnimatedButton
                  onPress={() => {
                    setImage(null);
                    setRecognizedText("");
                  }}
                  variant="secondary"
                >
                  <Text className="text-base font-semibold text-foreground">重选</Text>
                </AnimatedButton>
              </View>
            )}
          </View>
        )}

        {/* 识别结果 */}
        {recognizedText && (
          <View className="flex-1 gap-4">
            <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
              <Text className="text-base font-semibold text-foreground">
                识别结果：
              </Text>
              <TextInput
                value={recognizedText}
                onChangeText={setRecognizedText}
                multiline
                className="text-base text-foreground min-h-[100px] p-3 bg-background rounded-xl border border-border"
                placeholder="可以编辑识别结果..."
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* 操作按钮 */}
            <View className="gap-3">
              {textType === "sentence" || textType === "text" ? (
                <AnimatedButton onPress={handleGrammarCheck} variant="primary">
                  <Text className="text-base font-semibold text-background">
                    ✏️ 语法检查
                  </Text>
                </AnimatedButton>
              ) : null}

              {textType === "word" || textType === "text" ? (
                <AnimatedButton onPress={handleLookupWord} variant="secondary">
                  <Text className="text-base font-semibold text-foreground">
                    📖 查词
                  </Text>
                </AnimatedButton>
              ) : null}

              <AnimatedButton
                onPress={() => {
                  setImage(null);
                  setRecognizedText("");
                }}
                variant="secondary"
              >
                <Text className="text-base font-semibold text-foreground">
                  重新拍照
                </Text>
              </AnimatedButton>
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
