/**
 * Generador d'identificadors únics sense dependències externes.
 * Combina timestamp en base36 + entropia aleatòria; suficient per a ús local.
 */
export function createId(prefix = "id"): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${time}${rand}`;
}
