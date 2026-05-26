# Novo Design Tokens

Design tokens for the Novo Design System (Bullhorn). Transforms token definitions into consumable CSS, SCSS, JS/ESM, and JSON outputs using Style Dictionary v3.

## Quick Reference

```bash
npm install        # Install dependencies
npm run build      # Build all token outputs (runs build.js + postcss + minify)
```

## Architecture

```
src/tokens/       → Core tokens (color, typography, spacing, size, theme)
src/components/   → Component-specific tokens (button, tooltip)
build.js          → Style Dictionary config + custom formatters
scss/             → Hand-authored SCSS utilities (mixins, functions) + generated variables
css/              → Generated CSS custom properties (light + dark)
lib/              → Generated JS (CJS + ESM) and JSON
```

### Build Pipeline

`build.js` uses Style Dictionary to read `src/tokens/index.js` and `src/components/index.js`, then outputs to 5 platforms: css, scss, js, mjs, json. PostCSS (autoprefixer + prettify) and clean-css run after to produce minified CSS.

### Token Source Format

Tokens are JS objects with a `value` property. References use `"{category.token.value}"` syntax. Dark theme variants use a `darkValue` property alongside `value`.

```javascript
// src/tokens/color/base.js
module.exports = {
  color: {
    white: { value: "#fff" },
    background: { value: "{color.white.value}", darkValue: "{color.midnight.value}" }
  }
};
```

Color tokens use `polished` and `chroma-js` to auto-generate shade, tint, contrast, and pale variants.

### Custom Formatters (build.js)

- `javascript/esm` — named exports per token category
- `javascript/module` — CJS `module.exports`
- `css/dark` — CSS variables using `darkValue` instead of `value`

## Package Exports

| Import path | Resolves to |
|---|---|
| `novo-design-tokens` | `lib/variables.js` (CJS) or `lib/variables.esm.js` (ESM) |
| `novo-design-tokens/scss` | `scss/_index.scss` (variables + mixins + functions) |
| `novo-design-tokens/css/variables` | `css/variables.css` |
| `novo-design-tokens/css/variables.min` | `css/variables.min.css` |
| `novo-design-tokens/css/variables-dark` | `css/variables-dark.css` |

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

## Release

Automated via semantic-release on push to main/next/beta/alpha. Commit messages drive version bumps (conventional commits). CI runs in GitHub Actions (`.github/workflows/release.yml`).

## Conventions

- Style Dictionary v3 (not v4) — token format uses `value` property, not `$value`
- Token references use `"{path.to.token.value}"` curly-brace syntax
- Color utilities from `polished` (shade, tint) and `chroma-js` (contrast)
- No production dependencies — everything is devDependencies; consumers get pre-built outputs
- No test suite currently exists
