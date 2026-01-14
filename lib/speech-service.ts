import * as Speech from 'expo-speech';

export interface SpeechOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  onDone?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Speak text using Text-to-Speech
 */
export async function speak(text: string, options: SpeechOptions = {}) {
  const {
    language = 'en-US',
    pitch = 1.0,
    rate = 1.0,
    onDone,
    onError
  } = options;

  try {
    // Stop any ongoing speech
    await Speech.stop();

    // Speak the text
    await Speech.speak(text, {
      language,
      pitch,
      rate,
      onDone,
      onError: (error) => {
        console.error('Speech error:', error);
        onError?.(new Error(error.toString()));
      }
    });
  } catch (error) {
    console.error('Failed to speak:', error);
    onError?.(error as Error);
  }
}

/**
 * Stop current speech
 */
export async function stopSpeaking() {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Failed to stop speech:', error);
  }
}

/**
 * Pause current speech
 */
export async function pauseSpeaking() {
  try {
    await Speech.pause();
  } catch (error) {
    console.error('Failed to pause speech:', error);
  }
}

/**
 * Resume paused speech
 */
export async function resumeSpeaking() {
  try {
    await Speech.resume();
  } catch (error) {
    console.error('Failed to resume speech:', error);
  }
}

/**
 * Check if speech is currently speaking
 */
export async function isSpeaking(): Promise<boolean> {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    console.error('Failed to check speaking status:', error);
    return false;
  }
}

/**
 * Get available voices
 */
export async function getAvailableVoices() {
  try {
    return await Speech.getAvailableVoicesAsync();
  } catch (error) {
    console.error('Failed to get available voices:', error);
    return [];
  }
}

/**
 * Speak text with speed control
 */
export async function speakWithSpeed(
  text: string,
  speed: number = 1.0,
  options: Omit<SpeechOptions, 'rate'> = {}
) {
  return speak(text, { ...options, rate: speed });
}

/**
 * Speak English text (convenience function)
 */
export async function speakEnglish(text: string, options: Omit<SpeechOptions, 'language'> = {}) {
  return speak(text, { ...options, language: 'en-US' });
}

/**
 * Speak Chinese text (convenience function)
 */
export async function speakChinese(text: string, options: Omit<SpeechOptions, 'language'> = {}) {
  return speak(text, { ...options, language: 'zh-CN' });
}
