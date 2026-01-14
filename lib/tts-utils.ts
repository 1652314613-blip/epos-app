import * as Speech from "expo-speech";
import { Platform } from "react-native";

/**
 * 播放单词发音
 * @param word 要播放的单词
 * @param language 语言代码，默认为英语（美式）
 */
export async function speakWord(word: string, language: string = "en-US"): Promise<void> {
  try {
    // 检查是否正在播放
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    }

    await Speech.speak(word, {
      language,
      pitch: 1.0,
      rate: 0.8, // 稍慢一点，便于学习
      voice: Platform.OS === "ios" ? "com.apple.ttsbundle.Samantha-compact" : undefined,
    });
  } catch (error) {
    console.error("播放发音失败", error);
  }
}

/**
 * 播放句子
 * @param sentence 要播放的句子
 * @param language 语言代码，默认为英语（美式）
 */
export async function speakSentence(sentence: string, language: string = "en-US"): Promise<void> {
  try {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    }

    await Speech.speak(sentence, {
      language,
      pitch: 1.0,
      rate: 0.9, // 正常语速
      voice: Platform.OS === "ios" ? "com.apple.ttsbundle.Samantha-compact" : undefined,
    });
  } catch (error) {
    console.error("播放句子失败", error);
  }
}

/**
 * 停止当前播放
 */
export async function stopSpeaking(): Promise<void> {
  try {
    await Speech.stop();
  } catch (error) {
    console.error("停止播放失败", error);
  }
}

/**
 * 检查是否正在播放
 */
export async function isSpeaking(): Promise<boolean> {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    console.error("检查播放状态失败", error);
    return false;
  }
}

/**
 * 获取可用的语音列表
 */
export async function getAvailableVoices(): Promise<Speech.Voice[]> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.filter(v => v.language.startsWith("en")); // 只返回英语语音
  } catch (error) {
    console.error("获取语音列表失败", error);
    return [];
  }
}
