/** Funcions pures de format. Locale fixat a català. */

const LOCALE = "ca-ES";

export function formatNumber(value: number, maxDecimals = 1): string {
  return new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits: maxDecimals,
  }).format(value);
}

export function formatMl(value: number): string {
  return `${formatNumber(value)} ml`;
}

export function formatGrams(value: number): string {
  return `${formatNumber(value, 0)} g`;
}

/** Segons → "m:ss" (temps per bullir 300 ml). p. ex. 270 → "4:30". */
export function formatBoilTime(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** "m:ss" → segons. També accepta un nombre sol (s'interpreta com a minuts). NaN si no és vàlid. */
export function parseBoilTime(text: string): number {
  const t = text.trim();
  const mss = t.match(/^(\d{1,3}):([0-5]?\d)$/);
  if (mss) return Number(mss[1]) * 60 + Number(mss[2]);
  if (/^\d{1,4}$/.test(t)) return Number(t) * 60;
  return Number.NaN;
}
