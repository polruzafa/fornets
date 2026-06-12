import { forwardRef } from "react";
import { StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";

import { fontSize, fontWeight, radius, spacing, useTheme } from "@/theme";

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

/** Camp de text controlat amb etiqueta, ajuda i missatge d'error. */
export const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, error, hint, style, ...inputProps },
  ref,
) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textStrong }]}>{label}</Text>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        placeholderTextColor={colors.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: error ? colors.danger : colors.borderStrong,
          },
          style,
        ]}
        {...inputProps}
      />
      {error ? (
        <Text style={[styles.error, { color: colors.danger }]} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text style={[styles.hint, { color: colors.textSecondary }]}>{hint}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { gap: spacing[1.5] },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  input: {
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: fontSize.base,
  },
  error: { fontSize: fontSize.sm },
  hint: { fontSize: fontSize.sm },
});
