import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { type Backup, BackupSchema, type Stove, StoveSchema } from "@/schemas";
import { createId } from "@/lib/id";
import { normalizeLegacy } from "@/lib/legacy";

const STORAGE_KEY = "fornet-store-v1";

type State = {
  stoves: Stove[];
  /** Es posa a true quan AsyncStorage ha rehidratat l'estat. */
  hydrated: boolean;
};

type Actions = {
  addStove: (data: Omit<Stove, "id">) => Stove;
  updateStove: (id: string, data: Partial<Omit<Stove, "id">>) => void;
  removeStove: (id: string) => void;
  getStove: (id: string) => Stove | undefined;

  importSeed: (stoves: Stove[]) => number;
  replaceAll: (backup: Backup) => void;
  clearAll: () => void;
  setHydrated: (value: boolean) => void;
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      stoves: [],
      hydrated: false,

      addStove: (data) => {
        const stove = StoveSchema.parse({ ...data, id: createId("stove") });
        set((s) => ({ stoves: [stove, ...s.stoves] }));
        return stove;
      },

      updateStove: (id, data) => {
        set((s) => ({
          stoves: s.stoves.map((h) => (h.id === id ? { ...h, ...data } : h)),
        }));
      },

      removeStove: (id) => {
        set((s) => ({ stoves: s.stoves.filter((h) => h.id !== id) }));
      },

      getStove: (id) => get().stoves.find((h) => h.id === id),

      importSeed: (incoming) => {
        const existingIds = new Set(get().stoves.map((h) => h.id));
        const fresh = incoming.filter((h) => !existingIds.has(h.id));
        set((s) => ({ stoves: [...fresh, ...s.stoves] }));
        return fresh.length;
      },

      replaceAll: (backup) => set({ stoves: backup.stoves }),

      clearAll: () => set({ stoves: [] }),

      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      // Migra dades antigues (camps en castellà, consum/usos, capacity_ml…) al model actual.
      migrate: (persisted, version) => {
        if (version < 2) {
          const { stoves } = normalizeLegacy(persisted);
          return { stoves: StoveSchema.array().catch([]).parse(stoves) };
        }
        return persisted as State;
      },
      partialize: (s) => ({ stoves: s.stoves }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/** Construeix un objecte de backup a partir de l'estat actual. */
export function buildBackup(now: string): Backup {
  const { stoves } = useStore.getState();
  return BackupSchema.parse({ version: 2, exported_at: now, stoves });
}
