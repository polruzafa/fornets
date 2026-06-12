import { Fragment } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { Menu } from "@/components/Menu";
import { Screen } from "@/components/Screen";
import { formatBoilTime, formatGrams, formatMl } from "@/lib/format";
import { materialLabel, sizeLabel } from "@/lib/labels";
import { useStore } from "@/store/useStore";
import { fontSize, fontWeight, radius, spacing, useTheme } from "@/theme";

export default function StoveDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const stove = useStore((s) => s.stoves.find((h) => h.id === id));
  const removeStove = useStore((s) => s.removeStove);

  if (!stove) {
    return (
      <Screen edges={["left", "right", "bottom"]}>
        <EmptyState
          icon="alert-circle-outline"
          title="Fornet no trobat"
          message="Pot ser que s'hagi esborrat."
        />
      </Screen>
    );
  }

  const specs = [
    { label: "Material", value: materialLabel(stove.material) },
    { label: "Capacitat màx.", value: formatMl(stove.max_capacity_ml) },
    { label: "Bullir 300 ml", value: formatBoilTime(stove.boil_time_300ml_s) },
    { label: "Pes", value: formatGrams(stove.weight_g) },
    { label: "Mida", value: sizeLabel(stove.size) },
    { label: "Suport per a l'olla", value: stove.needs_pot_stand ? "Sí" : "No" },
  ];

  const confirmDelete = () => {
    Alert.alert(
      "Esborrar fornet",
      `S'esborrarà «${stove.name}». Voleu continuar?`,
      [
        { text: "Cancel·la", style: "cancel" },
        {
          text: "Esborra",
          style: "destructive",
          onPress: () => {
            removeStove(stove.id);
            router.back();
          },
        },
      ],
    );
  };


  return (
    <Screen edges={["left", "right", "bottom"]}>
      <Stack.Screen
        options={{
          title: stove.name,
          headerRight: () => (
            <Menu
              items={[
                {
                  label: "Edita",
                  icon: "create-outline",
                  onPress: () => router.push(`/stove/edit?id=${stove.id}`),
                },
                {
                  label: "Esborra",
                  icon: "trash-outline",
                  destructive: true,
                  onPress: confirmDelete,
                },
              ]}
            />
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroBlock}>
          <View style={[styles.hero, { backgroundColor: colors.surfaceMuted }]}>
            {stove.photo_uri ? (
              <Image
                source={{ uri: stove.photo_uri }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="flame" size={48} color={colors.ember} />
            )}
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{stove.name}</Text>
          <Text style={[styles.brand, { color: colors.textSecondary }]}>{stove.brand}</Text>
        </View>

        {/* Fitxa tècnica: files etiqueta/valor amb separadors. */}
        <View style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {specs.map((s, i) => (
            <Fragment key={s.label}>
              {i > 0 ? (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              ) : null}
              <View style={styles.specRow}>
                <Text style={[styles.specLabel, { color: colors.textSecondary }]}>{s.label}</Text>
                <Text style={[styles.specValue, { color: colors.text }]}>{s.value}</Text>
              </View>
            </Fragment>
          ))}
        </View>

        {stove.notes ? (
          <View style={styles.notes}>
            <Text style={[styles.notesLabel, { color: colors.textSecondary }]}>Notes</Text>
            <Text style={[styles.notesText, { color: colors.text }]}>{stove.notes}</Text>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing[5], padding: spacing[4], paddingBottom: spacing[12] },
  heroBlock: { alignItems: "center", gap: spacing[3] },
  hero: {
    height: 128,
    width: 128,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radius["3xl"],
  },
  heroImage: { height: "100%", width: "100%" },
  name: { fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  brand: { fontSize: fontSize.base },
  sheet: {
    borderWidth: 1,
    borderRadius: radius["2xl"],
    paddingHorizontal: spacing[4],
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing[3],
  },
  specLabel: { fontSize: fontSize.sm },
  specValue: { fontSize: fontSize.base, fontWeight: fontWeight.semibold },
  divider: { height: StyleSheet.hairlineWidth },
  notes: { gap: spacing[1.5] },
  notesLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  notesText: { fontSize: fontSize.base },
});
