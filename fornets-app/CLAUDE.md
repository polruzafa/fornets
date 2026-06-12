# Fornet

Offline-first, **native-only** (iOS/Android) Expo/React Native app (UI text in **Catalan**)
for **cataloging alcohol camping stoves** — recording stove models and their specs
(material, max capacity, time to boil 300 ml, weight, size, needs-a-pot-stand). No usage
logging, no stats.
No backend; all state persists locally via Zustand + AsyncStorage. Stack: Expo SDK 52,
expo-router, a **custom theme system** in `src/theme` (StyleSheet + `useTheme`, no
Tailwind/NativeWind), Zod + react-hook-form. See `README.md` for architecture, data models,
and the schema backward-compatibility rules.

## Design Context

### Users
Hobbyists who own and collect **alcohol camping stoves** (fornets d'alcohol) — backpackers,
trekkers, and gear tinkerers, mostly Catalan-speaking. The job is to **keep a catalog** of
the stoves they own or covet and their specs: at home, adding/curating entries and comparing
models; and in the field — often outdoors, low light, on the move — quickly checking a
stove's specs or **adding a new one**. Tasks to be done: add a stove, browse/search the
catalog, view a stove's spec sheet.

### Brand Personality
**Rugged · grounded · dependable.** Voice is plain, practical, and confident — like good
trail gear that just works. No marketing gloss, no cuteness. It should feel like a tool a
serious hobbyist trusts in their pack: warm and earthy, never sterile or corporate.
Emotional goal: quiet confidence and a sense of being well-equipped.

### Aesthetic Direction
- **Earthy outdoor palette.** Styling is a **custom theme system** in `src/theme`
  (`StyleSheet` + `useTheme()`, no Tailwind/NativeWind). The `brand` scale is forest green
  (`brand-500 #357a42`, `brand-600 #2a6235` for buttons), paired with slate neutrals and
  warm tones — a trail/gear aesthetic. A warm `ember` scale (`ember-500 #f97316`) carries
  the flame/fire identity (flame icons, key accents). Always pull colors from
  `useTheme().colors` (semantic tokens) — never hardcode hex in components. Add new colors
  to `palette` + the `lightColors`/`darkColors` token maps so both modes stay in sync.
- **Dark-first.** Optimize for dark mode (night and outdoor use); light mode is the
  well-supported secondary. Auto-follows the system via `useColorScheme()` in both modes.
- **Tactile, sturdy surfaces, used sparingly.** Rounded-2xl cards, clear borders, generous
  touch targets are the baseline — but the card treatment is reserved for the element that
  matters most on a screen, so it reads as a focal point (e.g. the spec sheet on the stove
  detail). Secondary data goes flat: divided strips, not grids of identical cards.
- **One accent per screen.** Two-color system: forest green = interactive (buttons, links,
  active chips), ember = the flame/fire identity (the stove flame icon). Use ember sparingly
  — avoid rainbow tinting where color encodes nothing.
- **Anti-references:** avoid clinical/corporate fintech blue, glossy gradients, playful
  cartoon styling, and dense data-dashboard clutter. It is a field tool, not a SaaS app.

### Design Principles
1. **Field-first legibility.** Assume sunlight, low light, and motion. High contrast,
   large tap targets, a stove's key specs readable at a glance.
2. **Earthy, not corporate.** Lead with greens/slate/warm neutrals and an ember accent;
   the palette should feel like gear, not a banking app.
3. **Adding & finding is one-tap fast.** The core loop — add a stove, search/browse the
   catalog, open a spec sheet — must be the shortest path. Don't bury it behind chrome.
4. **Honest and plain.** Catalan copy stays practical and direct; surface the specs
   clearly rather than dressing them up. Trust over flourish.
   Follow the **Softcatalà style guide** for all Catalan strings
   (https://www.softcatala.org/guia-estil-de-softcatala/tota-la-guia/): sentence case,
   ellipsis "…", guillemets «», vós-form for instructions to the user, no "si us plau".
   Translations for **es/en** are planned — keep new strings translation-ready, not
   buried inline.
5. **Sturdy and offline-proof.** Everything works without a network; states (empty,
   loading, error) are handled so the tool never leaves the user stranded.
