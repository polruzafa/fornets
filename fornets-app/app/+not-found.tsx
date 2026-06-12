import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { fontSize, fontWeight, spacing, useTheme } from "@/theme";

export default function NotFoundScreen() {
  const { colors } = useTheme();
  return (
    <>
      <Stack.Screen options={{ title: "No trobat" }} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Aquesta pantalla no existeix.
        </Text>
        <Link href="/" style={[styles.link, { color: colors.brandText }]}>
          Torna al catàleg
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3],
    padding: spacing[6],
  },
  title: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold },
  link: { fontSize: fontSize.base, fontWeight: fontWeight.medium },
});
