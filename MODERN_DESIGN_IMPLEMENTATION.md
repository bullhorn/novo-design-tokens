# Implementing the Modern Design in Novo — Strategy

How the modern design reaches the actual product. Builds on `MODERN_THEME_PLAN.md`
(token build + theme wiring) and `src/tokens/modern/NAMING_ALIGNMENT.md` (var mapping).

## 0. The key framing: two efforts, often conflated

| | **Modern THEME (re-skin)** | **Modern DESIGN (layout/UX)** |
|--|----------------------------|-------------------------------|
| What | Color, type, spacing, radius via tokens | New screen structure: left nav rail, Open-Tabs sidebar, card *grid*, header layout |
| Delivered by | The modern token theme + CSS-var consumption | Net-new / refactored app components |
| Effort shape | Mostly mechanical once infra lands | Product-owned engineering, per screen |
| Risk | Low (additive, selector-scoped) | Higher (UX change, routing, behavior) |

A theme swap alone does **not** produce the mockup. It produces a re-skinned version of
*today's* layout. The left-rail/grid/sidebar restructure is separate work. Plan them as
parallel tracks, not one deliverable.

## 1. Current state (grounded in the repos)

- **Target app = `novo/`** (Angular 20, on `main`, pulls latest `novo-design-tokens`).
- **App is already CSS-variable-driven** for themeable values (`var(--background-*)`,
  `var(--text-*)`, `var(--spacing-md)`, …) imported via `novo-elements/styles/variables`.
- **Theme intent already scaffolded** in `novo/apps/novo/app/mainframe/app/Mainframe.app.ts`:
  - `isModernTheme` ⇄ `currentTheme = 'modern-light' | 'classic'`, persisted to prefs,
    default `'modern-light'`; calls `this.theme.use({ themeName })`.
- **🔴 Wiring gap:** `NovoTheme.use()` (`elements/common/theme/theme-options.ts`) only
  `onThemeChange.emit(...)` — it sets **no** DOM class/attribute. Dark mode works only because
  `Mainframe.toggleDarkMode()` manually toggles `.theme-dark`. **So `'modern-light'` resolves to
  no selector and has no visual effect today.** This is Phase 0.
- **novo-elements theme-readiness:** ~**38%** of components (52/135) consume CSS vars and are
  theme-responsive; the rest use SCSS vars or hardcoded values (per `THEMING_PLAN.md`). A theme
  alone restyles only that 38%.
- **Existing reusable components** for the mockup: `stepper/` (horizontal stepper) and
  `progress/` already exist in novo-elements — the mockup stepper is **reuse, not net-new**.
  Card components exist (40+ types). Net-new is the **left nav rail**, **Open-Tabs sidebar**,
  and the **card-grid layout**.

## 2. Reuse the existing classic↔modern switch (Phase 0)

**Decision (confirmed):** do not invent new theme UI/vocabulary. Reuse the existing
`isModernTheme` switch and the reactive `theme.themeName` mechanism. Repoint "modern" at the
new Figma design; collapse the trivial present-day variant; default to classic.

### How the present-day switch works (grounded)
The classic↔`modern-light` difference is **not** a CSS selector — it's reactive `theme.themeName`
checks in templates plus `accent.directive`:
- `novo/apps/novo/app/record/Record.app.html`:
  `[theme]="theme.themeName === 'classic' ? config.color : ''"`,
  `[accent]="theme.themeName === 'classic' ? 'background' : config.color"`
- `novo-elements/.../common/directives/accent.directive.ts` subscribes to `onThemeChange`,
  branches on `themeName === 'classic'`.
- Result today: **classic** = entity color fills header bg; **modern-light** = neutral header +
  entity accent (the neutral-header treatment seen in the mockup).
- The switch UI: `Mainframe.app.html` `<novo-switch [(ngModel)]="isModernTheme">`;
  `isModernTheme` ⇄ `currentTheme = 'modern-light' | 'classic'`; default currently `modern-light`
  in 3 places (`Mainframe.app.ts:158`, `novo.providers.ts:251`, `theme-options.ts:16`).

### Target shape
- **Baseline = `classic`**, and **default to it** (flip the 3 defaults `modern-light → classic`).
  Fold the present-day `modern-light` header treatment into the classic baseline (see §2.1
  clarification — which present-day look becomes the baseline needs confirming).
- **"modern" = the new Figma design.** Switch ON applies it.
- **Close the inert-`use()` gap for the token layer:** the present switch only flips
  *per-component* `themeName` logic (header accents). The new modern design is *token-wide*
  (color/type/spacing/radius everywhere), so it also needs a **global CSS hook**. Make
  `NovoTheme.use()` additionally set a root marker derived from `themeName`
  (e.g. `document.documentElement.dataset.theme = 'modern'` when modern), and scope
  `variables-modern.css` to `:root[data-theme="modern"]`. This preserves the existing reactive
  `themeName` component logic **and** activates the modern tokens globally. (Exact attribute vs
  class TBD during implementation.)

### 2.1 Resolved
**The new `classic` baseline = today's `modern-light` look** (neutral header + entity accent —
the treatment closest to the mockup). The old entity-color-header `classic` is retired.
Implication: the `themeName === 'classic'` branches in `Record.app.html` / `FastAdd.app.html`
and `accent.directive.ts` must be updated so **classic now renders the neutral+accent header**
(i.e. swap the branch bodies, or simplify since only `classic` vs `modern` remain). This is
app-side work in Track 2/3; it does not affect the Track 1 token build.

## 3. Work tracks

### Track 1 — Theme delivery (tokens → elements → app)  ·  ~1 week infra
1. **tokens:** ✅ `build.mjs` reads `subatomic.figma-export.json` directly, resolves aliases,
   applies **px→rem (÷10)**, and emits `variables-modern.css` (per `MODERN_THEME_PLAN.md` Phases 1–2).
2. **elements:** `themes/modern.scss` = `@import` modern vars + Layer-2→3 alias block
   (re-value `--spacing-*` to rem, map semantic colors, override `--font-family-base` to Inter);
   fix `NovoTheme.use()` to apply the selector (Phase 0).
3. **app:** load `variables-modern.css`; the existing `isModernTheme` toggle now works.
- **Outcome:** every CSS-var-driven surface (the 38% + app styles) renders modern. Immediate,
  visible win on the record page's already-migrated parts.

### Track 2 — Component theme-readiness migration (novo-elements)  ·  3–5 weeks, incremental
Migrate the ~62% of components still on SCSS vars / hardcoded values to consume the modern
semantic CSS vars, so they actually respond to the theme. This is the **long pole** for a
*coherent* modern look. Sequence by traffic on the record page: button, input/form, card,
profile-header, tabs, stepper, badges/pills, then the tail. Each migration is "swap literals →
`var(--…, $fallback)`", visually identical in classic, theme-responsive in modern. Track against
`THEMING_PLAN.md`'s migration plan; `--color-positive` (125 files) pending design hue sign-off.

### Track 3 — Layout / UX redesign (novo app)  ·  product-owned, parallel
Net-new/refactored screens to match the mockup, gated behind `currentTheme === 'modern-light'`:
- **Left nav rail** + entity tabs (today: top horizontal tabs) — new shell component.
- **Open-Tabs sidebar** — render `MasterPageSDK.windowManager` state visually.
- **Card-grid dashboard** — re-layout existing cards from vertical stacks into the 2-col grid.
- **Record header** refactor (avatar/title/actions/meta row) — extend `profile-header`.
- **Reuse** existing `stepper` (Prescreen→Placement) and card library.
Independent of token work once components are theme-ready; can run in parallel with Track 2.

## 4. Recommended sequencing

```
Phase 0  Selector wiring + emit variables-modern.css            (unblocks everything)
Phase 1  Track 1 infra + migrate HIGH-traffic record components → record page reads ~modern
Phase 2  Track 2 broad component migration                       → app-wide coherence
Phase 3  Track 3 layout redesign per screen, flag-gated          → full mockup parity
```
Gate the redesign behind the `modern-light` preference so `classic` users are unaffected and
rollout is reversible.

## 5. Risks / call-outs
- **Theme ≠ design.** Stakeholders may expect the mockup from a "theme" — set expectations that
  layout (Track 3) is separate, larger, and product-owned.
- **Partial migration looks inconsistent** — until Track 2 progresses, modern shows a mix of
  re-skinned and classic components. Sequence by visible surfaces.
- **`--color-positive` hue** (125 files) and **link/focus** color are real design changes —
  pending sign-off (see `NAMING_ALIGNMENT.md`).
- **Inter webfont** delivery/licensing.

## 6. Immediate next steps
1. **Phase 0 + Track 1** build wiring in `novo-design-tokens` (ingest + px→rem transform + emit
   `variables-modern.css`). Ready to start.
2. **Reuse the existing switch:** flip defaults `modern-light → classic` (3 sites), repoint
   "modern" at the new design, add the global `themeName → root marker` hook in `NovoTheme.use()`.
3. **Confirm §2.1:** which present-day treatment becomes the `classic` baseline.
4. Stand up the **Track 2 component migration checklist** (record-page order).
