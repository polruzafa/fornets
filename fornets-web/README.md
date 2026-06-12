# Fornets — web

Web estàtica del catàleg de fornets d'alcohol, feta amb [Astro](https://astro.build).
El «CMS» és el sistema de fitxers: cada fornet és un fitxer markdown.

## Desenvolupament

```sh
pnpm install
pnpm dev       # http://localhost:4321/fornets/
pnpm build     # genera dist/
```

## Afegir un fornet

Creeu un fitxer a `src/content/fornets/<nom-del-fitxer>.md` (el nom del fitxer
esdevé l'URL):

```markdown
---
nom: Cremador d'alcohol Trangia
marca: Trangia            # opcional
material: llautó          # alumini | llautó | titani | acer inoxidable | altres
capacitatMl: 125
tempsEbullicio300Min: 8
pesG: 110
mida: Ø 75 × 45 mm
necessitaSuport: true
---

Descripció lliure en markdown.
```

L'esquema es valida en compilar (`src/content.config.ts`): si falta un camp o el
material no és cap dels valors permesos, el build falla i ho indica.

## Desplegament a GitHub Pages

El workflow `.github/workflows/deploy-web.yml` (a l'arrel del repositori) compila
i publica la web a cada push a `main` que toqui `fornets-web/`.

Abans del primer desplegament:

1. A `astro.config.mjs`, poseu el vostre usuari a `site` i el nom del repositori
   a `base` (si el repo es diu `fornets`, ja és correcte).
2. Al repositori de GitHub: **Settings → Pages → Source → GitHub Actions**.
