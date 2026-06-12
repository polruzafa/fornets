/**
 * Valors d'enumeració (neutres respecte l'idioma) + etiquetes en català.
 * Es desa la clau ("titanium", "small"…), no l'etiqueta, perquè quan s'afegeixin
 * les traduccions (ca/es/en) només calgui canviar aquests mapes.
 */

export const MATERIALS = [
  "titanium",
  "aluminium",
  "stainless_steel",
  "brass",
  "other",
] as const;
export type Material = (typeof MATERIALS)[number];

const MATERIAL_LABELS: Record<Material, string> = {
  titanium: "Titani",
  aluminium: "Alumini",
  stainless_steel: "Acer inox.",
  brass: "Llautó",
  other: "Altre",
};

export const materialLabel = (m: Material): string =>
  MATERIAL_LABELS[m] ?? MATERIAL_LABELS.other;

export const SIZES = ["small", "medium", "large"] as const;
export type Size = (typeof SIZES)[number];

const SIZE_LABELS: Record<Size, string> = {
  small: "Petit",
  medium: "Mitjà",
  large: "Gran",
};

export const sizeLabel = (s: Size): string => SIZE_LABELS[s] ?? SIZE_LABELS.medium;
