# Modern Theme: Implementation Plan

Companion to `THEMING_PLAN.md`. That doc establishes the runtime theme-swap mechanism
(`[data-theme="…"]`, three-layer token model, semantic CSS variables). This doc covers
adding **`modern`** as the third theme alongside `light`/`dark`, sourced from Figma.

## Runtime foundation (merged from `f/cssvar-theming`)

The modern theme is built **on top of** the `f/cssvar-theming` work (merged into this branch).
That branch moves color resolution from compile-time SCSS → **runtime CSS variables**, which is
what makes on-the-fly theme swapping possible. Key pieces the modern theme must honor:

- **`getColor()`/`getTintColor()`/`getShadeColor()`/`getContrastColor()`/`getPaleColor()`**
  (`scss/mixins.scss`) now return `var(--color-<name>)` references (via `getCssVarname`), not
  baked hex. So components emit `var(--color-ocean)` — a runtime hook. The modern theme restyles
  them by **overriding that same `--color-*` var contract** under `[data-theme="modern"]`.
- **`makeVarNames`** (`color/util.js`) generates the `var(--…)` token set; `build.mjs` filters
  the `varNames` helper tokens out of CSS (SCSS-only).
- **Live color math** (CSS relative-color syntax): `darkenLive`/`brightenLive`/`saturateLive`/
  `adjustOpacity`, and `elevate`/`recede` (brighten-in-light / darken-in-dark via
  `--bg-fade-multiplier`). Component hover/active/disabled states are computed from base vars at
  runtime — so the modern theme inherits those derived states **for free** once base vars are set
  to modern values. This materially shrinks the Track-2 migration surface for state colors.

**Implication for the modern theme:** the Layer-2→3 mapping (novo-elements `themes/modern.scss`)
must map modern tokens onto **the cssvar contract names** components actually read
(`--color-*`, the semantic vars, and `--bg-fade-multiplier` for the light-mode elevate/recede
direction) — not only modern's own native names. A future `modern-dark` flips
`--bg-fade-multiplier` and overrides the same contract.

## Status

- ✅ **Extraction complete.** Source + artifacts live in `src/tokens/modern/`:
  - `subatomic.figma-export.json` — **source of truth**; raw Figma export, read directly by `build.mjs`
  - `components.figma-export.json` — Tier-3 component tokens (not yet wired)
  - `variables-modern.preview.css` — **resolved** snapshot of the generated output (regenerate via `npm run build`)
  - `README.md` / `NAMING_ALIGNMENT.md` — structure, naming map, alignment review
- ✅ **Build wiring done** — `build.mjs` `buildModern()` emits `css/variables-modern.css`; exports added.
- ✅ **novo-elements** `themes/modern.scss` + `NovoTheme` `data-theme` hook done (branch `f/modern-theming`).

## What the extraction told us

| Fact | Implication |
|------|-------------|
| 356 tokens, 3 collections (`core` 61 / `Tier 1` 148 / `Tier 2` 147), **0 unresolved aliases** | Clean, complete, themeable source. |
| **One mode per collection** (`Mode 1` / `Default`) | `modern` is a **single theme**, not a light/dark pair. A future `modern-dark` is an *added* mode on Tier 2. |
| Layered aliasing: Tier 2 → Tier 1 → core | True semantic layer; matches `THEMING_PLAN.md`'s 3-layer model. |
| Font family is **Inter** (Novo default: Montserrat) | Theme must override font-family, not just color. |
| Figma alias syntax `{color.border}` == Style Dictionary syntax | Near-direct ingestion; no alias rewriting needed. |
| Tier 1 **reuses many existing Novo primitive names** (`charcoal`, `sand`, `entity/*`, `positive/negative/warning/success`) plus modern-only additions (numeric `core` ramps, `blue/blue-gray`, `subtle`, `medium`, `lightest-blue`, `grayscale/bullhorn-black`) | Low-friction reconciliation; watch for name collisions on shared names with *different values*. |

## Core architectural decision

`THEMING_PLAN.md` models a theme as `value` + `darkValue` **on a shared token**. That works
when themes share one vocabulary. The modern theme does **not** — it has its own complete
semantic structure (`color/content/headline`, `color/background/default`, typography
composites like `typography/button/*`). Forcing it into `modernValue`-per-existing-token
would mean hand-mapping 147 semantic tokens onto Novo's current names and losing fidelity
with Figma.

**Decision: treat `modern` as an independent themed token source that compiles to its own
scoped CSS block**, rather than a third value on every existing token. This:
- preserves a 1:1 relationship with the Figma source (Figma stays the source of truth),
- generalizes the build from "light + dark" to **N themes**,
- leaves `light`/`dark` untouched (no regression risk),
- isolates the consumer-side name mapping into one place (the novo-elements theme file).

### The two-name problem (and the fix)

Components consume Novo's **existing** semantic var names (`--background-main`, `--text-main`,
`--focus`, and the planned `--surface-primary`, `--text-primary`, …). The modern source emits
its **own** names (`--color-content-headline`, `--color-background-default`, …). For a theme
swap to actually restyle components, modern's values must reach the names components read.

**Fix (Layer 2 → Layer 3 mapping):** emit the modern tokens under their native names *and*,
in the novo-elements modern theme file, alias the component-facing variables to them:

```scss
:root[data-theme="modern"] {
  --background-main: var(--color-background-default);
  --text-main:       var(--color-content-headline);
  --text-muted:      var(--color-content-subtle);
  --links:           var(--color-content-link);
  --focus:           var(--color-border-strong);
  --border:          var(--color-border-default);
  /* …one line per consumed semantic var… */
}
```

This keeps the Figma names authoritative while restyling existing components with zero
component edits — exactly the contract `THEMING_PLAN.md` promises.

---

## Phases 1–2 — novo-design-tokens build (✅ as built)

`build.mjs` `buildModern()` generates `css/variables-modern.css`:

1. **Reads the Figma export directly** (`src/tokens/modern/subatomic.figma-export.json`) — one
   reproducible source of truth; no hand-maintained intermediate.
2. Flattens the three collections (core / Tier 1 / Tier 2) into a **flat dotted-path namespace**
   and resolves the cross-tier `{a.b.c}` aliases (multi-level).
3. Applies **px → rem at ÷10** to dimension values; keeps **border-width px**, **font-weight
   unitless**, and the **`round` sentinel (≥999) px**.
4. Emits the block scoped to `[data-theme="modern"], :root.theme-modern`. Names are
   **scope-only** (no prefix) — modern's `--color-*`/`--typography-*`/`--spacing-*` are additive
   under that selector, so they never collide with base tokens.
5. `variables.css` / `variables-dark.css` are unchanged; `package.json` exports
   `./css/variables-modern(.min)` added; `postbuild` minifies it.

**Why not Style Dictionary for modern?** SD uses a single nested token tree, but the modern
aliases assume a flat namespace where tier-1 `color.border` (a leaf) and tier-2 `color.border.*`
(a group) coexist — they collide in one tree. The custom resolver in `buildModern` handles this;
the deliberate divergence is documented in `build.mjs`. (Future option: pre-resolve to a flat
set, then feed SD for transforms/formatting — only worth it if the base formatter gains
behavior modern should inherit.)

**Tier 3** (`components.figma-export.json`) is **not yet wired** — see "What component vars
make sense" analysis; it references a few tokens absent from the current export.

**Acceptance:** `variables-modern.css` is generated; light/dark outputs unchanged; build is green on Node ≥ 22.

## Phase 3 — novo-elements (`f/theming-2`): wire the theme

See `src/tokens/modern/NAMING_ALIGNMENT.md` for the full var-by-var mapping and confirmed
decisions: (a) **keep rem; convert Figma px → rem at ÷10** and re-value shared `--spacing-*`
(`0.8/1.6/2.4/3.2rem`) so components adopt the mockup rhythm; (b) map link/focus +
`--color-positive` structurally but **flag PENDING DESIGN SIGN-OFF**; (c) keep the 10px root
base untouched; border widths stay px, font-weight unitless.

1. Add `projects/novo-elements/src/styles/themes/modern.scss`:
   - `@import 'novo-design-tokens/css/variables-modern';` (brings in the modern vars), and
   - the Layer 2 → Layer 3 **mapping block** (above) under `:root[data-theme="modern"]`,
     including the `--spacing-*` px re-values and the design-pending color mappings (marked),
   - font-family override to **Inter** (load the webfont; verify licensing/availability).
2. `@import './themes/modern';` in `base.scss`.
3. Extend `NovoTheme` (`elements/common/theme/theme-options.ts`):
   - `export type ThemeName = 'light' | 'dark' | 'modern';`
   - have `use()` actually set `document.documentElement.dataset.theme` (and/or toggle the
     `theme-*` class), removing prior theme attrs — today the demo component toggles by hand.
4. Update the demo app theme switcher to offer the third option.

**Acceptance:** setting `data-theme="modern"` on `<html>` restyles already-migrated components
(the 38% on CSS vars) to the modern look, including Inter.

## Phase 4 — validation

- Visual: screenshot key components under each theme; compare modern against Figma
  (`get_screenshot`) once Figma MCP quota allows, else manual.
- Regression: light/dark visuals unchanged.
- Fallback: with modern CSS removed, components still render via light defaults.

---

## Open questions

1. **Var prefix vs selector-only scoping** for modern tokens (Phase 1.3). Recommendation: selector-only unless base+modern must share an element.
2. **Inter webfont delivery** — self-host vs CDN; weights needed: 400/500/600/700/800/900.
3. **Name-collision audit** — ✅ resolved. Shared Tier-1 names carry **identical values** to the base palette (`sand #f4f4f4`, `silver #e2e2e2`, `stone #bebebe`, `ash #a0a0a0`, `slate #707070`, `charcoal #282828`; `positive/success/negative/warning` map to the same core hues). Modern Tier 1 ≈ Novo's existing palette **plus** modern-only additions — the reuse is intentional and safe, so selector-only scoping carries no collision risk for these.
4. **Convergence with `THEMING_PLAN.md`** — long term, should light/dark migrate to the same independent-source model as modern (uniform N-theme build), or stay on the `value`/`darkValue` approach? Modern proves out the N-theme path.
5. **Entity colors** — modern defines `color/entity/*`; reconcile with the existing entity palette and the dark-mode entity-color question already open in `THEMING_PLAN.md`.
