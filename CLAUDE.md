# Novo Design Tokens

Design tokens for the Novo Design System (Bullhorn), built with **Style Dictionary v5** into CSS, SCSS, JS/ESM, and JSON. Requires **Node.js >= 22.14.0**.

```bash
npm start   # build all outputs (build.mjs + postcss + minify)
npm test    # build + regression suite (snapshots + invariants)
```

## Layout

```
src/core/          bh2022 primitives (DTCG $value): color, size, typography, border, effect
src/themes/bh2022/ bh2022 semantic (+dark) + components — reference core
src/themes/bh2026/ bh2026 (modern): Figma exports — the source of truth
manifest.mjs       theme registry (single source of truth): bh2022 (dtcg) + bh2026 (figma)
build.mjs          SD v5 config + custom formatters + `figma/subatomic` parser (ESM, async)
scss/ css/ lib/    generated outputs (+ hand-authored scss mixins/functions in scss/)
```

## Architecture

Both themes share one source format (DTCG `$value`) and one build engine (Style Dictionary),
driven by `manifest.mjs` — two *source shapes* feeding the same pipeline:

1. **bh2022** (base, `:root`). Tiered DTCG: primitives in `src/core/**`, semantic + components in
   `src/themes/bh2022/**` (which reference core). The base SD instance emits all five platforms
   (css light+dark, scss, js, mjs, json).
2. **bh2026** (modern, `[data-theme="bh2026"]`). Built from four Figma exports (core, tier-1, tier-2,
   semantic) via `buildFigmaTokens` — reads all files together, resolves cross-tier aliases, converts
   Figma color objects to CSS, then passes the flat token map to SD via `tokens:` (no SD file parser).

**Two theme shapes are deliberate.** bh2022 shares `src/core` primitives; **Figma themes are
self-contained** — each carries its own primitives and does *not* reference `src/core`. The contract
between themes is the emitted `--*` CSS var names, not a shared source tier.

## Rules that bite (read before editing tokens or the build)

- **No `$type`.** SD's type transforms normalize values (`#fff` → `#ffffff`, dimension rounding), which
  would change the frozen output. Values are authored in final CSS form.
- **References** use `"{path.to.token}"` (curly braces, no `.value` suffix).
- **bh2022 dark** uses a non-standard `darkValue` sibling on the semantic `background` roles; the
  `css/dark` formatter swaps it into `$value`. Standard DTCG has no dark concept here.
- **bh2022 color scales are frozen literals.** `color.shade/tint/contrast/pale/varNames` were computed
  once by `polished` and baked in; the color-math deps are gone. Edit the literal(s) directly.
- **bh2026 uses `buildFigmaTokens`** (in `build.mjs`) instead of an SD file parser. It reads all four
  `*.figma-export.json` sources together, builds a shared alias namespace across tiers, resolves aliases,
  converts Figma's DTCG color objects (`{hex, components, alpha}`) to CSS hex/rgba, and unit-converts
  (px→rem). The flat token map is passed directly to SD via `tokens:`. SD's file-based parser is not
  involved. The raw exports stay the committed source of truth — **re-export → `npm run build`, nothing else.**

> Editing `build.mjs`? SD v5 is ESM-only and async (`await sd.buildAllPlatforms()`); token data is
> `dictionary.tokens` (nested) / `.allTokens` (flat). Custom formatters: `css/dark`, `figma/css-vars`,
> `javascript/esm`, `javascript/module`.

## Adding tokens / themes

- **bh2022 value** → edit the DTCG file (`src/core/<category>.json` or `src/themes/bh2022/{semantic,components}.json`);
  `$value` + `"{...}"` refs, no `$type`. New source file → add it to `BASE_THEME.sources` in `manifest.mjs`.
- **bh2026 value** → update Figma → re-export into `src/themes/bh2026/` as `core.figma-export.json`,
  `tier-1.figma-export.json`, `tier-2.figma-export.json`, `semantic.figma-export.json`.
- **New theme** → Figma-sourced: drop `*.figma-export.json` files under `src/themes/<name>/` + one `figma`
  entry (with `sources` array) in `manifest.mjs`. Hand-authored: follow the bh2022 shape.
- Don't invent a third pattern, and don't re-introduce `$type` on bh2022.

## Package exports

Per-theme scheme `./css/<theme>` — each theme is `css/<name>.css` (+ `.min`, + `-dark` where it has one).

| Import path | Resolves to |
|---|---|
| `novo-design-tokens` | base (bh2022) JS — `lib/variables.js` (CJS) / `.esm.js` (ESM) |
| `novo-design-tokens/scss` | `scss/_index.scss` (variables + mixins + functions) |
| `novo-design-tokens/manifest` | `lib/manifest.json` (theme registry: name, selector, modes, css paths) |
| `novo-design-tokens/css/bh2022` (+ `-dark`, + `.min`) | bh2022 CSS — `:root` |
| `novo-design-tokens/css/bh2026` (+ `.min`) | bh2026 CSS — `[data-theme="bh2026"]` |

Use the **extensionless** path for Sass `@import`/`@use` (it inlines the vars; a `.css` suffix makes Sass
emit a passthrough import). The `./css/*` wildcard serves extension-ful imports (JS/bundlers, and the paths
`./manifest` advertises). Deprecated `css/variables*` aliases still resolve — migrate to `css/<theme>`.

## Testing & release

- `npm test` (`test/build.test.mjs`): builds, snapshots outputs against `test/fixtures/`, asserts invariants
  (token counts, no unresolved refs, exports resolve). Intentional output change → update the fixtures.
- CI runs `npm test` on PRs + feature pushes; release runs it first.
- **Release**: semantic-release v25 on push to `main` (see `release.config.mjs`). Conventional commits drive
  the bump; a `BREAKING CHANGE:` footer (or `type!:`) cuts a major.
