import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { fontSize, fontWeight, radius, spacing, useTheme } from "@/theme";

type Props = {
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  allLabel?: string;
};

/** Fila horitzontal de "chips" per filtrar. `null` = mostrar-ho tot. */
export function FilterChips({ options, selected, onSelect, allLabel = "Tots" }: Props) {
  if (options.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Chip label={allLabel} active={selected === null} onPress={() => onSelect(null)} />
      {options.map((opt) => (
        <Chip
          key={opt}
          label={opt}
          active={selected === opt}
          onPress={() => onSelect(opt)}
        />
      ))}
    </ScrollView>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[
        styles.chip,
        active
          ? { backgroundColor: colors.brand, borderColor: colors.brand }
          : { backgroundColor: "transparent", borderColor: colors.borderStrong },
      ]}
    >
      <Text
        style={[styles.label, { color: active ? colors.onBrand : colors.textStrong }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing[2], paddingVertical: spacing[1] },
  chip: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1.5],
  },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
});
