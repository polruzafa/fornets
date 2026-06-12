import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

import { fontSize, fontWeight, radius, spacing, useTheme } from "@/theme";

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

/** Botó d'acció flotant (cantonada inferior dreta). */
export function Fab({ label, onPress, icon = "add" }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: pressed ? colors.brandActive : colors.brand },
      ]}
    >
      <Ionicons name={icon} size={20} color={colors.onBrand} />
      <Text style={[styles.label, { color: colors.onBrand }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: spacing[6],
    right: spacing[5],
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    borderRadius: radius.full,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  label: { fontSize: fontSize.base, fontWeight: fontWeight.semibold },
});
