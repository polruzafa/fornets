import { z } from "zod";

import { MATERIALS, SIZES } from "@/lib/labels";
import { parseBoilTime } from "@/lib/format";

/**
 * Esquemes Zod = única font de veritat per a les dades.
 * Els tipus de TypeScript es deriven amb `z.infer`, així mai es desincronitzen.
 *
 * IMPORTANT (compatibilitat futura): tots els camps nous s'han d'afegir com a
 * `.optional()` amb `.default(...)` o amb `.catch(...)`. Així, un JSON antic
 * (sense aquest camp) continua validant i l'app no es trenca. Vegeu el README.
 */

// ---------------------------------------------------------------------------
// Fornet (catàleg)
// ---------------------------------------------------------------------------

export const StoveSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "El nom és obligatori"),
  brand: z.string().min(1, "La marca és obligatòria"),
  // Camps tolerants amb `.catch`/`.default`: les dades antigues no els porten.
  material: z.enum(MATERIALS).catch("other").default("other"),
  max_capacity_ml: z.number().nonnegative("Ha de ser ≥ 0"),
  /** Temps per bullir 300 ml, en segons. */
  boil_time_300ml_s: z.number().nonnegative("Ha de ser ≥ 0").catch(0).default(0),
  weight_g: z.number().nonnegative("Ha de ser ≥ 0"),
  size: z.enum(SIZES).catch("medium").default("medium"),
  /** Si necessita un suport per a l'olla a part. */
  needs_pot_stand: z.boolean().catch(false).default(false),
  notes: z.string().default(""),
  photo_uri: z.string().nullable().default(null),
});

export type Stove = z.infer<typeof StoveSchema>;

// ---------------------------------------------------------------------------
// Formulari (react-hook-form treballa amb strings → transformació a número)
// ---------------------------------------------------------------------------

/** Converteix un text (amb coma o punt) a número. NaN si no és vàlid. */
export const parseDecimal = (value: string): number =>
  Number(value.replace(",", "."));

/**
 * Camp de text que representa un número. Es valida com a STRING, així
 * react-hook-form treballa sempre amb strings i no hi ha fricció amb el resolver.
 * La conversió a `number` es fa explícitament al formulari.
 */
const numericField = (opts: { positive?: boolean }) =>
  z
    .string()
    .trim()
    .min(1, "Obligatori")
    .refine((v) => !Number.isNaN(parseDecimal(v)), "Nombre no vàlid")
    .refine(
      (v) => (opts.positive ? parseDecimal(v) > 0 : parseDecimal(v) >= 0),
      opts.positive ? "Ha de ser > 0" : "Ha de ser ≥ 0",
    );

export const StoveFormSchema = z.object({
  name: z.string().trim().min(1, "El nom és obligatori"),
  brand: z.string().trim().min(1, "La marca és obligatòria"),
  material: z.enum(MATERIALS),
  max_capacity_ml: numericField({ positive: true }),
  // Temps de bullida en format "m:ss".
  boil_time: z
    .string()
    .trim()
    .refine((v) => !Number.isNaN(parseBoilTime(v)), "Format m:ss (p. ex. 4:30)")
    .refine((v) => parseBoilTime(v) > 0, "Ha de ser > 0"),
  weight_g: numericField({ positive: true }),
  size: z.enum(SIZES),
  needs_pot_stand: z.boolean(),
  notes: z.string().trim().default(""),
  photo_uri: z.string().nullable().default(null),
});

export type StoveFormValues = z.input<typeof StoveFormSchema>;

// ---------------------------------------------------------------------------
// Backup / Import-Export i dades persistides
// ---------------------------------------------------------------------------

export const BackupSchema = z.object({
  version: z.number().default(2),
  exported_at: z.string().default(""),
  stoves: z.array(StoveSchema).default([]),
});

export type Backup = z.infer<typeof BackupSchema>;

/** Esquema tolerant per al JSON estàtic d'assets (només la llista de fornets). */
export const StovesSeedSchema = z.array(StoveSchema);
