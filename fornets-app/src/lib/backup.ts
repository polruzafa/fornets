import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { type Backup, BackupSchema } from "@/schemas";
import { normalizeLegacy } from "@/lib/legacy";
import { buildBackup } from "@/store/useStore";

export type ImportResult =
  | { ok: true; backup: Backup }
  | { ok: false; reason: "cancelled" }
  | { ok: false; reason: "invalid"; message: string };

/**
 * Exporta tot l'estat a un fitxer JSON i obre el diàleg de compartir del sistema.
 * Retorna la URI del fitxer generat.
 */
export async function exportBackup(): Promise<string> {
  const now = new Date().toISOString();
  const backup = buildBackup(now);
  const json = JSON.stringify(backup, null, 2);

  const stamp = now.replace(/[:.]/g, "-");
  const fileUri = `${FileSystem.cacheDirectory}fornet-backup-${stamp}.json`;
  await FileSystem.writeAsStringAsync(fileUri, json, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: "application/json",
      dialogTitle: "Exportar còpia de seguretat de Fornet",
      UTI: "public.json",
    });
  }
  return fileUri;
}

/**
 * Obre el selector de fitxers, llegeix el JSON i el valida amb Zod.
 * No modifica l'estat: retorna el backup perquè qui crida decideixi.
 */
export async function importBackup(): Promise<ImportResult> {
  const picked = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
  });

  if (picked.canceled || picked.assets.length === 0) {
    return { ok: false, reason: "cancelled" };
  }

  try {
    const asset = picked.assets[0];
    if (!asset) return { ok: false, reason: "cancelled" };

    const raw = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    // Passem pel normalitzador per acceptar també backups antics (claus en castellà).
    const parsed = BackupSchema.parse(normalizeLegacy(JSON.parse(raw)));
    return { ok: true, backup: parsed };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "El fitxer no té un format vàlid.";
    return { ok: false, reason: "invalid", message };
  }
}
