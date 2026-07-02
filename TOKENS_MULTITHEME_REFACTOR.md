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
| Source | hand-authored **JS modules** `src/tokens/**` (`value`/`darkValue`) | **Figma DTCG export** `src/tokens/bh2026/subatomic.figma-export.json` (`$value`, 3-tier) |
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
3. **Shared core, per-theme overlays**: every theme = `core` + its own `semantic` (+ optional `components`).
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
      semantic.json         # ingested from the Figma Tier-2 export
      components.json        # ingested from components.figma-export.json
    <bh2030>/ ...
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
   `color.border.*` group collide in SD's single tree). Fix at **ingest**: normalize the Figma export into
   clean tiers with non-colliding namespaces — primitives under `color.palette.*` / `color.core.*`, semantic
   under `color.<role>.*`. Then standard SD reference resolution works; the custom resolver is retired.
   (An `ingest` script converts a raw Figma export → the `themes/<name>/*.json` DTCG files.)
2. **Classic's `value`/`darkValue`** → becomes a **theme with light/dark modes** (`themes/bh2022/semantic.json`
   + `semantic.dark.json`), built by the same loop. `:root`/`:root.theme-dark` selectors preserved.

---

## 5. Migration (phased → one major release `1.0.0`)
- **P1 — scaffolding (non-breaking):** add `src/core/`, `src/themes/`, `manifest.mjs`, and the SD multi-theme
  loop *alongside* today's build; keep emitting the current filenames so nothing downstream breaks yet.
- **P2 — ingest bh2026:** convert the Figma export → `themes/bh2026/{semantic,components}.json` (DTCG, de-collided);
  build bh2026 through the loop; delete `buildBh2026()`. Verify `css/bh2026.css` is byte-equivalent (377 tokens, 0 unresolved).
- **P3 — migrate classic → bh2022:** extract primitives to `core/`; move semantic/component into `themes/bh2022/`
  (`darkValue` → `semantic.dark.json`); build via the loop. Verify `variables.css`/`-dark.css` unchanged.
- **P4 — new exports + cut the major:** switch to a consistent per-theme export scheme (below), deprecate the old
  flat exports, and release `1.0.0` (semantic-release `BREAKING CHANGE:`). Coordinate novo-elements + novo dep bumps.

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
1. **Build engine → Style Dictionary (unified).** Retire the custom `buildBh2026()` resolver; everything
   builds through SD's multi-theme loop. Requires de-colliding the Figma tiers at **ingest** (§4.1).
2. **Classic → full DTCG migration.** Convert the classic JS modules to DTCG (`$value`/`$type`) in the
   `core/` + `themes/bh2022/` structure. One source format everywhere.
3. **Base model → `bh2022` is the implicit `:root` base** (Phase A); other themes are `[data-theme]`
   overrides. Lower risk, matches the current app; §2 `manifest.mjs` `isBase: true` reflects this.

**Still open (recommendations):**
4. **Dark modes → per-theme `*.dark.json` overlays** (recommended): simplest with SD v5, emits the existing
   `:root.theme-dark` contract; DTCG `$modes` is newer/less-supported. (`themes/bh2022/semantic.dark.json`.)
5. **Component (Tier-3) tokens → wire in now** (recommended): `bh2026` already has `components.figma-export.json`,
   and the tiered model expects it; emit `--<component>-*` under the theme selector. Additive, so it *could*
   defer if it risks the P2 timeline.

## 9. Consumer impact
novo-elements consumes `scss` (getColor/mixins — **unchanged**) and the per-theme CSS; novo consumes the CSS.
The scss contract is preserved; the **only** breaking change is the per-theme CSS export rename (mitigated by the
deprecated aliases in §6). Coordinate the major bump with the novo-elements/novo dep refs.
