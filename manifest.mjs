/**
 * Theme registry — the single source of truth for the multi-theme build.
 * See TOKENS_MULTITHEME_REFACTOR.md. Adding a theme = one entry here (+ its source).
 *
 * `kind`:
 *   - 'dtcg'  : built via Style Dictionary from tiered DTCG source (`$value`) under
 *              `src/core/**` (primitives) + `src/themes/<name>/**` (semantic + components).
 *   - 'figma' : built from a committed Figma export via the Style Dictionary
 *              `figma/subatomic` custom parser (resolved + unit-converted at build time).
 *
 * `isBase` : renders at `:root` (no data-theme) and also emits the scss/js/mjs/json
 *            consumption artifacts. Exactly one base today (bh2022).
 *
 * `sources` (dtcg): ordered source globs. Order is significant — it sets the emitted
 *            token order (core primitives resolve refs from any set; ordering is cosmetic).
 */
export const THEMES = [
  {
    name: 'bh2022',
    isBase: true,
    kind: 'dtcg',
    selector: ':root',
    modes: ['light', 'dark'],
    sources: [
      'src/themes/bh2022/semantic.json',
      'src/core/color.json',
      'src/core/size.json',
      'src/core/typography.json',
      'src/core/border.json',
      'src/core/effect.json',
      'src/themes/bh2022/components.json',
    ],
    outputs: { light: 'css/bh2022.css', dark: 'css/bh2022-dark.css' },
  },
  {
    name: 'bh2026',
    isBase: false,
    kind: 'figma',
    source: 'src/tokens/bh2026/subatomic.figma-export.json',
    selector: ':root[data-theme="bh2026"], :root.theme-bh2026',
    modes: ['light'],
    output: 'css/bh2026.css',
  },
];

/** The single base theme (renders at :root + emits scss/js/mjs/json). */
export const BASE_THEME = THEMES.find((t) => t.isBase);

/** Figma-sourced themes (built via the `figma/subatomic` parser). */
export const FIGMA_THEMES = THEMES.filter((t) => t.kind === 'figma');
