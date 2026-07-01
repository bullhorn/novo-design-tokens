# Theme rename plan — `modern` → `bh2026`

**Status:** planned, not yet executed. **Decision:** the 2026 design refresh (product name
"Modern") gets the code key **`bh2026`** to end the overload with the retired 5-year-old
`modern-light`/`modern-dark` theme (and with `classic`, which now *is* the old modern-light look).

This document is the complete, no-loose-ends checklist to execute the rename across **novo-design-tokens**,
**novo-elements**, and **novo**. Do the whole thing as a coordinated set on the existing
`f/modern-theming` branches (the theme is pre-GA, behind the sticky switch), then merge together.

---

## 1. Target naming scheme

| Concept | Before | After |
|---|---|---|
| Code key (theme identity) | `modern` / `modern-light` | **`bh2026`** |
| `data-theme` attribute value | `modern` | `bh2026` |
| Root class | `.theme-modern` | `.theme-bh2026` |
| `themeName` string (service/prefs) | `modern-light` | `bh2026` |
| Theme SCSS file | `themes/modern.scss` | `themes/bh2026.scss` |
| Token source dir | `src/tokens/modern/` | `src/tokens/bh2026/` |
| Generated CSS | `css/variables-modern.css(.min)` | `css/variables-bh2026.css(.min)` |
| Package export | `./css/variables-modern(.min)` | `./css/variables-bh2026(.min)` |
| Build fn | `buildModern()` | `buildBh2026()` |

**Rules going forward**
- `themeName` **equals** the `data-theme` value (both `bh2026`). No more `-light` suffix, no more
  `startsWith('modern')` mapping.
- **Light/dark is orthogonal** — dark stays the existing `theme-dark` class layered on any base.
  So there is no `bh2026-dark` themeName; a future dark variant is `bh2026` + `theme-dark`.
- `classic` (default, today's production look) and the `theme-dark` class are **unchanged**.
- `modern-light` / `modern-dark` / bare `modern` are **fully retired** as code identifiers. "Modern"
  survives only as the *product* word in prose/docs, always paired with "(code: `bh2026`)".

---

## 2. novo-design-tokens

**`build.mjs`**
- `MODERN_SOURCE` → `BH2026_SOURCE = "src/tokens/bh2026/subatomic.figma-export.json"`.
- `SELECTOR` → `:root[data-theme="bh2026"], :root.theme-bh2026`.
- `buildModern()` → `buildBh2026()` (and its call site at the bottom).
- Output path `css/variables-modern.css` → `css/variables-bh2026.css`.
- Generated-header comment + the `console.log("css/variables-modern.css …")` string.

**`package.json`**
- Exports `./css/variables-modern` and `./css/variables-modern.min` → `…-bh2026(.min)`.

**`.gitignore`**
- Update the ignore entry for `css/variables-modern.*` → `css/variables-bh2026.*`.

**Directory + artifacts**
- `git mv src/tokens/modern/` → `src/tokens/bh2026/`. Contents: `subatomic.figma-export.json`,
  `components.figma-export.json`, `README.md`, `NAMING_ALIGNMENT.md`, `MODERN_DESIGN_ASKS.md`,
  and `variables-modern.preview.css` → `variables-bh2026.preview.css`.

**Docs** (prose — keep "Modern" as product term, update code identifiers + add the mapping note):
`CLAUDE.md`, `MODERN_THEME_PLAN.md`, `MODERN_DESIGN_IMPLEMENTATION.md`, `MODERN_NAMING_REVIEW.md`,
`src/tokens/bh2026/README.md`, `NAMING_ALIGNMENT.md`, `MODERN_DESIGN_ASKS.md`. Optionally rename the
`MODERN_*.md` files to `BH2026_*.md`.

**Verify:** `npm run build` → `css/variables-bh2026.css` exists, header + selector say `bh2026`,
377 tokens / 0 unresolved.

---

## 3. novo-elements

**Theme file**
- `git mv projects/novo-elements/src/styles/themes/modern.scss` → `themes/bh2026.scss`.
- Inside: `@mixin modern-variables` → `bh2026-variables` (+ its `@include`); selector block
  `:root[data-theme='modern'], :root.theme-modern` → `bh2026`; the header comment referencing
  `variables-modern(.min).css` and `[data-theme="modern"]`; the **provisional accent** comment.
- `projects/novo-elements/src/styles/base.scss` — `@import "./themes/modern"` → `./themes/bh2026`.

**Component SCSS — 30 files** (every `data-theme='modern'` / `data-theme="modern"` / `.theme-modern`
→ `bh2026`). Mechanical; the three selector shapes (`:host-context([data-theme='…'])`,
`::ng-deep [data-theme='…'] .x`, plain `[data-theme='…']`) all just need the value swapped:

```
autocomplete/autocomplete.component.scss   breadcrumbs/Breadcrumb.scss
button/styles/button.scss                  card/Card.scss
color-picker/color-picker.component.scss   data-table/data-table.component.scss
date-picker/DatePicker.scss                dropdown/Dropdown.scss
expansion/expansion-panel.scss             field/field.scss
header/Header.scss                         menu/menu-content.component.scss
modal/modal.component.scss                 modal/notification.component.scss
picker/extras/picker-results/PickerResults.scss   popover/PopOver.scss
progress/ProgressBar.scss                  search/SearchBox.scss
select-search/select-search.component.scss select/Select.scss
simple-table/table.scss                    stepper/stepper.component.scss
switch/Switch.scss                         tabs/tab.scss
tiles/Tiles.scss                           time-picker/TimePicker.scss
tip-well/TipWell.scss                      toast/Toast.scss
toolbar/toolbar.component.scss             tooltip/Tooltip.scss
```

Safe scripted edit (from `projects/novo-elements/src/elements`):
```bash
grep -rlZ -e "data-theme='modern'" -e 'data-theme="modern"' -e 'theme-modern' . \
  | xargs -0 sed -i '' -e "s/data-theme='modern'/data-theme='bh2026'/g" \
                       -e 's/data-theme="modern"/data-theme="bh2026"/g' \
                       -e 's/theme-modern/theme-bh2026/g'
```

**`elements/common/theme/theme-options.ts`** — replace the `themeName.startsWith('modern')` hack in
`applyThemeToDom` with an explicit token-theme set, and update the default + the doc comment:
```ts
const TOKEN_THEMES = new Set(['bh2026']); // themes with a [data-theme] token contract
private applyThemeToDom(themeName: string): void {
  const root = document.documentElement; if (!root) return;
  if (TOKEN_THEMES.has(themeName)) { root.dataset.theme = themeName; }
  else { root.removeAttribute('data-theme'); }
}
```
- `_defaultTheme` `{ themeName: 'modern-light' }` → `{ themeName: 'bh2026' }` (or `'classic'` — pick the
  library default; app overrides it anyway). Update the "defaults to modern-light" JSDoc.
- Consider typing: `export type ThemeName = 'classic' | 'bh2026' | 'dark' | 'light';` and use it on
  `NovoThemeOptions.themeName` / `_ThemeService` instead of `string`.

**Demo** (`projects/demo/app/app.component.ts` + `.html`)
- `'modern-light'` → `'bh2026'`; rename `modernTheme` → `bh2026Theme`, `toggleModernTheme()` →
  `toggleBh2026Theme()`; comment on line 115; `data-automation-id="theme-modern-switch"` →
  `"theme-bh2026-switch"`.

**Point at the renamed tokens** — if `novo-elements` (or its snapshot build) imports
`novo-design-tokens/css/variables-modern`, update to `…-bh2026` (currently not loaded, but confirm).

**Verify:** demo compiles; `grep -rIn "modern" projects/novo-elements/src` returns only intentional
prose. Republish the `novo-elements-snapshot` so the app gets `themes/bh2026.scss`.

---

## 4. novo (app)

**`apps/novo/styles.scss`**
- `@import 'novo-elements/styles/themes/modern'` → `…/themes/bh2026`.
- The **provisional-accent** block selector `:root[data-theme='modern'], :root.theme-modern` → `bh2026`.

**`apps/novo/app/record/Record.main.scss`**
- The frosted `#novo-record-header` rule: `:root[data-theme='modern'] &` → `:root[data-theme='bh2026'] &`.

**`apps/novo/app/mainframe/app/Mainframe.app.ts`**
- L158 (read): normalize the saved/default value (see §5).
- L632 (`isModernTheme` getter): `this.currentTheme === 'modern-light'` → `=== 'bh2026'`.
- L636 (setter): `isModern ? 'modern-light' : 'classic'` → `'bh2026' : 'classic'`.
- L641 save is fine (writes canonical `currentTheme`).
- Optional: rename `isModernTheme` → `isBh2026Theme` (+ its template binding in `Mainframe.app.html`).

**`apps/novo/app/novo.providers.ts`** (L249-251)
- The initial-theme provider reads `window.NOVO_SESSION.settings.defaultNovoThemeName`; normalize it
  (see §5) so a legacy `modern-light` server default maps to `bh2026`.

**Verify:** app compiles; toggle ON sets `<html data-theme="bh2026">`; provisional accent still applies.

---

## 5. Persistence & backward-compat (the critical piece)

The switch is **sticky** — `themeName` is saved per-user (`preferences.save('NovoTheme', {themeName})`)
and there is a server-side default (`settings.defaultNovoThemeName`). Existing stored values are
`modern-light` (and possibly `modern` / `modern-dark`). Without handling, those users' switch would
read as **off** after the rename.

**Fix: normalize on read (no data migration required).** Add a shared helper and apply it at every
read point:
```ts
export function normalizeThemeName(name?: string): string {
  switch (name) {
    case 'modern': case 'modern-light': case 'modern-dark': return 'bh2026';
    case 'bh2026': return 'bh2026';
    default: return 'classic'; // classic / light / undefined
  }
}
```
Apply at:
- `Mainframe.app.ts` L158: `this.currentTheme = normalizeThemeName(savedTheme?.themeName ?? this.masterPageSDK.store.settings.defaultNovoThemeName);`
- `novo.providers.ts` L249-250: wrap `defaultNovoThemeName` in `normalizeThemeName(...)`.

On the next toggle the canonical `bh2026` is written back, so stored values self-heal. A backend
migration of stored `NovoTheme` prefs / `defaultNovoThemeName` is an **optional** follow-up, not a
blocker (normalization covers it indefinitely). Keep the legacy strings recognized in
`normalizeThemeName` permanently (cheap insurance).

---

## 6. Order of operations (coordinated, pre-GA big-bang)

The `data-theme` value is a **cross-repo contract** (tokens emit `[data-theme=bh2026]`; novo-elements
sets + selects it; novo imports it). Execute in dependency order on the `f/modern-theming` branches:

1. **novo-design-tokens** — rename (§2), `npm run build`, commit, publish package/snapshot.
2. **novo-elements** — rename (§3), point at new tokens, verify in **demo** (NE deps installed),
   commit, publish `novo-elements-snapshot`.
3. **novo** — rename (§4) + normalization (§5), point at new snapshot, verify in **app**
   (NE symlinked via `novo-with-novo-elements-sources`).

Merge the three together. Because the theme is pre-GA and normalization handles the only stateful
concern, no dual-accept transition period is needed. (If a dual period were ever required:
temporarily have `applyThemeToDom` set both attrs and let component selectors match
`[data-theme='modern'], [data-theme='bh2026']`, then drop `modern`.)

---

## 7. Final verification (all three repos)

- **tokens:** `css/variables-bh2026.css` generated; selector + header say `bh2026`; 377/0-unresolved.
- **novo-elements:** demo compiles clean; `grep -rIn -e "data-theme=.modern" -e "theme-modern" -e "'modern-light'" -e "variables-modern" -e "buildModern" projects/novo-elements/src` → empty.
- **novo:** app compiles; `<html data-theme="bh2026">` when toggled on; a seeded legacy `modern-light`
  pref reads as **on** (normalization); `--color-positive` / card / header / panels still modern.
- **cross-repo sweep:** `grep -rIn -iw modern` in code (not docs/prose) across all three → nothing
  left but intentional product-word mentions.

## 8. Loose-ends checklist
- [ ] `data-theme` value in all 30 component SCSS + theme file + 2 app SCSS
- [ ] `themeName` strings (theme-options default, demo, Mainframe getter/setter)
- [ ] `applyThemeToDom` `startsWith('modern')` hack replaced
- [ ] **Persisted-pref + server-default normalization** (Mainframe L158, providers L249)
- [ ] Generated CSS filename + `.gitignore` + package `exports`
- [ ] Theme SCSS file + `base.scss` import + `@mixin` name
- [ ] Token source dir + `preview.css` + `build.mjs` (SOURCE/SELECTOR/fn/output/logs)
- [ ] Provisional-accent selector (both novo-elements theme file + app `styles.scss`)
- [ ] Demo switch (var/method/automation-id)
- [ ] Docs (both repos) + optional `MODERN_*.md` → `BH2026_*.md`
- [ ] Snapshot republish coordination (tokens + novo-elements)
- [ ] Optional: `ThemeName` union type; `isModernTheme`→`isBh2026Theme`; branch rename `f/bh2026-theming`

## 9. Rollback
All work is on unmerged feature branches with no GA impact — revert the coordinated commits if needed.
