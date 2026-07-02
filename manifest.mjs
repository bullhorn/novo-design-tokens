/**
 * Theme registry — the single source of truth for the multi-theme build.
 * See TOKENS_MULTITHEME_REFACTOR.md. Adding a theme = one entry here (+ its source).
 *
 * `kind`:
 *   - 'dtcg'  : built via Style Dictionary from tiered DTCG source (`$value`) under
 *              `src/core/**` (primitives) + `src/themes/<name>/**` (semantic + components).
 *              Uses `sources` (ordered list).
 *   - 'figma' : built from a committed Figma export (`src/themes/<name>/`) via the Style
 *              Dictionary `figma/subatomic` parser (resolved + unit-converted at build time).
 *              Uses `source` (single export file).
 *
 * `isBase`  : renders at `:root` (no data-theme) and also emits the scss/js/mjs/json
 *             consumption artifacts. Exactly one base today (bh2022).
 * `outputs` : per-mode emitted CSS ({ light, dark? }). Every theme has this.
 * `sources` (dtcg): ordered source list. Order sets the emitted token order (refs resolve
 *             across sets regardless; ordering is cosmetic).
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
    source: 'src/themes/bh2026/subatomic.figma-export.json',
    // Tier-3 components (src/themes/bh2026/components.figma-export.json) are committed as the source of
    // truth but not yet wired in — design still in flux. Wire via a `componentsSource` here + parser
    // support when it stabilizes (see TOKENS_MULTITHEME_REFACTOR.md §5 P5).
    selector: ':root[data-theme="bh2026"], :root.theme-bh2026',
    modes: ['light'],
    outputs: { light: 'css/bh2026.css' },
  },
];

/** The single base theme (renders at :root + emits scss/js/mjs/json). */
export const BASE_THEME = THEMES.find((t) => t.isBase);

/** Figma-sourced themes (built via the `figma/subatomic` parser). */
export const FIGMA_THEMES = THEMES.filter((t) => t.kind === 'figma');
