import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { exportBackup, importBackup } from "@/lib/backup";
import { loadSeedStoves } from "@/lib/seed";
import { useStore } from "@/store/useStore";
import { fontSize, fontWeight, spacing, useTheme } from "@/theme";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const importSeed = useStore((s) => s.importSeed);
  const replaceAll = useStore((s) => s.replaceAll);
  const clearAll = useStore((s) => s.clearAll);
  const stoves = useStore((s) => s.stoves);

  const [busy, setBusy] = useState(false);

  const onExport = async () => {
    setBusy(true);
    try {
      await exportBackup();
    } catch {
      Alert.alert("Error", "No s'ha pogut exportar la còpia de seguretat.");
    } finally {
      setBusy(false);
    }
  };

  const onImport = async () => {
    setBusy(true);
    try {
      const result = await importBackup();
      if (result.ok) {
        Alert.alert(
          "Importar còpia",
          `Es substituiran totes les dades actuals per ${result.backup.stoves.length} fornets. Voleu continuar?`,
          [
            { text: "Cancel·la", style: "cancel" },
            {
              text: "Importa",
              style: "destructive",
              onPress: () => replaceAll(result.backup),
            },
          ],
        );
      } else if (result.reason === "invalid") {
        Alert.alert("Fitxer no vàlid", result.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const onLoadExamples = () => {
    const added = importSeed(loadSeedStoves());
    Alert.alert(
      "Exemples carregats",
      added > 0
        ? `S'han afegit ${added} fornets d'exemple.`
        : "Tots els fornets d'exemple ja hi eren.",
    );
  };

  const onClearAll = () => {
    Alert.alert(
      "Esborrar-ho tot",
      "S'esborraran TOTS els fornets. Aquesta acció no es pot desfer.",
      [
        { text: "Cancel·la", style: "cancel" },
        { text: "Esborra-ho tot", style: "destructive", onPress: () => clearAll() },
      ],
    );
  };

  return (
    <Screen edges={["left", "right", "bottom"]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={8}>
              <Text style={[styles.done, { color: colors.brandText }]}>Fet</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Còpies de seguretat">
          <Text style={[styles.help, { color: colors.textSecondary }]}>
            Dades actuals: {stoves.length} fornets.
          </Text>
          <Button label="Exporta a JSON" variant="secondary" onPress={onExport} loading={busy} />
          <Button label="Importa un JSON" variant="secondary" onPress={onImport} loading={busy} />
        </Section>

        <Section title="Dades d'exemple">
          <Button
            label="Carrega el catàleg d'exemple"
            variant="secondary"
            onPress={onLoadExamples}
          />
        </Section>

        <Section title="Zona perillosa">
          <Button label="Esborra totes les dades" variant="danger" onPress={onClearAll} />
        </Section>
      </ScrollView>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing[6], padding: spacing[4], paddingBottom: spacing[12] },
  section: { gap: spacing[3] },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  help: { fontSize: fontSize.sm },
  done: { fontSize: fontSize.base, fontWeight: fontWeight.semibold },
});
