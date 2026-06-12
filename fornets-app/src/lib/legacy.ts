/**
 * Migració de dades antigues.
 *
 * El model ha canviat amb el temps: primer els camps eren en castellà
 * (`nombre`, `marca`, `capacidad_ml`…), després en anglès amb consum/usos, i ara
 * el catàleg només desa fornets amb camps nous (material, mida, temps de bullida).
 * Aquí convertim qualsevol forma antiga a l'esquema actual perquè ni les dades
 * persistides ni els backups antics es perdin. És l'ÚNIC lloc amb noms antics;
 * quan ja no calgui suportar dades velles, es pot esborrar aquest fitxer.
 */

type AnyRecord = Record<string, unknown>;

/** Primer valor definit entre diverses claus possibles (nova o antiga). */
function pick(o: AnyRecord, ...keys: string[]): unknown {
  for (const k of keys) {
    if (o[k] !== undefined) return o[k];
  }
  return undefined;
}

function normalizeStove(raw: unknown): AnyRecord {
  const o = (raw ?? {}) as AnyRecord;
  // Els camps que falten queden `undefined` → l'esquema Zod aplica el seu default.
  return {
    id: pick(o, "id"),
    name: pick(o, "name", "nombre"),
    brand: pick(o, "brand", "marca"),
    material: pick(o, "material"),
    max_capacity_ml: pick(o, "max_capacity_ml", "capacity_ml", "capacidad_ml"),
    boil_time_300ml_s: pick(o, "boil_time_300ml_s"),
    weight_g: pick(o, "weight_g", "peso_g"),
    size: pick(o, "size"),
    needs_pot_stand: pick(o, "needs_pot_stand"),
    notes: pick(o, "notes", "notas"),
    photo_uri: pick(o, "photo_uri", "foto_uri"),
  };
}

export type LegacyNormalized = {
  stoves: AnyRecord[];
  version: unknown;
  exported_at: unknown;
};

/**
 * Normalitza un objecte tipus backup/estat (claus antigues o noves) a la forma
 * actual. Descarta els usos i la configuració, que ja no formen part del model.
 * És idempotent: aplicar-lo a dades ja actuals no les altera.
 */
export function normalizeLegacy(raw: unknown): LegacyNormalized {
  const o = (raw ?? {}) as AnyRecord;
  const stoves = pick(o, "stoves", "hornillos");
  return {
    stoves: Array.isArray(stoves) ? stoves.map(normalizeStove) : [],
    version: pick(o, "version"),
    exported_at: pick(o, "exported_at"),
  };
}
