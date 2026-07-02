# Modern theme — extracted token set

Source: Figma **subatomic** export (`novo-design-tokens/subatomic.json`), W3C design-tokens format.
Generated 2026-06. **356 tokens, 0 unresolved aliases.**

## Artifacts
- `subatomic.figma-export.json` — the **source of truth**. The raw Figma "subatomic" variables export (W3C design-tokens format, alias-preserving). `build.mjs` reads this directly to generate the modern CSS — drop in a fresh export and rebuild.
- `components.figma-export.json` — Tier-3 component tokens (button/card/input/…); not yet wired into the build.
- `variables-bh2026.css` — fully **resolved** CSS custom properties (preview of the end result), scoped to `[data-theme="modern"], :root.theme-modern`.

## Structure (3-tier)
| Tier | Collection | Mode | Count | Role |
|------|-----------|------|-------|------|
| Core | `core` | `Mode 1` | 61 | raw primitives: `color/gray/*`, `color/utility/{red,yellow,green,blue}/*`, `spacing/0..128` |
| Tier 1 | `Tier 1 \| base values` | `Mode 1` | 148 | named palette (reuses Novo names: entity/positive/negative/sand/charcoal… + modern additions), `border/radius`, `border/width`, `spacing/{gap,padding}`, full typography primitives. Aliases core. |
| Tier 2 | `Tier 2 \| semantic tokens` | `Default` | 147 | semantic roles: `color/{background,border,content}/*` + typography composites (`title`, `button`, `body-default`, `input/*`, `tabs`, `card`, `navigation`…). Aliases Tier 1/core. |

## Key facts
- **Single mode per collection** → "modern" is ONE theme, not a light/dark pair. A future `modern-dark` would be an added mode on Tier 2.
- Font family is **Inter** (current Novo default: Montserrat).
- Alias syntax in the export is already Style Dictionary syntax → near-direct ingestion.
- Tier 1 reuses many existing Novo primitive names (`charcoal`, `sand`, `entity/*`, `positive/negative/warning/success`), easing reconciliation; new modern-only: `core` numeric ramps, `blue/blue-gray`, `subtle`, `medium`, `lightest-blue`, `grayscale/bullhorn-black`, etc.

## Naming map (Figma → CSS var)
`color/content/headline` → `--color-content-headline`; `spacing/16` → `--spacing-16` (`1.6rem`); `typography/button/font-size` → `--typography-button-font-size`. (`/` → `-`; lengths converted **px → rem at ÷10** since Novo stays rem-based on a 10px root; border widths kept px; font-weight unitless. See `NAMING_ALIGNMENT.md`.)
