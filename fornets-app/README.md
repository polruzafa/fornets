# Fornet 🔥

App offline-first, només nativa (iOS/Android), per fer el **catàleg dels teus fornets d'alcohol**: model, marca, material, capacitat màxima, temps per bullir 300 ml, pes i mida. Sense registre d'usos ni estadístiques. Tot en català, sense backend.

## Stack

- **Expo SDK 52** + **TypeScript** (estricte, sense `any`)
- **expo-router** — navegació basada en fitxers (stack + modals)
- **Zustand** + **AsyncStorage** — estat global persistit, 100% offline
- **Zod** + **react-hook-form** — validació de formularis i de dades
- **Sistema de temes propi** (`src/theme`) — `StyleSheet` + hook `useTheme()` amb tema clar/fosc automàtic
- **expo-image-picker / file-system / document-picker / sharing** — fotos i backups

## Posada en marxa

```bash
pnpm install
# Alinea les versions natives amb el SDK instal·lat (recomanat el primer cop):
npx expo install --fix
pnpm expo start
```

Obre l'app amb **Expo Go** (escaneja el QR) o amb un simulador iOS/Android.

> Comprovacions de qualitat: `pnpm typecheck` (TypeScript) i `pnpm lint`.

## Estructura

```
fornet/
├── app/                          # Rutes (expo-router)
│   ├── _layout.tsx               # Stack arrel + tema
│   ├── index.tsx                 # Catàleg (cerca + filtre + afegir); engranatge → Configuració
│   ├── settings.tsx              # Configuració (modal): backups, exemples, reset
│   ├── stove/
│   │   ├── [id].tsx              # Detall (fitxa tècnica); menú ⋯ → edita / esborra
│   │   ├── new.tsx               # Formulari nou fornet (modal)
│   │   └── edit.tsx              # Formulari edició (modal)
│   └── +not-found.tsx
├── assets/data/stoves.json       # Catàleg d'exemple (import estàtic)
├── src/
│   ├── components/               # UI reutilitzable (+ forms/)
│   ├── hooks/                    # useStoveFilter
│   ├── lib/                      # format, labels, backup, seed, legacy, id (funcions pures)
│   ├── schemas/                  # Esquemes Zod = font de veritat dels tipus
│   ├── store/                    # Store Zustand persistit
│   └── theme/                    # Tokens de color/espai + useTheme() (clar/fosc)
├── metro.config.js · babel.config.js
└── app.json · tsconfig.json
```

## Models de dades

**Stove** — `id`, `name`, `brand`, `material` (enum), `max_capacity_ml`, `boil_time_300ml_s` (segons), `weight_g`, `size` (enum), `needs_pot_stand` (bool), `notes`, `photo_uri`

Els enums `material` i `size` es desen com a claus neutres (p. ex. `"titanium"`, `"small"`); les etiquetes en català viuen a [`src/lib/labels.ts`](src/lib/labels.ts) (a punt per a les traduccions ca/es/en).

Definits a [`src/schemas/index.ts`](src/schemas/index.ts). Els tipus TypeScript es deriven amb `z.infer`, així mai es desincronitzen de la validació. Les dades antigues (camps en castellà) es migren automàticament a [`src/lib/legacy.ts`](src/lib/legacy.ts), tant a la rehidratació com en importar backups.

## Carregar dades

Hi ha **dues vies**, totes dues acaben a AsyncStorage:

1. **JSON estàtic** — `assets/data/stoves.json` es valida amb Zod i s'importa des de _Configuració → Carrega el catàleg d'exemple_ (o des de l'estat buit del catàleg). Els duplicats per `id` s'ignoren.
2. **CRUD manual** — formularis dins l'app (crear, editar i esborrar fornets).

També pots **Exportar/Importar JSON** complet (els fornets) des de _Configuració_.

## Com afegir camps nous al JSON sense trencar l'app

La clau és la **compatibilitat cap enrere** dels esquemes Zod. Regla d'or: **tot camp nou ha de ser opcional amb valor per defecte**, perquè un JSON antic (que no el porta) continuï validant.

1. Afegeix el camp a l'esquema amb `.default(...)` o `.catch(...)`:

   ```ts
   export const StoveSchema = z.object({
     // …camps existents…
     // NOU: tipus de combustible. Els JSON antics no el tenen → default.
     fuel_type: z.enum(["alcohol", "gel", "multi"]).default("alcohol"),
     // NOU numèric tolerant: si arriba brossa, cau al valor per defecte.
     purchase_year: z.number().int().catch(0).default(0),
   });
   ```

   - `.default(x)` → si el camp **falta**, s'omple amb `x`.
   - `.catch(x)` → si el camp **existeix però és invàlid**, cau a `x` (no llança).

2. El tipus TypeScript s'actualitza sol (és `z.infer` de l'esquema). El compilador et marcarà on cal usar-lo.

3. Mostra'l a la UI (p. ex. a `StoveCard` / detall) i, si vols editar-lo, afegeix-lo a `StoveFormSchema` i a `StoveForm`.

4. **No facis** camps nous obligatoris (`z.string()` sense default) ni renombris/elimines els existents: això sí trencaria els JSON i backups antics. Si has de fer un canvi incompatible, puja el `version` de `BackupSchema` i migra les dades a la rehidratació.

Com que el catàleg d'exemple i la importació de backups passen sempre pel mateix esquema tolerant, un fitxer antic **mai** bloqueja l'arrencada: els registres invàlids es descarten i la resta es carrega.

## Notes

- Sense backend, Firebase, Supabase ni APIs externes. Tota la persistència és local (AsyncStorage) i els backups són fitxers JSON que tu controles.
- Tema clar/fosc automàtic segons el sistema, via `useColorScheme()` dins `src/theme`.
