import { View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";

export function EposLogo() {
  const colors = useColors();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "300",
          letterSpacing: 3,
          color: colors.foreground,
        }}
      >
        EPOS
      </Text>
      <Text
        style={{
          fontSize: 11,
          fontWeight: "300",
          letterSpacing: 2,
          color: colors.muted,
          textTransform: "lowercase",
        }}
      >
        logic of language
      </Text>
    </View>
  );
}
