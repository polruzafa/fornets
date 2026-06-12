import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useTheme } from "@/theme";

export default function RootLayout() {
  const { isDark, colors } = useTheme();

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Fornets" }} />
        <Stack.Screen name="stove/[id]" options={{ title: "Detall del fornet" }} />
        <Stack.Screen
          name="stove/new"
          options={{ title: "Nou fornet", presentation: "modal" }}
        />
        <Stack.Screen
          name="stove/edit"
          options={{ title: "Edita el fornet", presentation: "modal" }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Configuració", presentation: "modal" }}
        />
        <Stack.Screen name="+not-found" options={{ title: "No trobat" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
