/**
 * Theme registry — the single source of truth for the multi-theme build.
 * See TOKENS_MULTITHEME_REFACTOR.md. Adding a theme = one entry here (+ its source).
 *
 * `kind`:
 *   - 'classic-sd' : built via Style Dictionary from the classic `src/tokens/**` JS modules.
 *                    (P3 will migrate this to DTCG tiers under `src/core` + `src/themes/bh2022`.)
 *   - 'figma'      : built from a committed Figma export (resolved at build time).
 *                    (P2 will re-home the resolver as a Style Dictionary custom parser.)
 *
 * `isBase` : renders at `:root` (no data-theme). Exactly one base today (bh2022).
 */
export const THEMES = [
  {
    name: 'bh2022',
    isBase: true,
    kind: 'classic-sd',
    selector: ':root',
    modes: ['light', 'dark'],
    outputs: { light: 'css/variables.css', dark: 'css/variables-dark.css' },
  },
  {
    name: 'bh2026',
    isBase: false,
    kind: 'figma',
    source: 'src/tokens/bh2026/subatomic.figma-export.json',
    selector: ':root[data-theme="bh2026"], :root.theme-bh2026',
    modes: ['light'],
    output: 'css/variables-bh2026.css',
  },
];

/** Convenience selectors used by the build/consumers. */
export const FIGMA_THEMES = THEMES.filter((t) => t.kind === 'figma');
