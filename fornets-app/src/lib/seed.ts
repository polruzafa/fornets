import { type Stove, StovesSeedSchema } from "@/schemas";

// JSON estàtic empaquetat amb l'app. Metro el resol en temps de compilació.
import rawSeed from "../../assets/data/stoves.json";

/**
 * Llegeix i valida el catàleg d'exemple d'assets.
 * Si algun registre no compleix l'esquema, es descarta (no trenca la càrrega).
 */
export function loadSeedStoves(): Stove[] {
  const parsed = StovesSeedSchema.safeParse(rawSeed);
  if (parsed.success) return parsed.data;

  // Validació element a element com a pla B davant d'un JSON parcialment vàlid.
  if (!Array.isArray(rawSeed)) return [];
  const valid: Stove[] = [];
  for (const item of rawSeed) {
    const one = StovesSeedSchema.element.safeParse(item);
    if (one.success) valid.push(one.data);
  }
  return valid;
}
