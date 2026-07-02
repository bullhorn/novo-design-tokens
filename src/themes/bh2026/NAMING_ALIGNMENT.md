# Modern Theme ↔ Novo: Naming Conventions Alignment Analysis

**Purpose:** assess where the modern UI tokens (Figma *subatomic*) align with the existing
Novo design tokens and the CSS-variable contract that novo-elements components consume — and
define a naming strategy to build the modern theme **without replacing** the existing token
subatomics. Goal: a `modern` theme that renders like the target mockup (8/16/24/32 spacing
rhythm, Inter, modern semantic colors) by **overriding values on the names components already
read**, not by inventing a parallel contract.

**Sources:** `src/tokens/modern/subatomic.figma-export.json` (356 modern tokens), existing
`src/tokens/**` (Novo primitives/semantics), and a novo-elements inventory of the **84 distinct
`var(--…)` names** components actually consume (`f/theming-2`).

---

## 0. Headline findings

| # | Finding | Severity |
|---|---------|----------|
| 1 | **Figma px are rem intent, not a px mandate.** Figma has no rem concept, so the designer authored in px; the mockup legend (`8px=.5rem`…) shows the intent is rem-relative. **Resolved:** convert at ingestion `rem = figma_px ÷ 10` (Novo's 10px base) so on-screen pixels match the design, rem scaling is kept, and the 10px base is untouched. | 🟢 Resolved |
| 2 | **Spacing-name collision.** Both use t-shirt names (`sm/md/lg/xl`) but with different scales — Novo `md`=1rem=10px vs modern `md`=16px→**1.6rem**. Same name, re-valued under the theme. | 🟡 Re-value |
| 3 | **Semantic color names are conceptually aligned** (background / content / border) and map cleanly onto Novo's `--background-*`, `--text-*`, `--border-*`. | 🟢 Easy |
| 4 | **Primitive names already overlap with identical values** (`charcoal`, `sand`, `silver`, `stone`, `ash`, `slate`; `positive/negative/warning/success`). | 🟢 Easy |
| 5 | **Modern typography is richer** (composite tokens per role: family+weight+size+line-height+letter-spacing+transform) vs Novo's flat `--font-size-*`. | 🟡 Additive |
| 6 | **Modern links are not blue** (`content/link` = charcoal `#282828`), vs Novo `--links` = ocean `#4a89dc`. A real design change, not just a rename. | 🟡 Design |
| 7 | **Font family differs** (Inter vs Montserrat) — themeable via `--font-family-base`. | 🟢 Easy |

**Recommended strategy (one line):** keep the **consumed CSS-variable names stable** and have
the modern theme override their **values** under `[data-theme="modern"]`, converting Figma px
to **rem at ÷10** (Novo stays rem-based); add modern-only names only where Novo has no
equivalent; **do not** change the 10px root base.

### Conversion rule (px → rem)

`rem = figma_px / 10` (Novo `--font-size-base: 10px`). Applied to spacing, font-size,
line-height, letter-spacing, and border-radius. **Exceptions:** border **widths** stay px
(1px hairline convention, matching Novo `size.border.width`); font-weight stays unitless; the
`round` radius sentinel (999) stays px. Reference points:

| Figma px | rem (÷10) | | Figma px | rem (÷10) |
|----------|-----------|-|----------|-----------|
| 2 | 0.2rem | | 24 | 2.4rem |
| 4 | 0.4rem | | 32 | 3.2rem |
| 8 | 0.8rem | | 48 | 4.8rem |
| 12 | 1.2rem | | 14 (font) | 1.4rem |
| 16 | 1.6rem | | 24 (font) | 2.4rem |

---

## 1. Spacing & the rem base (the hard part)

### Scales side by side

| Role | Novo name | Novo value (@10px) | Modern t-shirt | Modern value | Modern numeric |
|------|-----------|--------------------|----------------|--------------|----------------|
| 0 | `none` | 0 | `none` | 0 | `spacing/0` |
| xxs | `px` | 1px | `xxsm` | 2px | `spacing/2` |
| xs | `xs` 0.25rem | **2.5px** | `xsm` | 4px | `spacing/4` |
| sm | `sm` 0.5rem | **5px** | `sm` | **8px** | `spacing/8` |
| md | `md` 1rem | **10px** | `md` | **16px** | `spacing/16` |
| lg | `lg` 1.25rem | 12.5px | `lg` | 24px | `spacing/24` |
| xl | `xl` 1.5rem | 15px | `xlg` | 32px | `spacing/32` |
| 2xl | `2xl` 2rem | 20px | `xxlg` | 48px | `spacing/48` |
| 3xl | `3xl` 3rem | 30px | — | — | `spacing/{64,80,96,128}` |

> The mockup's proximity legend (**8 best-friends / 16 friendly / 24 acquaintances /
> 32 neighbors**) **is** the modern `sm/md/lg/xlg` scale. To render like the mockup, components
> that use `var(--spacing-md)` must resolve to **16px** under the modern theme.

### Why this is the crux
`--spacing-md` is consumed in **48 files**, `--spacing-sm` in 28. If the modern theme block
redefines `--spacing-md: 16px`, every one of those components **reflows to the modern rhythm
automatically** — exactly the desired effect — but it also means a theme swap changes layout
density, not just color. That is acceptable (it's the point) **provided spacing values are
emitted in px**, so they don't ride the 10px↔16px rem-base difference.

### Recommendation
- **Keep names** `--spacing-{none,px,xs,sm,md,lg,xl,2xl,3xl}`. Under `[data-theme="modern"]`,
  re-value them to the modern scale **in rem (÷10)**: `sm:0.8rem, md:1.6rem, lg:2.4rem,
  xl:3.2rem, 2xl:4.8rem` and **extend** with modern-only large steps (`3xl…` → 6.4/9.6rem).
  Reconcile `xs` (2.5px → 0.4rem to match modern 4px).
- **Do NOT raise the root font-size to 16px.** Converting px→rem at ÷10 preserves modern's
  on-screen pixel intent (8/16/24/32) at the existing 10px base, so legacy `rem` literals and
  `--font-size-*` are untouched — no uncontrolled reflow, and rem scaling is retained.
- Treat spacing as a **themed** dimension here (it normally isn't) — this is what makes the
  modern look possible without component edits.

---

## 2. Typography

| Dimension | Novo | Modern | Alignment |
|-----------|------|--------|-----------|
| Base | 10px root; sizes in rem (`--font-size-md` 1.3rem=13px) | px sizes (14,16,18,24…); 16px design base | Convert ÷10 → rem and map onto `--font-size-*` (14px→1.4rem) |
| Family | Montserrat (`--font-family-base`) | **Inter** | Override `--font-family-base` under theme |
| Weights | named 100–900 (`hairline…heavy`) | numeric **and** named (`regular/medium/semi/bold/extrabold/black`) | Both resolvable; map named→numeric |
| Semantic | flat `--font-size-{caption,label,text,button,title,tab}` | **composite** roles (`typography/button/*`, `title/*`, `body-default/*`, `input/*`, `tabs/*`, `card/*`, `navigation/*`) — each carries family+weight+size+line-height+letter-spacing+transform | Modern is a superset; map size component onto existing `--font-size-*`, expose the rest as new modern-only vars |

**Size reconciliation examples:** Novo `--font-size-title` 20px → modern `title` 24px;
Novo body 13px → modern `body-default` 14px. Close but intentionally larger in modern.

**Recommendation:** map the *size* facet of modern composites onto the existing `--font-size-*`
names (so current components grow/shrink correctly), and additionally emit the **full composite
tokens** (`--typography-button-*`, etc.) as modern-only names for components that adopt the
richer contract. Override `--font-family-base` to Inter under the theme.

---

## 3. Color — primitives

| Layer | Novo | Modern | Alignment |
|-------|------|--------|-----------|
| Neutrals | named (`charcoal`, `sand`, `silver`, `stone`, `ash`, `slate`, `dark`, `light`, `bright`) + generated `shade/tint/contrast/pale` | numeric `core` ramps `gray/100–900`, `gray/{white,black}` **plus** Tier-1 named (reusing Novo names) | Shared names = **identical hex** (audited). Modern adds numeric ramps Novo lacks. |
| Status hues | `ocean/grass/sunflower/grapefruit` → `positive/success/warning/negative` | `utility/{blue,green,yellow,red}/100–900` ramps + Tier-1 `positive/success/warning/negative` (same hues) | Conceptually aligned; modern provides full 9-step ramps (Novo only has generated variants) |
| Entity | `entity/*` (generated palette) | `color/entity/*` (16 named) | Same names; reconcile exact hexes |
| Brand | `orange/navigation/aqua` | `orange/*`, `blue/navigation-blue`, etc. | Aligned naming |

**Recommendation:** keep Novo's `--color-*` primitive names as-is (no replacement). Introduce
modern's **numeric ramps** (`--color-gray-100…900`, `--color-utility-red-100…900`) as **new,
additive** names — they don't collide and give the semantic layer the steps it aliases. Shared
named primitives need no change (identical values).

---

## 4. Color — semantics (the bridge)

Modern's Tier-2 maps cleanly onto Novo's consumed semantic vars. Proposed mapping for
`[data-theme="modern"]` (Novo name kept; value sourced from modern):

| Novo consumed var (files) | Novo light | → Modern token | Modern value | Note |
|---------------------------|-----------|----------------|--------------|------|
| `--background-body` (15) | #fff | `gray/white` | #ffffff | |
| `--background-main` (19) | #f7f7f7 | `background/default` | #f8fafc | |
| `--background-bright` (18) | #fff | `gray/white` | #ffffff | |
| `--background-muted` (5) | #f4f4f4 | `background/subtle` | #f1f5fc | |
| `--background-dark` | #e2e2e2 | `background/subtle-hover` | #e2e2e2 | identical |
| `--text-main` (18) | #363636 | `content/headline` | #282828 | |
| (new) `--text-body` | — | `content/body` | #314158 | modern adds a body tier |
| `--text-muted` (13) | #70777f | `content/subtle` | #8ca1b9 | |
| `--text-disabled` | #70777f | `content/disabled` | #707070 | |
| `--links` (—) | #4a89dc | `content/link` | **#282828** | ⚠ modern links are charcoal, not blue |
| `--focus` / `--selection` (31) | #4a89dc | `border/strong` or `utility/blue/600` | #314158 / #4555d3 | pick one; confirm with design |
| `--border` (11) | #dbdbdb | `border/default` | #f0f5f9 | |
| `--border-2` (16) | #f7f7f7 | `border/subtle` | (alias `subtle`) | |
| `--border-hard` | #3d464d | `border/emphasized` | #282828 | |
| `--color-positive` (125!) | #4a89dc | `utility/blue/600` or `positive` | #4555d3 / #4a89dc | highest-impact var; confirm hue |
| `--color-negative` (27) | #da4453 | `utility/red/600` | #b82f30 | |
| `--color-contrast-positive` (8) | #fff | `gray/white` / utility knockout | | |

**Coverage:** modern's semantic set covers Novo's high-traffic background/text/border/status
vars well. **Gaps** (no modern equivalent — leave as base values or add later): `--code`,
`--variable`, `--highlight`, `--scrollbar-thumb(-hover)`, `--button-hover`, `--form-placeholder`,
`--form-text`. Modern **adds** capabilities Novo lacks: `*-knockout` utility colors, a distinct
`content/body` text tier, `border/{subtle,medium,strong,emphasized}` graduations.

⚠ **Design call-outs (not renames — actual visual changes):** modern links/focus are not the
classic ocean blue; `--color-positive` (used in 125 files) may shift hue. These need design
sign-off, not just mechanical mapping.

---

## 5. Border radius & elevation

| | Novo | Modern |
|--|------|--------|
| Radius | `round` 0.4rem (4px), `square`, `circle` 99999 | `none/xxsm/xsm/sm/md/lg/xlg/xxlg` = 0/2/4/8/16/24/32/48 (aliased to spacing), `round` 999 |
| Width | `thin` 1px, `thick` 2px | `border-default` 1, `border-sm` 2, `border-md` 4, `border-lg` 8 |

Modern offers a graduated radius scale (the mockup's cards/pills use it). Map `--border-radius-round`
(11 files) to a modern step (likely `sm`=8px) and add the modern scale as new names.

---

## 6. Theme application mechanism

- Novo today: `.theme-dark` class on `:root` (light = default, no class).
- Plan / modern: `[data-theme="modern"]` attribute (per `THEMING_PLAN.md`).
- **Recommendation:** modern theme block targets `:root[data-theme="modern"], :root.theme-modern`
  (support both during transition), and `NovoTheme.use('modern')` sets the attribute.

---

## 7. Naming strategy — decision summary

> **Decisions (2026-06, confirmed):**
> - ✅ **Keep rem; convert Figma px → rem at ÷10.** Figma's px were a tooling limitation, not a
>   requirement. The modern theme re-values `--spacing-{sm,md,lg,xl}` → `0.8/1.6/2.4/3.2rem`
>   (and extends with modern-only large steps) under `[data-theme="modern"]`, so components adopt
>   the mockup's 8/16/24/32 *rendered* rhythm with no edits. Root base stays 10px; rem scaling
>   preserved. Border widths stay px (hairline); font-weight unitless.
> - ✅ **Links: CHARCOAL, not branded (provisional).** Decided 2026-06 — `--links`/`--focus`/
>   `--selection` follow the source-of-truth export (`content/link` → charcoal `#282828`).
>   The designer's Figma is WIP and newer screenshots show *branded* links, but **the latest
>   export is authoritative**; revisit if a newer export lands. Screenshots are not source of truth.
> - ⏸ **`--color-positive` hue (125 files): still PENDING DESIGN SIGN-OFF** — not yet overridden.
>   All other color mappings proceed as faithful to the export.


1. **Stable contract:** never rename a consumed var. The modern theme **re-values** existing
   names (`--spacing-*`, `--font-size-*`, `--font-family-base`, `--background-*`, `--text-*`,
   `--border-*`, `--color-positive/negative`, …) inside its selector block.
2. **Additive modern names:** introduce modern-only names where Novo has no concept —
   numeric color ramps (`--color-gray-*`, `--color-utility-*-*`), composite typography
   (`--typography-<role>-*`), graduated radius/border, `content/body`, knockout colors.
3. **Units:** emit modern spacing/typography in **px**; keep the **10px** root base untouched.
4. **Provenance:** modern source names mirror Figma (`color/content/headline`); the
   Novo-facing alias mapping lives in the novo-elements `themes/modern.scss` (Layer 2→3).
5. **Design sign-off needed** on the genuine visual changes (links/focus hue, `--color-positive`).

## 8. Risks

| Risk | Mitigation |
|------|------------|
| Spacing re-value reflows layouts (intended, but broad) | Roll out behind the theme selector; visual-diff key screens; px units avoid base drift |
| `--color-positive` hue change hits 125 files | Confirm target hue with design before mapping |
| Legacy `rem`/px literals in components ignore themed vars | Pre-existing migration debt (per THEMING_PLAN.md §migration); not made worse by modern |
| Inter webfont load/licensing | Self-host; define `--font-family-base` fallback chain |
