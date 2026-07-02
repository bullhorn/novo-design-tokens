# Novo Design Tokens

Design tokens for the Novo Design System (Bullhorn). Transforms token definitions into consumable CSS, SCSS, JS/ESM, and JSON outputs using Style Dictionary v5.

## Quick Reference

```bash
npm install        # Install dependencies
npm run build      # Build all token outputs (runs build.mjs + postcss + minify)
```

Requires **Node.js >= 22.0.0** (Style Dictionary v5 requirement).

## Architecture

```
src/core/          → bh2022 primitives (DTCG $value): color, size, typography, border, effect — theme-agnostic
src/themes/bh2022/ → bh2022 semantic (background, +dark) + components (button, tooltip) — reference core
src/tokens/bh2026/ → bh2026 (modern): Figma exports (source of truth) + docs (tiered model)
manifest.mjs       → Theme registry (single source of truth): bh2022 (dtcg base) + bh2026 (figma)
build.mjs          → Style Dictionary v5 config + custom formatters + `figma/subatomic` parser (ESM, async)
scss/              → Hand-authored SCSS utilities (mixins, functions) + generated variables
css/               → Generated CSS custom properties (light + dark + bh2026)
lib/               → Generated JS (CJS + ESM) and JSON
```

> Both themes now build through **Style Dictionary from DTCG source** (`$value`). bh2022 is a
> tiered DTCG theme (`src/core` + `src/themes/bh2022`); bh2026 is parsed from its Figma export
> via the `figma/subatomic` parser. See **Theming Architecture** below before adding tokens or
> touching the build.

### Build Pipeline

`build.mjs` uses Style Dictionary v5. The **base theme (bh2022)** reads its ordered DTCG sources from
`manifest.mjs` (`BASE_THEME.sources`) and outputs 5 platforms: css (light + dark), scss, js, mjs, json.
Each **figma theme** (bh2026) builds via its own `StyleDictionary` instance using the `figma/subatomic`
parser + `figma/css-vars` format. PostCSS (autoprefixer) and clean-css run after to produce minified CSS.

### Token Source Format (DTCG)

Tokens are DTCG (`$value`) JSON. References use `"{path.to.token}"` syntax. `$type` is **intentionally
omitted** — SD's type-specific transforms normalize values (e.g. `#fff` → `#ffffff`, dimension rounding),
which would change the frozen output; DTCG values are authored in final CSS form. bh2022's dark mode uses
a non-standard `darkValue` sibling on the four semantic `background` tokens (SD resolves its reference);
the `css/dark` format swaps it into `$value`.

```json
{
  "background": {
    "body": { "$value": "{color.white}", "darkValue": "{color.midnight}" }
  }
}
```

bh2022's derived color scales (`color.shade/tint/contrast/pale/varNames`) are **frozen literals** —
they were computed once (by `polished`) and baked in; the color-math build deps were removed. To change
a bh2022 color you edit the literal(s) directly. New color work happens in bh2026 (Figma). See the P3
notes in `TOKENS_MULTITHEME_REFACTOR.md`.

### Custom Formatters (build.mjs)

- `javascript/esm` — named exports per token category (`minifyDictionary(tokens, true)` for DTCG)
- `javascript/module` — CJS `module.exports` (DTCG)
- `css/dark` — CSS variables using `darkValue` instead of `$value`, delegates to built-in `css/variables`
- `figma/css-vars` — bh2026: emits `--<path>: <value>` under the theme selector (paired with `figma/subatomic` parser)

### Style Dictionary v5 API Notes

- ESM-only (`import StyleDictionary from "style-dictionary"`)
- Async: `await sd.buildAllPlatforms()`
- Format functions receive `{ dictionary, platform, options, file }` (not positional args)
- Token data: `dictionary.tokens` (nested), `dictionary.allTokens` (flat array)
- Built-in helpers: `import { minifyDictionary } from "style-dictionary/utils"`
- Access registered formats: `sd.hooks.formats["format-name"]`

## Package Exports

| Import path | Resolves to |
|---|---|
| `novo-design-tokens` | `lib/variables.js` (CJS) or `lib/variables.esm.js` (ESM) |
| `novo-design-tokens/scss` | `scss/_index.scss` (variables + mixins + functions) |
| `novo-design-tokens/css/variables` | `css/variables.css` |
| `novo-design-tokens/css/variables.min` | `css/variables.min.css` |
| `novo-design-tokens/css/variables-dark` | `css/variables-dark.css` |
| `novo-design-tokens/css/variables-bh2026` | `css/variables-bh2026.css` (+ `.min`) |

## How Downstream Projects Use This Package

### novo-elements (component library)

- **Dependency**: `novo-design-tokens@^0.1.4`
- **SCSS import**: `@import 'novo-design-tokens/scss';` for SCSS variables/mixins
- **CSS import**: `@import 'novo-design-tokens/css/variables.min';` for CSS custom properties
- **TypeScript import**: `import { spacing } from 'novo-design-tokens';` in space.directive.ts
- **Theme layer**: Light theme (`styles/themes/light.scss`) maps token values to semantic CSS custom properties like `--background-main`, `--text-muted`, `--focus`
- Components reference CSS variables with fallbacks: `var(--background-main, $color-bright)`

### novo (application)

- **Dependency**: `novo-design-tokens@^0.1.4`
- **Indirect consumption**: Primarily through `novo-elements` — the app imports `novo-elements/styles/variables` which transitively pulls in design tokens
- **Direct consumption**: App styles and `cm-ui` library components use CSS custom properties (`var(--background-main)`, `var(--color-success)`, etc.)
- **Angular config**: `stylePreprocessorOptions.includePaths` includes `node_modules` and `node_modules/novo-elements` to resolve token imports

### Token Flow

```
novo-design-tokens (this repo)
  ↓ SCSS variables + CSS custom properties + JS exports
novo-elements (component library)
  ↓ Maps tokens → semantic CSS variables (themes)
  ↓ Exports component styles with token references
novo (application)
  ↓ Inherits tokens via novo-elements
  ↓ Also uses CSS custom properties directly
```

## Adding Tokens

**bh2022 (base):**
1. Edit the DTCG file for the tier: primitives → `src/core/<category>.json`; semantic/components →
   `src/themes/bh2022/{semantic,components}.json`. Use `$value` (and `"{path.to.token}"` references).
   Do **not** add `$type` (see Token Source Format — it would change the frozen output).
2. If it's a new source file, add it to `BASE_THEME.sources` in `manifest.mjs` (order sets emit order).
3. Run `npm run build` and verify output in `css/`, `scss/`, `lib/`.

**bh2026 (modern):** update the Figma file → re-export `src/tokens/bh2026/subatomic.figma-export.json`
→ `npm run build` (the `figma/subatomic` parser reads it directly).

## Release

Automated via semantic-release v24 on push to main/next/beta/alpha. Commit messages drive version bumps (conventional commits). CI runs in GitHub Actions (`.github/workflows/release.yml`).

Release config: `release.config.mjs` (ESM `export default`).

## Conventions

- Style Dictionary v5 — ESM, async API, DTCG source (`$value`, `usesDtcg: true`)
- Token references use `"{path.to.token}"` curly-brace syntax without `.value` suffix
- `$type` is intentionally omitted (typing triggers value-normalizing transforms — see Token Source Format)
- No production dependencies — everything is devDependencies; consumers get pre-built outputs
- Build script and release config are `.mjs` files (project is not `"type": "module"`)
- No test suite currently exists
- `sass@1.100` emits `@import` deprecation warnings — non-blocking, but `scss/_index.scss` will eventually need `@use`/`@forward` migration (breaking change for consumers)

## Theming Architecture

**Read this before adding tokens or changing the build.** As of the P1–P3 refactor, both themes share
**one source format (DTCG `$value`) and one build engine (Style Dictionary)**, driven by `manifest.mjs`.
The former two-parallel-systems split is resolved; what remains are two *source shapes* feeding the same
pipeline.

### The two themes (today)

1. **bh2022 (base, `:root`).** Tiered DTCG source: primitives in `src/core/**`, semantic + components in
   `src/themes/bh2022/**` (which reference core). Built by the base `StyleDictionary` instance from
   `BASE_THEME.sources` into `css/variables.css` + `variables-dark.css` (+ scss/js/mjs/json). Dark mode
   (four `background` roles) uses a `darkValue` sibling. Its derived color scales
   (`color.shade/tint/contrast/pale/varNames`) are **frozen literals** (once computed by `polished`, now
   baked in — the color-math deps were removed since bh2022 is the stable legacy theme).
2. **bh2026 (modern, `[data-theme="bh2026"]`).** Sourced from the Figma "subatomic" export
   (`src/tokens/bh2026/subatomic.figma-export.json`) — a tiered/semantic/aliased model. Built through SD
   via the `figma/subatomic` custom parser (one `new StyleDictionary(...)` per figma theme, looped from
   `manifest.mjs`) into `css/variables-bh2026.css`.

The `f/cssvar-theming` runtime layer sits on top of both: `getColor()`/`getTint*()`/etc. return
`var(--color-*)` so colors resolve at **runtime**, with live helpers (`elevate()`/`recede()`/`darkenLive()`,
driven by `--bg-fade-multiplier`). This layer is unchanged by the refactor — it reads the same `--color-*`
var names either theme emits.

**Why bh2026 needs a custom parser:** its aliases use a flat namespace where tier-1 `color.border` (a leaf)
and tier-2 `color.border.*` (a group) coexist — they collide in SD's single nested tree. The
`figma/subatomic` parser de-collides + resolves + unit-converts the export in-memory at build time, handing
SD a clean, reference-free token set. **Figma forward-generation is preserved:** the raw export stays the
committed source of truth; re-export → `npm run build`.

### Adding a future theme (bh2030)

`bh2030` is a Figma-sourced theme: drop `src/tokens/bh2030/subatomic.figma-export.json`, add a `figma`
entry to `manifest.mjs` — no new build code (the parser + loop handle it). A hand-authored theme would
follow the bh2022 shape (DTCG tiers under `src/core` shared + `src/themes/bh2030/**`). See
`TOKENS_MULTITHEME_REFACTOR.md` for the full multi-theme plan (remaining: P4 — per-theme export scheme +
`1.0.0` major) and `src/tokens/bh2026/NAMING_ALIGNMENT.md` for the bh2026 var mapping.

### Which theme do I add to? (contributor guidance)

- **bh2026 values** → update Figma → re-export `src/tokens/bh2026/subatomic.figma-export.json`.
  Component-level → `components.figma-export.json` (not yet wired into the build).
- **bh2022 changes** → the DTCG files in `src/core/**` / `src/themes/bh2022/**` (`$value`, no `$type`).
- **Don't invent a third pattern** or re-introduce `$type` on bh2022 (it changes the frozen output).
