# novo-design-tokens — multi-theme architecture refactor (proposed major release)

**Status:** plan, not executed. **Goal:** replace the current *two disjoint token systems* with one
coherent, industry-standard, **tiered + multi-theme** structure so `bh2022`, `bh2026`, and the next
`bh<YYYY>` coexist meaningfully and a new theme is added by a fixed recipe — not bolted on.

Companion to `THEME_GENERATIONS_PLAN.md` (that plan owns the **naming convention** `bh<YYYY>` and the
**app-side** wiring; this plan owns the **tokens-repo structure + build**).

---

## 1. The problem — two bolted-together systems

Today the repo runs **two parallel, differently-shaped token pipelines**:

| | Classic (`bh2022`) | Refresh (`bh2026`) |
|---|---|---|
| Source | hand-authored **JS modules** `src/tokens/**` (`value`/`darkValue`) | **Figma DTCG export** `src/themes/bh2026/subatomic.figma-export.json` (`$value`, 3-tier) |
| Build | **Style Dictionary v5** | a **custom `buildBh2026()`** resolver in `build.mjs` (bypasses SD) |
| Output | `css/variables.css` (`:root`) + `variables-dark.css` (`:root.theme-dark`) + `scss/` + `lib/` | `css/variables-bh2026.css` (`[data-theme="bh2026"]`) |
| Theming | `value` vs `darkValue` pairs | `data-theme` scoping |
| Components | `src/components/**` (SD) | `components.figma-export.json` (**unused** — not wired in) |

Two source formats, two build engines, two theming models, two output conventions. Adding `bh2030`
means a **third** bolt-on. A new engineer has to learn both worlds and can't tell where a theme "lives."

---

## 2. Target architecture (industry standard)

Adopt the widely-used **layered, multi-theme** model (Style Dictionary multi-brand pattern + DTCG +
3-tier token architecture + a theme manifest à la Tokens Studio `$themes.json`):

**Principles**
1. **One source format — DTCG** (`$value`/`$type`). The Figma export is already DTCG; migrate classic onto it.
2. **Three tiers**: **core** (primitives, theme-agnostic) → **semantic** (roles, per-theme) → **component** (per-theme).
3. **Two theme shapes** (deliberate — see §8.6): **hand-authored themes** share `src/core` primitives +
   add their own `semantic` (+ optional `components`); **Figma-sourced themes are self-contained** — each
   carries its own primitives from its Figma export (parsed at build) rather than referencing `src/core`.
4. **A theme manifest** is the single source of truth (which sets compose each theme, its selector, its modes).
5. **One build engine** — Style Dictionary, looping the manifest. Retire the custom resolver.
6. **Preserve the scss consumption contract** — `getColor()`/`getTint*()`/live math (`darkenLive`/`elevate`/
   `theme-backgrounds-live`) keep reading the same `--color-*` var names; only what *sets* them changes.

**Proposed tree**
```
src/
  core/                     # Tier 1 — primitives, theme-agnostic (DTCG)
    color.json  spacing.json  size.json  typography.json  effect.json
  themes/
    bh2022/
      semantic.json         # Tier 2 (background/content/border → core)  [light]
      semantic.dark.json    # dark-mode overlay (or a DTCG mode)
      components.json        # Tier 3 (button/card/... → semantic)
    bh2026/
      subatomic.figma-export.json     # Figma source of truth (parsed in-memory; NOT hand-edited)
      components.figma-export.json    # Figma Tier-3 source of truth
    <bh2030>/ ...                     # Figma-sourced themes keep their raw export here
  manifest.mjs              # [{ name, isBase, selector, modes, sets:[...] }]  ← single source of truth
scss/                      # unchanged consumption layer (getColor, mixins, live math)
build/ (or css/, lib/)     # generated (gitignored)
  css/  bh2022.css  bh2022-dark.css  bh2026.css  ...   # each scoped per its selector
```

**The manifest** drives everything (build outputs, and can be published for consumers):
```js
export const THEMES = [
  { name: 'bh2022', isBase: true,  selector: ':root',                    modes: ['light','dark'],
    sets: ['core', 'themes/bh2022/semantic', 'themes/bh2022/components'] },
  { name: 'bh2026', isBase: false, selector: ':root[data-theme="bh2026"]', modes: ['light'],
    sets: ['core', 'themes/bh2026/semantic', 'themes/bh2026/components'] },
];
```

**One build** (`build.mjs`): loop `THEMES` → for each, Style Dictionary merges `core` + the theme's sets
(tiers resolve in order: core → semantic → component) → emit `css/<name>.css` scoped to `selector`
(+ `-dark` per mode), plus `scss`/`lib` for the base theme. Adding a theme = one manifest entry + its dir.

---

## 3. Why this is the right (standard) shape
- **Style Dictionary multi-brand/theme** is the de-facto standard for exactly this (shared core + per-theme configs/loop).
- **DTCG** (`$value`/`$type`) is the W3C direction; consolidating on it kills the dual-format tax and matches the Figma pipeline.
- **3-tier layering** (primitive → semantic → component) is the consensus model (Material, Tokens Studio, Brad Frost); it makes "where does a theme diverge?" obvious (almost always the semantic tier).
- **A manifest** mirrors Tokens Studio `$themes.json`/`$metadata.json` — the recognized way to declare theme composition.

## 4. Resolving the two things that forced the bolt-on
1. **The flat-alias collision** (why `buildBh2026` bypassed SD: tier-1 `color.border` leaf vs tier-2
   `color.border.*` group collide in SD's single tree). Fix with a **Style Dictionary custom parser /
   preprocessor** that normalizes the Figma export **in-memory at build time** — de-colliding namespaces
   (primitives under `color.palette.*` / `color.core.*`, semantic under `color.<role>.*`) and rewriting the
   aliases accordingly. This is exactly what `buildBh2026()` does today, re-homed as a standard SD extension;
   the standalone resolver is retired but the capability is not.

   > 🔑 **Figma forward-generation is preserved.** The raw Figma export
   > (`subatomic.figma-export.json` + `components.figma-export.json`) stays the **committed source of truth**;
   > the parser reads it directly. The workflow is unchanged — **re-export from Figma → drop the JSON →
   > `npm run build`.** No manual "ingest" step, no hand-edited intermediate, nothing lossy. The parser is
   > reusable, so any future Figma-sourced theme (`bh2030`) gets the same drop-in regeneration for free.
   > (Hand-authored themes like `bh2022` simply don't use the parser — they're DTCG source directly.)
2. **Classic's `value`/`darkValue`** → becomes a **theme with light/dark modes** (`themes/bh2022/semantic.json`
   + `semantic.dark.json`), built by the same loop. `:root`/`:root.theme-dark` selectors preserved.

---

## 5. Migration (phased → one major release `1.0.0`)
- **P1 — scaffolding (non-breaking):** add `src/core/`, `src/themes/`, `manifest.mjs`, and the SD multi-theme
  loop *alongside* today's build; keep emitting the current filenames so nothing downstream breaks yet.
- **P2 — bh2026 via the SD parser ✅ DONE:** the flat-alias/de-collide logic now lives in a reusable SD custom
  parser (`figma/subatomic` in `build.mjs`) that reads the committed Figma export directly (no intermediate file);
  bh2026 builds through a per-theme `new StyleDictionary(...)` instance (opted in via `parsers: [...]`) using a
  thin `figma/css-vars` format for the selector; the standalone `buildFigmaTheme()` resolver is deleted. Output
  is **value-identical** to P1 (377 tokens, 0 unresolved — verified by a normalized `--var: value` set diff) and
  re-exporting from Figma + rebuild still works end-to-end (the parser reads the committed export in-memory).
- **P3 — migrate classic → bh2022 ✅ DONE:** the classic JS modules are converted to tiered DTCG source —
  primitives in `src/core/{color,size,typography,border,effect}.json`, semantic + components in
  `src/themes/bh2022/{semantic,components}.json` (which reference core). The base build reads its ordered
  sources from `manifest.mjs` (`BASE_THEME.sources`) with `usesDtcg: true`. **Decision (freeze):** the
  `polished`-computed color scales (`shade/tint/contrast/pale/varNames`) are frozen as literals and the
  `polished`/`chroma-js`/`change-case` deps removed — bh2022 is the stable legacy theme, so live
  regeneration has no value. **`$type` is intentionally omitted** (typing triggers SD transforms that
  normalize values — `#fff`→`#ffffff` etc. — which would change output). Dark mode stays a `darkValue`
  sibling on the four `background` roles (SD resolves it; the `css/dark` format swaps it into `$value`) —
  simpler than a separate overlay for a 4-token surface. **All six outputs are byte-identical** to the
  pre-P3 build (`variables.css`, `variables-dark.css`, `scss/variables.scss`, `lib/variables.json`, and
  `lib/variables.{js,esm.js}` modulo the regenerated timestamp). Old `src/tokens/**` (classic) + `src/components/**` deleted.
- **P4 — new exports + cut the major:** ✅ *tokens-repo mechanics done* — per-theme output files
  (`css/bh2022.css`, `css/bh2022-dark.css`, `css/bh2026.css` + `.min`), per-theme export subpaths
  (`./css/bh2022`, `./css/bh2026`, …), the old flat exports kept as **deprecated aliases** pointing at the
  new files, and a published theme registry at `./manifest` (`lib/manifest.json`, emitted by `build.mjs`).
  New files are byte-identical to the old ones (just renamed). *Remaining (release/coordination — human):*
  land this with a `BREAKING CHANGE:` commit footer so semantic-release cuts `1.0.0`, then bump the
  `novo-design-tokens` dep in novo-elements + novo. No consumer code changes are required to keep working
  (the deprecated aliases preserve every documented import path); the dep bump + eventual alias removal is
  the migration.
- **P5 — bh2026 Tier-3 components (deferred, near-term):** wire `src/themes/bh2026/components.figma-export.json`
  into the build once the design stabilizes (currently in flux). Scope when ready:
  1. Add a `componentsSource` field to the bh2026 manifest entry (the committed export path).
  2. Extend/generalize the `figma/subatomic` parser (or add a `figma/components` parser) to handle the
     components export shape — it differs from `subatomic`: a single `modes.default` root, and leaves carry
     `$scopes`/`$type`/`$libraryName`/`$collectionName` metadata. Reuse the same resolve + de-collide logic.
  3. **Validate cross-refs:** its aliases (e.g. `{spacing.padding.xxsm}`) must resolve against the subatomic
     namespace — confirm the names exist (they may need normalization) before shipping.
  4. Emit `--<component>-*` appended under the bh2026 selector (same `figma/css-vars` format/file).
  Additive and low-risk; no consumer breakage. Until then bh2026 ships tokens only (today's behavior).

## 6. Exports & versioning (the breaking part)
Move from flat per-file exports to a per-theme scheme, e.g.:
```
"./css/<theme>"        -> ./css/<theme>.css        (e.g. ./css/bh2026)
"./css/<theme>.min"    -> ./css/<theme>.min.css
"./scss"               -> ./scss/_index.scss       (unchanged — the consumption layer)
"./manifest"           -> ./lib/manifest.js         (publish the theme list for consumers)
"."                    -> ./lib/variables.(esm.)js  (base theme JS — unchanged)
```
Keep the old `./css/variables`, `./css/variables-dark`, `./css/variables-bh2026` as **deprecated aliases**
for one major cycle (point them at the new files) so consumers migrate without a flag day; drop in the next major.

## 7. Adding a future theme (`bh2030`) — the payoff
1. `src/themes/bh2030/{semantic,components}.json` (DTCG; `core` stays shared).
2. One entry in `manifest.mjs`.
3. `npm run build` → `css/bh2030.css` (`[data-theme="bh2030"]`) + the export is generated from the manifest.
No new build code, no bespoke resolver, no format decision — it's additive.

## 8. Decisions

**Resolved:**
1. **Build engine → Style Dictionary (unified).** Retire the standalone `buildBh2026()` resolver; everything
   builds through SD's multi-theme loop, with the Figma de-collide re-homed as a reusable **SD custom parser**
   (§4.1). **Figma forward-generation is preserved** (drop a fresh export → rebuild).
2. **Classic → full DTCG migration.** Convert the classic JS modules to DTCG (`$value`/`$type`) in the
   `core/` + `themes/bh2022/` structure. One source format everywhere.
3. **Base model → `bh2022` is the implicit `:root` base** (Phase A); other themes are `[data-theme]`
   overrides. Lower risk, matches the current app; §2 `manifest.mjs` `isBase: true` reflects this.
6. **Core is shared only among hand-authored themes; Figma themes are self-contained.** `bh2022` uses
   `src/core/**`; `bh2026` (and future Figma themes) carry their own primitives from the Figma export — we
   do **not** rebase them onto `src/core`. Rationale: the Figma file *is* the theme's source of truth
   (primitives included), and forward-generation (re-export → rebuild) must stay lossless; forcing a Figma
   theme to reference `src/core` would split its source across Figma + hand-authored JSON and break that
   guarantee. The shared-core ideal (§2.3) therefore applies to hand-authored themes; Figma themes trade
   primitive-sharing for a clean, self-contained regeneration path. The common contract is the emitted
   `--*` CSS var names (consumed by the scss layer), not a shared source tier.

**Resolved (cont.):**
4. **Dark modes → `darkValue` sibling on the semantic tokens** (not a separate overlay file). bh2022's
   dark surface is tiny (4 `background` roles); SD resolves the `darkValue` reference and the `css/dark`
   format swaps it into `$value`. Simpler than a second build for 4 tokens; revisit if a theme grows a
   large dark palette (then a `semantic.dark.json` overlay is the move).

**Deferred:**
5. **Component (Tier-3) tokens for bh2026 → deferred, near-term.** `components.figma-export.json` is committed
   as the source of truth but **not wired into the build** — the design is still in flux (designer actively
   iterating). Wire it in once the export stabilizes; it's a small, additive change (see §5.P5 below). Until
   then bh2026 ships tokens only (no `--<component>-*`), which is exactly today's behavior.

## 9. Consumer impact
novo-elements consumes `scss` (getColor/mixins — **unchanged**) and the per-theme CSS; novo consumes the CSS.
The scss contract is preserved; the **only** breaking change is the per-theme CSS export rename (mitigated by the
deprecated aliases in §6). Coordinate the major bump with the novo-elements/novo dep refs.
