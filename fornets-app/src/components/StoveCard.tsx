import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { Stove } from "@/schemas";
import { formatGrams, formatMl } from "@/lib/format";
import { materialLabel } from "@/lib/labels";
import { fontSize, fontWeight, radius, spacing, useTheme } from "@/theme";

type Props = {
  stove: Stove;
  onPress: () => void;
};

export function StoveCard({ stove, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${stove.name} de ${stove.brand}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.thumb, { backgroundColor: colors.surfaceMuted }]}>
        {stove.photo_uri ? (
          <Image
            source={{ uri: stove.photo_uri }}
            style={styles.thumbImage}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <Ionicons name="flame" size={28} color={colors.ember} />
        )}
      </View>

      <View style={styles.body}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
          {stove.name}
        </Text>
        <Text numberOfLines={1} style={[styles.brand, { color: colors.textSecondary }]}>
          {stove.brand}
        </Text>
        <Text style={[styles.specs, { color: colors.textSecondary }]}>
          {materialLabel(stove.material)} · {formatMl(stove.max_capacity_ml)} ·{" "}
          {formatGrams(stove.weight_g)}
        </Text>
      </View>

      <View style={styles.chevron}>
        <Ionicons name="chevron-forward" size={20} color={colors.textFaint} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: spacing[3],
    borderWidth: 1,
    borderRadius: radius["2xl"],
    padding: spacing[3],
  },
  pressed: { opacity: 0.7 },
  thumb: {
    height: 64,
    width: 64,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radius.xl,
  },
  thumbImage: { height: "100%", width: "100%" },
  body: { flex: 1, justifyContent: "center", gap: spacing[0.5] },
  title: { fontSize: fontSize.base, fontWeight: fontWeight.semibold },
  brand: { fontSize: fontSize.sm },
  specs: { fontSize: fontSize.xs },
  chevron: { justifyContent: "center" },
});
