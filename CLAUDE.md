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
src/tokens/        → Classic tokens (color, typography, spacing, size, theme) — JS modules, Style Dictionary
src/tokens/modern/ → Modern theme: Figma exports (source of truth) + docs (next-gen tiered model)
src/components/    → Component-specific tokens (button, tooltip)
build.mjs          → Style Dictionary v5 config + custom formatters, PLUS buildModern() (ESM, async)
scss/              → Hand-authored SCSS utilities (mixins, functions) + generated variables
css/              → Generated CSS custom properties (light + dark + modern)
lib/              → Generated JS (CJS + ESM) and JSON
```

> ⚠️ The repo currently runs **two token systems** (classic + modern) — a deliberate
> migration in progress. Read **Theming Architecture & Long-Term Trajectory** below before
> adding tokens or touching the build.

### Build Pipeline

`build.mjs` uses Style Dictionary v5 to read `src/tokens/index.js` and `src/components/index.js`, then outputs to 5 platforms: css, scss, js, mjs, json. PostCSS (autoprefixer) and clean-css run after to produce minified CSS.

### Token Source Format

Tokens are JS objects with a `value` property. References use `"{category.token}"` syntax (no `.value` suffix — that was v3 syntax). Dark theme variants use a `darkValue` property alongside `value`.

```javascript
// Example token with dark variant
module.exports = {
  background: {
    body: {
      value: "{color.white}",
      darkValue: "{color.midnight}",
    }
  }
};
```

Color tokens use `polished` and `chroma-js` to auto-generate shade, tint, contrast, and pale variants.

### Custom Formatters (build.mjs)

- `javascript/esm` — named exports per token category
- `javascript/module` — CJS `module.exports`
- `css/dark` — CSS variables using `darkValue` instead of `value`, delegates to built-in `css/variables` formatter

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
| `novo-design-tokens/css/variables-modern` | `css/variables-modern.css` (+ `.min`) |

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

1. Create/edit a `.js` file in `src/tokens/<category>/` following CTI (Category/Type/Item) structure
2. Export it from the category's `index.js` (or `src/tokens/index.js` / `src/components/index.js`)
3. Run `npm run build` and verify output in `css/`, `scss/`, `lib/`
4. Token references use `"{path.to.token}"` syntax (curly braces, no `.value` suffix)

## Release

Automated via semantic-release v24 on push to main/next/beta/alpha. Commit messages drive version bumps (conventional commits). CI runs in GitHub Actions (`.github/workflows/release.yml`).

Release config: `release.config.mjs` (ESM `export default`).

## Conventions

- Style Dictionary v5 — ESM, async API, `value` property (not `$value` DTCG format)
- Token references use `"{path.to.token}"` curly-brace syntax without `.value` suffix
- Color utilities from `polished` (shade, tint) and `chroma-js` (contrast)
- No production dependencies — everything is devDependencies; consumers get pre-built outputs
- Build script and release config are `.mjs` files (project is not `"type": "module"`)
- No test suite currently exists
- `sass@1.100` emits `@import` deprecation warnings — non-blocking, but `scss/_index.scss` will eventually need `@use`/`@forward` migration (breaking change for consumers)

## Theming Architecture & Long-Term Trajectory

**Read this before adding tokens or changing the build.** The repo currently runs **two token
systems at once — on purpose. This is a migration in progress, not a permanent split.**

### The two systems (today)

1. **Classic (legacy).** Hand-authored JS modules in `src/tokens/**`, built by Style Dictionary,
   themed via `value` / `darkValue` pairs (light = `:root`, dark = `:root.theme-dark`). The
   `f/cssvar-theming` runtime layer sits on top: `getColor()`/`getTint*()`/etc. return
   `var(--color-*)` so colors resolve at **runtime**, with live helpers
   (`elevate()`/`recede()`/`darkenLive()`, driven by `--bg-fade-multiplier`) for derived states.
2. **Modern (next-gen).** Sourced from the Figma "subatomic" export
   (`src/tokens/modern/subatomic.figma-export.json`) — a **tiered, semantic, aliased** model
   (core → Tier 1 → Tier 2 → Tier 3 components). Built by `buildModern()` in `build.mjs`
   (a dedicated resolver, **not** Style Dictionary) into `css/variables-modern.css`, scoped to
   `[data-theme="modern"]`.

**Why modern bypasses Style Dictionary:** its aliases use a flat namespace where tier-1
`color.border` (a leaf) and tier-2 `color.border.*` (a group) coexist — they collide in SD's
single nested tree. The custom resolver handles that. Deliberate; documented in `build.mjs`.

### The target (the trajectory — don't lose this)

The Figma-sourced **tiered/semantic/aliased model is the intended end-state architecture.**
Classic is what migrates *onto* it. Direction of travel:

- **Converge on the modern model.** Light and dark become **themes/modes** expressed in the same
  tiered, Figma-sourced system, selected via `[data-theme="…"]` — not bespoke `value`/`darkValue`
  pairs.
- **Retire the `value`/`darkValue` + hand-authored-JS path** once light/dark are migrated, so the
  repo ends with **one source format, one build path, one theming model.**
- **Tokens flow primitives → semantic → component (Tier 3)**, consumed by novo-elements through
  the semantic CSS-var contract; the live color helpers remain the runtime mechanism.
- **Unify the build** — either fold modern into SD (pre-resolve the flat-alias collision) or grow
  `buildModern()` into the single path. Avoid a permanent two-build setup.

Until then we are **mid-migration, intentionally.** The risk to avoid is *calcification* — two
parallel systems becoming permanent. New work should move us toward convergence, not entrench the split.

### Which system do I add to? (contributor guidance)

- **Modern theme values** → update the Figma file and re-export
  `src/tokens/modern/subatomic.figma-export.json` (the build reads it directly). Component-level →
  `components.figma-export.json` (not yet wired into the build).
- **Classic light/dark changes** → the existing `src/tokens/**` JS modules (`value`/`darkValue`).
- **Don't invent a third pattern.** If a change could go either way, prefer the modern model and
  note it — classic is being migrated onto modern.

See `MODERN_THEME_PLAN.md`, `MODERN_DESIGN_IMPLEMENTATION.md`, `MODERN_NAMING_REVIEW.md`, and
`src/tokens/modern/NAMING_ALIGNMENT.md` for detail. (`THEMING_PLAN.md` is the original
runtime-theming plan that this trajectory builds on.)
