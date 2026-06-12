import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const fornets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fornets' }),
  schema: z.object({
    nom: z.string(),
    marca: z.string().optional(),
    material: z.enum(['alumini', 'llautó', 'titani', 'acer inoxidable', 'altres']),
    capacitatMl: z.number().positive(),
    tempsEbullicio300Min: z.number().positive(),
    pesG: z.number().positive(),
    mida: z.string(),
    necessitaSuport: z.boolean(),
  }),
});

export const collections = { fornets };
