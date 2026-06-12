# 🔥 Fornets

**Catàleg de fornets d'alcohol** per a excursionistes, trekkers i manetes del gas
casolà. Una eina senzilla i robusta per tenir a mà les especificacions dels fornets
que tens (o que voldries tenir): material, capacitat, temps d'ebullició, pes, mida
i si necessiten suport per a l'olla.

Sense comptes, sense núvol, sense estadístiques. Com un bon fornet: poques peces i
totes necessàries.

## Què hi ha aquí

Aquest repositori és un monorepo amb dues peces independents:

| | Carpeta | Què és | Stack |
|---|---|---|---|
| 📱 | [`fornets-app/`](fornets-app/) | App nativa (iOS/Android), offline-first, per gestionar el teu catàleg personal | Expo SDK 52 · TypeScript · Zustand |
| 🌐 | [`fornets-web/`](fornets-web/) | Web estàtica del catàleg públic, on cada fornet és un fitxer markdown | Astro 5 |

➡️ **La web és en línia a [polruzafa.github.io/fornets](https://polruzafa.github.io/fornets/)**

## Posada en marxa

Cada peça té el seu propi README amb el detall, però en resum:

```bash
# App (cal Expo Go o un simulador iOS/Android)
cd fornets-app && pnpm install && pnpm expo start

# Web (http://localhost:4321/fornets/)
cd fornets-web && pnpm install && pnpm dev
```

## Afegir un fornet a la web

El «CMS» és el sistema de fitxers: creeu un markdown a
`fornets-web/src/content/fornets/` amb el frontmatter de les especificacions i la
descripció al cos. L'esquema es valida en compilar — si hi falta un camp, el build
avisa. Vegeu el [README de la web](fornets-web/README.md) per a la plantilla.

## Desplegament

La web es publica sola: cada push a `main` que toqui `fornets-web/` dispara el
workflow de GitHub Actions ([`deploy-web.yml`](.github/workflows/deploy-web.yml)),
que compila el lloc i el desplega a GitHub Pages.

## Per què «fornets»?

*Fornet* és com en català es coneix el fogonet d'alcohol de campament: lleuger,
silenciós, sense peces mòbils i gairebé indestructible. Aquest projecte aspira a
la mateixa filosofia.
