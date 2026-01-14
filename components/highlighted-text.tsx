import { View, Text, Pressable } from "react-native";
import type { GrammarError } from "@/lib/grammar-checker";
import { getErrorTypeInfo } from "@/lib/error-type-colors";

interface HighlightedTextProps {
  text: string;
  errors: GrammarError[];
  onErrorTap: (error: GrammarError) => void;
}

/**
 * Highlighted Text Component
 * 
 * Displays text with color-coded error highlights.
 * Tapping on a highlighted word opens the knowledge card.
 */
export function HighlightedText({ text, errors, onErrorTap }: HighlightedTextProps) {
  // Build a map of error positions
  const errorMap = new Map<string, GrammarError>();
  errors.forEach((error) => {
    if (error.incorrect) {
      errorMap.set(error.incorrect.toLowerCase(), error);
    }
  });

  // Split text into words while preserving spaces and punctuation
  const tokens = text.split(/(\s+|[.,!?;:])/);

  return (
    <View className="flex-row flex-wrap">
      {tokens.map((token, index) => {
        const cleanToken = token.trim().toLowerCase().replace(/[.,!?;:]$/, "");
        const error = errorMap.get(cleanToken);

        if (error) {
          const errorInfo = getErrorTypeInfo(error.type);
          return (
            <Pressable
              key={index}
              onPress={() => onErrorTap(error)}
              className="active:opacity-70"
            >
              <Text
                className="text-base leading-relaxed font-semibold"
                style={{
                  color: errorInfo.color,
                  textDecorationLine: "underline",
                  textDecorationStyle: "dashed",
                  textDecorationColor: errorInfo.color,
                }}
              >
                {token}
              </Text>
            </Pressable>
          );
        }

        return (
          <Text key={index} className="text-base text-foreground leading-relaxed">
            {token}
          </Text>
        );
      })}
    </View>
  );
}
