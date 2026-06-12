import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { fontSize, fontWeight, radius, spacing, useTheme } from "@/theme";

type Props = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  children?: React.ReactNode;
};

export function EmptyState({ icon = "flame-outline", title, message, children }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.surfaceMuted }]}>
        <Ionicons name={icon} size={36} color={colors.textFaint} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message ? (
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      ) : null}
      {children ? <View style={styles.children}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3],
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[16],
  },
  iconWrap: { borderRadius: radius.full, padding: spacing[5] },
  title: {
    textAlign: "center",
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  message: { textAlign: "center", fontSize: fontSize.base },
  children: { marginTop: spacing[2], width: "100%", maxWidth: 320 },
});
