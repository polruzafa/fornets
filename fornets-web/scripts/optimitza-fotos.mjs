/**
 * Optimitza les fotos de fornets per al web.
 *
 * Llegeix les fotos crues de `raw/`, les retalla al quadrat centrat (el
 * catàleg fa servir escenaris 1:1), les redueix a 1600 px com a màxim,
 * n'elimina les metadades (EXIF, GPS inclòs) i les desa com a WebP a
 * `src/assets/fornets/`. Els originals de `raw/` no es toquen ni es committen.
 *
 * Ús:  pnpm fotos
 * Després, al frontmatter de la fitxa:
 *   imatge: ../../assets/fornets/<nom>.webp
 *   imatgeAlt: <descripció de la foto>
 */
import { mkdir, readdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);

const ARREL = new URL('..', import.meta.url).pathname;
const ENTRADA = path.join(ARREL, 'raw');
const SORTIDA = path.join(ARREL, 'src/assets/fornets');

const COSTAT_MAX = 1600;
const QUALITAT = 82;
const FORMATS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.heic', '.heif']);

/** sharp no llegeix HEIC; en macOS els convertim primer amb `sips` (natiu). */
async function preparaEntrada(fitxer) {
  if (!/\.heic$|\.heif$/i.test(fitxer)) return fitxer;
  const temporal = path.join(tmpdir(), `${path.parse(fitxer).name}-${process.pid}.jpg`);
  await run('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '95', fitxer, '--out', temporal]);
  return temporal;
}

async function optimitza(nom) {
  const origen = path.join(ENTRADA, nom);
  // Nom de sortida en kebab-case, sense accents ni espais.
  const llimat = path
    .parse(nom)
    .name.toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const desti = path.join(SORTIDA, `${llimat}.webp`);

  // No repeteixis la feina si la sortida ja és més nova que l'original.
  const [estatOrigen, estatDesti] = [await stat(origen), await stat(desti).catch(() => null)];
  if (estatDesti && estatDesti.mtimeMs > estatOrigen.mtimeMs) {
    return { desti, omes: true };
  }

  const entrada = sharp(await preparaEntrada(origen)).rotate(); // aplica l'orientació EXIF
  const { width, height } = await entrada.metadata();
  const costat = Math.min(width, height, COSTAT_MAX);

  // `cover` centrat = retall quadrat cap al centre. Les metadades no es copien.
  await entrada
    .resize(costat, costat, { fit: 'cover', position: 'centre' })
    .webp({ quality: QUALITAT })
    .toFile(desti);

  return { desti, costat };
}

const fitxers = (await readdir(ENTRADA).catch(() => null))?.filter((f) =>
  FORMATS.has(path.extname(f).toLowerCase())
);

if (!fitxers?.length) {
  console.log(`Cap foto per optimitzar. Deseu els originals a ${path.relative(process.cwd(), ENTRADA)}/`);
  process.exit(0);
}

await mkdir(SORTIDA, { recursive: true });

for (const nom of fitxers) {
  try {
    const { desti, costat, omes } = await optimitza(nom);
    const relatiu = path.relative(ARREL, desti);
    console.log(omes ? `— ${nom} ja era al dia (${relatiu})` : `✓ ${nom} → ${relatiu} (${costat}×${costat})`);
  } catch (error) {
    console.error(`✗ ${nom}: ${error.message}`);
    process.exitCode = 1;
  }
}
