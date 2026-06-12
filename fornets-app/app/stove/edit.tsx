import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { Screen } from "@/components/Screen";
import { StoveForm } from "@/components/forms/StoveForm";
import { formatBoilTime } from "@/lib/format";
import { useStore } from "@/store/useStore";
import { spacing } from "@/theme";

export default function EditStoveScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const stove = useStore((s) => s.stoves.find((h) => h.id === id));
  const updateStove = useStore((s) => s.updateStove);

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

  return (
    <Screen edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <StoveForm
            submitLabel="Desa els canvis"
            defaultValues={{
              name: stove.name,
              brand: stove.brand,
              material: stove.material,
              max_capacity_ml: String(stove.max_capacity_ml),
              boil_time: formatBoilTime(stove.boil_time_300ml_s),
              weight_g: String(stove.weight_g),
              size: stove.size,
              needs_pot_stand: stove.needs_pot_stand,
              notes: stove.notes,
              photo_uri: stove.photo_uri,
            }}
            onSubmit={(values) => {
              updateStove(stove.id, values);
              router.back();
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing[4], paddingBottom: spacing[12] },
});
