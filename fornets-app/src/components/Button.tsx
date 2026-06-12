import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { fontSize, fontWeight, radius, spacing, useTheme } from "@/theme";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  /** Element opcional a l'esquerra (p. ex. una icona). */
  icon?: React.ReactNode;
  accessibilityHint?: string;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  icon,
  accessibilityHint,
}: Props) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const bg: Record<Variant, string> = {
    primary: colors.brand,
    secondary: colors.surfaceMuted,
    danger: colors.dangerBg,
    ghost: "transparent",
  };
  const pressedBg: Record<Variant, string> = {
    primary: colors.brandActive,
    secondary: colors.border,
    danger: colors.dangerActive,
    ghost: colors.surfaceMuted,
  };
  const textColor: Record<Variant, string> = {
    primary: colors.onBrand,
    secondary: colors.text,
    danger: colors.onDanger,
    ghost: colors.brandText,
  };
  const spinnerColor =
    variant === "secondary" || variant === "ghost" ? colors.brandIcon : colors.onBrand;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: pressed && !isDisabled ? pressedBg[variant] : bg[variant] },
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <>
          {icon ? <View>{icon}</View> : null}
          <Text style={[styles.label, { color: textColor[variant] }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[2],
    borderRadius: radius["2xl"],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3.5],
  },
  disabled: { opacity: 0.5 },
  label: { fontSize: fontSize.base, fontWeight: fontWeight.semibold },
});
