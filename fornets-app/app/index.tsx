import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from "react-native";

import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { Fab } from "@/components/Fab";
import { FilterChips } from "@/components/FilterChips";
import { Screen } from "@/components/Screen";
import { SearchBar } from "@/components/SearchBar";
import { StoveCard } from "@/components/StoveCard";
import { useStoveFilter } from "@/hooks/useStoveFilter";
import { loadSeedStoves } from "@/lib/seed";
import { useStore } from "@/store/useStore";
import { spacing, useTheme } from "@/theme";

export default function CatalogScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const hydrated = useStore((s) => s.hydrated);
  const stoves = useStore((s) => s.stoves);
  const importSeed = useStore((s) => s.importSeed);

  const { query, setQuery, brand, setBrand, brands, results } = useStoveFilter(stoves);

  // Engranatge a la barra superior → Configuració (modal).
  const header = (
    <Stack.Screen
      options={{
        headerRight: () => (
          <Pressable
            onPress={() => router.push("/settings")}
            accessibilityRole="button"
            accessibilityLabel="Configuració"
            hitSlop={8}
          >
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </Pressable>
        ),
      }}
    />
  );

  if (!hydrated) {
    return (
      <Screen edges={["left", "right"]}>
        {header}
        <View style={styles.center}>
          <ActivityIndicator color={colors.brandIcon} />
        </View>
      </Screen>
    );
  }

  const empty = stoves.length === 0;

  return (
    <Screen edges={["left", "right"]}>
      {header}
      <View style={styles.flex}>
        {!empty ? (
          <View style={styles.searchHeader}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Cerqueu per nom, marca o notes…"
            />
            <FilterChips options={brands} selected={brand} onSelect={setBrand} />
          </View>
        ) : null}

        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <StoveCard stove={item} onPress={() => router.push(`/stove/${item.id}`)} />
          )}
          ListEmptyComponent={
            empty ? (
              <EmptyState
                icon="flame-outline"
                title="Encara no teniu cap fornet"
                message="Afegiu-ne un o carregueu el catàleg d'exemple."
              >
                <View style={styles.emptyActions}>
                  <Button label="Afegeix un fornet" onPress={() => router.push("/stove/new")} />
                  <Button
                    label="Carrega els exemples"
                    variant="secondary"
                    onPress={() => importSeed(loadSeedStoves())}
                  />
                </View>
              </EmptyState>
            ) : (
              <EmptyState
                icon="search-outline"
                title="Cap resultat"
                message="Proveu amb uns altres termes de cerca o filtres."
              />
            )
          }
        />

        {!empty ? (
          <Fab label="Afegeix" onPress={() => router.push("/stove/new")} />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  searchHeader: {
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  },
  list: {
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[1],
    paddingBottom: spacing[28],
  },
  emptyActions: { gap: spacing[2] },
});
