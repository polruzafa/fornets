import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";

import { Screen } from "@/components/Screen";
import { StoveForm } from "@/components/forms/StoveForm";
import { useStore } from "@/store/useStore";
import { spacing } from "@/theme";

export default function NewStoveScreen() {
  const router = useRouter();
  const addStove = useStore((s) => s.addStove);

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
            submitLabel="Crea el fornet"
            onSubmit={(values) => {
              addStove(values);
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
