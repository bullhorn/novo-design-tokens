# Theme rename plan — unified `bh<year>` scheme (`bh2022` + `bh2026`)

**Status:** planned, not yet executed. **Decision:** adopt a self-documenting `bh<year>` naming
scheme keyed to the release that introduced each look, replacing the overloaded `modern` /
`modern-light` / `classic` names:

- **`bh2026`** = the 2026 design refresh (product name "Modern"; Inter). Currently coded `modern` /
  `modern-light`, applied via `data-theme="modern"`.
- **`bh2022`** = the Novo Elements **v6 "golden" overhaul** (2022; Montserrat). This is *today's
  base/default look* — currently coded `classic` (and historically `modern-light`, before this
  project repurposed that name). It is the implicit `:root` base (no `data-theme`).
- **Light/dark stays an orthogonal axis** — the existing `theme-dark` class + its own pref, layered
  on either base. There is no `bh2022-dark`/`bh2026-dark` *themeName*.

This document is the complete, no-loose-ends checklist to execute the rename across **novo-design-tokens**,
**novo-elements**, and **novo**. **Do both renames together** — they share one normalization map
(§5) and the same sticky switch, so a split would re-introduce ambiguity. Coordinated set on the
existing `f/modern-theming` branches (the 2026 theme is pre-GA), merged together.

> ⚠️ The one genuinely non-mechanical decision is the **legacy `modern-light` normalization** (§5) —
> it's a product/rollout call, not a code call. Everything else is mechanical + verifiable.

---

## 1. Target naming scheme

**bh2026** (the 2026 refresh — an explicit `data-theme` override theme):

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

**bh2022** (the v6 golden overhaul — the **implicit base/default**, no `data-theme`):

| Concept | Before | After |
|---|---|---|
| Code key (theme identity) | `classic` (and legacy `modern-light`) | **`bh2022`** |
| `data-theme` attribute value | *(none — base `:root`)* | *(none — stays implicit base)* |
| `themeName` string (service/prefs) | `classic` | `bh2022` |
| Base token CSS | `css/variables.css` (`:root`) | **unchanged** (this *is* bh2022) |
| Base theme SCSS | `themes/light.scss` + `themes/dark.scss` | unchanged, or optionally → `bh2022-light/dark.scss` |

**Rules going forward**
- `themeName` **equals** the `data-theme` value for override themes (`bh2026`); the base theme
  `bh2022` carries **no** `data-theme` (it's the `:root` fallback). No more `-light` suffix, no more
  `startsWith('modern')` mapping.
- **Light/dark is orthogonal** — dark stays the existing `theme-dark` class + its own pref, layered
  on either base. There is no `bh2022-dark`/`bh2026-dark` *themeName*.
- `modern-light` / `modern-dark` / bare `modern` / `classic` are **fully retired** as code
  identifiers. "Modern"/"Classic" survive only as *product* words in prose, paired with the code key.
- **bh2022 stays the implicit base** for now (lowest-risk retrofit). *Future option (not now):* make it
  an explicit `[data-theme="bh2022"]` by scoping the base tokens, once a newer base overhaul needs
  bh2022 to remain separately addressable.

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
- `_defaultTheme` `{ themeName: 'modern-light' }` → `{ themeName: 'bh2022' }` (the base default — see
  §4b; the app overrides it anyway). Update the "defaults to modern-light" JSDoc.
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

## 4b. bh2022 retrofit (golden v6 / `classic` → `bh2022`)

The v6 golden overhaul **is the current base/default** — `variables.css` (`:root`), `themes/light.scss`,
`themes/dark.scss` (Montserrat). It has no separate theme file and no `data-theme`; `classic` is just
its themeName. So the retrofit is a **name-only change** (no CSS value moves, no token-build changes):

**novo-design-tokens** — none required (`variables.css` `:root` *is* bh2022; leave it as the base).
Docs only: note in `CLAUDE.md` that `:root` / `variables.css` = the bh2022 (v6 golden) base.

**novo-elements**
- `theme-options.ts`: standardize the library default `themeName` → `'bh2022'`; update the
  `applyThemeToDom` doc comment ("`bh2022`/`light` clear the attribute"). `bh2022` is **not** in
  `TOKEN_THEMES`, so it correctly falls back to `:root` (no code branch needed).
- *Optional consistency:* `git mv themes/light.scss → bh2022-light.scss`, `dark.scss → bh2022-dark.scss`,
  update `base.scss` imports + `@mixin` names. Lower value (`light`/`dark` name the *mode*), so optional.

**novo (app)**
- `novo.providers.ts` L251: default `{ themeName: 'classic' }` → `{ themeName: 'bh2022' }`.
- `Mainframe.app.ts` L158: fallback `… || 'classic'` → `… || 'bh2022'` (inside `normalizeThemeName`, §5).
- `Mainframe.app.ts` L636 (setter): off branch `'classic'` → `'bh2022'` (on branch → `'bh2026'`).

**Result:** switch OFF → `themeName='bh2022'` → no `data-theme` → base `:root` (golden v6). Switch ON →
`themeName='bh2026'` → `data-theme="bh2026"`. Consistent `bh<year>` identities on both ends.

**Also:** delete the unused stray `themes/light-test.scss` (not imported anywhere) while here.

---

## 5. Persistence & backward-compat (the critical piece)

The switch is **sticky** — `themeName` is saved per-user (`preferences.save('NovoTheme', {themeName})`)
and there is a server-side default (`settings.defaultNovoThemeName`). Existing stored values are
`classic`, `modern-light` (and possibly `modern` / `modern-dark`). Without handling, the rename would
make those read as the wrong theme.

> ⚠️ **PRODUCT DECISION — the `modern-light` value is overloaded.** Before this project,
> `modern-light` was the **default** and meant the **v6 golden (bh2022)** look. This project then
> *repurposed* `modern-light` (switch ON) to mean the **2026 refresh**. So a stored `modern-light`
> is ambiguous: for the mass of users (and the server `defaultNovoThemeName`) it means **golden
> base**; for a handful of pre-GA testers who used the new switch it means **2026**. You cannot tell
> them apart by value.
>
> **Recommendation: map legacy `modern-light`/`modern-dark` → `bh2022`** (the safe, historical
> meaning). This keeps the broad user base on the golden base — it does **not** silently GA the
> unfinished 2026 theme. The few pre-GA testers who opted into 2026 simply **re-toggle once** (the new
> switch writes the canonical `bh2026`, so it sticks). Going forward there is no ambiguity because the
> setter (§4b) now saves `bh2026`/`bh2022`, never `modern-light`.

**Fix: normalize on read (no data migration required).** Shared helper, applied at every read point:
```ts
export function normalizeThemeName(name?: string): string {
  switch (name) {
    case 'bh2026': case 'modern':           return 'bh2026'; // 'modern' was only ever the data-theme
    case 'bh2022':
    case 'classic': case 'light':
    case 'modern-light': case 'modern-dark': return 'bh2022'; // legacy golden default (see decision above)
    default:                                 return 'bh2022'; // undefined/unknown -> base
  }
}
```
Apply at:
- `Mainframe.app.ts` L158: `this.currentTheme = normalizeThemeName(savedTheme?.themeName ?? this.masterPageSDK.store.settings.defaultNovoThemeName);`
- `novo.providers.ts` L249-250: wrap `defaultNovoThemeName` in `normalizeThemeName(...)`.

On the next toggle the canonical value is written back, so prefs self-heal. A backend migration of
stored `NovoTheme` prefs / `defaultNovoThemeName` is an **optional** follow-up, not a blocker. Keep the
legacy strings recognized permanently (cheap insurance). *(If product instead wants legacy
`modern-light` → `bh2026`, flip that one case — but weigh that it would move every default user onto
the 2026 theme.)*

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
- **novo:** app compiles; switch ON → `<html data-theme="bh2026">`; switch OFF → **no** `data-theme`
  (bh2022 base); seeded legacy `classic`/`modern-light` prefs read as **OFF/bh2022** (per §5 decision);
  `--color-positive` / card / header / panels still modern when on.
- **cross-repo sweep:** `grep -rIn -iw -e modern -e classic` in code (not docs/prose) across all three
  → nothing left but intentional product-word mentions.

## 8. Loose-ends checklist

**bh2026 (override theme):**
- [ ] `data-theme` value in all 30 component SCSS + theme file + 2 app SCSS
- [ ] `themeName` strings (theme-options, demo, Mainframe setter ON-branch)
- [ ] `applyThemeToDom` `startsWith('modern')` hack → `TOKEN_THEMES` set
- [ ] Generated CSS filename + `.gitignore` + package `exports`
- [ ] Theme SCSS file + `base.scss` import + `@mixin` name
- [ ] Token source dir + `preview.css` + `build.mjs` (SOURCE/SELECTOR/fn/output/logs)
- [ ] Provisional-accent selector (novo-elements theme file + app `styles.scss`)
- [ ] Demo switch (var/method/automation-id)

**bh2022 (base retrofit):**
- [ ] `themeName 'classic'` → `'bh2022'` (providers L251, Mainframe L158 + L636 OFF-branch, theme-options default)
- [ ] Confirm `bh2022` NOT in `TOKEN_THEMES` (stays base, no `data-theme`)
- [ ] Delete unused `themes/light-test.scss`
- [ ] Optional: `themes/light.scss`/`dark.scss` → `bh2022-light/dark.scss` + imports/mixins

**Shared / both:**
- [ ] **Persisted-pref + server-default normalization** (`normalizeThemeName` at Mainframe L158 + providers L249) — includes the §5 product decision
- [ ] Docs (both repos) — code identifiers + product-word mapping note; optional `MODERN_*.md` → `BH2026_*.md`
- [ ] Snapshot republish coordination (tokens + novo-elements)
- [ ] Execute bh2022 + bh2026 **together** (shared normalization)
- [ ] Optional: `ThemeName` union type; `isModernTheme`→`isBh2026Theme`; branch rename `f/bh<year>-theming`

## 9. Rollback
All work is on unmerged feature branches with no GA impact — revert the coordinated commits if needed.
