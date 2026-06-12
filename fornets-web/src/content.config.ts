import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const fornets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fornets' }),
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      marca: z.string().optional(),
      material: z.enum(['alumini', 'llautó', 'titani', 'acer inoxidable', 'altres']),
      // En segons, per poder mostrar mm:ss exacte. Opcional: la fitxa pot
      // arribar abans que la prova («pendent» a la web).
      tempsEbullicio300S: z.number().positive().optional(),
      pesG: z.number().positive(),
      mida: z.string(),
      necessitaSuport: z.boolean(),
      // Si el fornet funciona o és una baixa (avariat, cremat, jubilat…).
      funciona: z.boolean().default(true),
      // Foto opcional; si no n'hi ha, es dibuixa la silueta a escala a partir de `mida`.
      imatge: image().optional(),
      imatgeAlt: z.string().optional(),
    }),
});

export const collections = { fornets };
