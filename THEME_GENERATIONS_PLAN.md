# Novo Theme Generations — naming convention, architecture & migration

**Status:** plan, not executed. **Decision:** name every Novo design generation **`bh<YYYY>`** by the
year its overhaul shipped, and manage the set through a **single theme registry**, so themes stay
unambiguous at the code level forever and new generations slot in by a fixed recipe (§8).

This replaces the overloaded `modern` / `modern-light` / `modern-dark` / `classic` names. It covers
the two generations that exist today (**bh2022**, **bh2026**) and defines exactly how a future
**bh2030** would be added. Spans **novo-design-tokens**, **novo-elements**, **novo**.

> ⚠️ Two non-mechanical decisions now: the legacy normalization (§7) **and** the new
> `novoRefresh2026Enabled` gating (§0). Everything else is mechanical + verifiable.

---

## 0. UPDATE (BH-101955) — mode-suffixed names + `novoRefresh2026Enabled` gating

**This section supersedes the orthogonal-mode naming in §2/§3 and the normalization in §7 where they
conflict.** Two changes landed after the original plan: theme names now carry the light/dark mode as a
suffix, and the whole 2026 refresh is gated behind a new user security setting.

### 0.1 Theme names (themeName / persisted `NovoTheme` pref)
| themeName | = | maps from (legacy) | CSS |
|---|---|---|---|
| `bh2022-light` | 2022 v6 golden, light — the base | `modern-light`, `classic`, `light` | base `:root` (no `data-theme`) |
| `bh2022-dark`  | 2022 v6 golden, dark | `modern-dark`, `dark` | base `:root` + `.theme-dark` |
| `bh2026-light` | 2026 refresh, light | `modern` | `data-theme="bh2026"` |

No `bh2026-dark` yet (no dark refresh provided — out of scope; a future one = `data-theme="bh2026"` +
`.theme-dark`). **The `data-theme` CSS hook stays the *generation* (`bh2026`)**; the `-light`/`-dark`
mode maps to the existing orthogonal `.theme-dark` class. So the 31 component selectors + token CSS use
`[data-theme="bh2026"]` (swap `modern`→`bh2026`, *not* `bh2026-light`).

### 0.2 The gate: `security.has('novoRefresh2026Enabled')`
The boolean flows in via the existing settings→security grant loop (`Mainframe.app.ts` L98-102: any
`store.settings[key] === true` is granted). The offline script sets `novoRefresh2026Enabled: true` for
the test user, so `security.has('novoRefresh2026Enabled')` resolves true.

- **Flag ABSENT / false → behave EXACTLY as main.** The refresh is neither offered nor applied. The
  data-theme CSS is already inert (never set), but the refresh's **unconditional** baseline changes must
  ALSO be gated on the flag so flag-off === main. Candidates to gate (verify the full set in impl):
  - theme default flip to `classic`/`bh2022-light` (`novo.providers.ts`, `Mainframe.app.ts` L158),
  - `accent.directive` always-neutral (novo-elements),
  - `Record.app.html` / `FastAdd.app.html` neutral-header edits,
  - the settings-dropdown switch offering "Modern".
- **Flag TRUE → refresh enabled:**
  - The switch toggles **`bh2022-light`** (off / "Classic") ↔ **`bh2026-light`** (on / "Modern").
  - **Defaults to Modern** (`bh2026-light`) so script-enabled users see the refresh immediately.
  - `applyThemeToDom('bh2026-light')` → `data-theme="bh2026"`; `bh2022-light` clears it.

### 0.3 Switch ↔ pref ↔ setting reconciliation
Single source of truth: `refreshEnabled = security.has('novoRefresh2026Enabled')`. On theme init
(`Mainframe.app.ts` L157-159):
```
saved = preferences.fetch('NovoTheme')?.themeName
currentTheme = refreshEnabled
  ? (isRefreshEraPref(saved) ? saved : 'bh2026-light')   // default ON; force-on for legacy/no pref
  : normalizeToMain(saved ?? defaultNovoThemeName ?? 'classic')  // main behavior; ignore bh2026 prefs
```
- `isModernTheme` getter → `refreshEnabled && currentTheme === 'bh2026-light'`.
- setter → `currentTheme = isModern ? 'bh2026-light' : 'bh2022-light'` (refresh world), then save + `theme.use`.
- **Inconsistencies resolved:** flag-on + legacy/no pref → default `bh2026-light` (button ON, immediate
  enable); flag-on + explicit `bh2022-light` pref → respect it (button OFF); flag-off + any `bh2026`
  pref → ignored, main behavior. `isRefreshEraPref` = pref is `bh2022-light`/`bh2026-light` (written by
  the new switch); legacy (`classic`/`modern-light`) counts as "no explicit refresh choice".

### 0.4 Open decisions
1. **First-enable default:** newly-flagged user with an OLD `classic`/`modern-light` pref → **force-on
   to Modern** (recommended: script immediately shows the refresh) vs **respect** the old pref (off).
2. **"flag-off === main" scope:** gating the baseline changes in §0.2 (default flip, accent/header
   flattening) is more work than just the data-theme CSS — confirm it's in scope vs accepting those as
   always-on.

---

## 1. Why

Three different "modern" meanings collide in code today: the 2026 refresh (product "Modern",
`data-theme="modern"`), the 2022 v6 overhaul (historically `modern-light`), and `classic` (which now
*is* the 2022 look). `golden` isn't available either — it's a **color** token (`golden-yellow`). The
fix is a boring, self-documenting convention: **`bh<YYYY>`** = "the Bullhorn/Novo design generation
released in `<YYYY>`."

---

## 2. Generation catalog

| Generation | Released | Font | Was called (code) | Role today |
|---|---|---|---|---|
| **`bh2022`** | 2022, Novo Elements **v6 "golden"** overhaul | Montserrat | `classic` (+ legacy `modern-light`) | the base / default look (`:root`) |
| **`bh2026`** | 2026 refresh (product "Modern") | Inter | `modern` / `modern-light` (switch ON) | `data-theme` override theme |
| **`bh2030`** | *(future — illustrative)* | tbd | — | added by the recipe in §8 |

**Not part of the generation name:** **light/dark is an orthogonal mode axis** — the existing
`theme-dark` class + its own preference (`Mainframe.toggleDarkMode()`), layered on any generation.
There is no `bh2022-dark` / `bh2026-dark` *themeName*; dark = `bh<year>` + `theme-dark`.

---

## 3. Naming rules (per generation, every artifact)

For a generation `bh<YYYY>`:

| Artifact | Canonical form |
|---|---|
| `themeName` (service + persisted pref) | `bh<YYYY>` |
| `data-theme` attribute value | `bh<YYYY>` (override themes only; the base carries none — see §5) |
| Root class | `.theme-bh<YYYY>` |
| Token source dir | `src/tokens/bh<YYYY>/` |
| Generated token CSS | `css/variables-bh<YYYY>.css(.min)`, scoped `:root[data-theme="bh<YYYY>"], :root.theme-bh<YYYY>` |
| Package export | `./css/variables-bh<YYYY>(.min)` |
| Semantic theme SCSS (novo-elements) | `themes/bh<YYYY>.scss` (+ `@mixin bh<YYYY>-variables`) |
| Registry entry | one row in the theme registry (§4) |

"Modern" / "Classic" survive only as **product words in prose**, always paired with the code key,
e.g. *"the Modern theme (code: `bh2026`)."*

---

## 4. Single source of truth — the theme registry

The mechanism that keeps generations straight and makes them additive. One registry per side.

**novo-elements — runtime catalog** (new file, e.g. `elements/common/theme/theme-generations.ts`).
Per §0, themeNames are mode-suffixed but the `data-theme` hook is the generation:
```ts
export interface Theme {
  name: string;                 // themeName / pref: 'bh2022-light' | 'bh2022-dark' | 'bh2026-light'
  generation: string;           // 'bh2022' | 'bh2026' — the data-theme value
  mode: 'light' | 'dark';
  isBase?: boolean;             // generation renders as the :root base (no data-theme)
  legacyAliases: string[];      // stored strings that normalize to this theme
}

export const THEMES: Theme[] = [
  { name: 'bh2022-light', generation: 'bh2022', mode: 'light', isBase: true,  legacyAliases: ['classic', 'light', 'modern-light'] },
  { name: 'bh2022-dark',  generation: 'bh2022', mode: 'dark',  isBase: true,  legacyAliases: ['dark', 'modern-dark'] },
  { name: 'bh2026-light', generation: 'bh2026', mode: 'light', isBase: false, legacyAliases: ['modern'] },
];
export const DEFAULT_THEME = 'bh2022-light';   // main default; the flag-on default is 'bh2026-light' (§0.3)
```
Drives:
- `applyThemeToDom(name)`: look up the theme; `if (!t.isBase) root.dataset.theme = t.generation; else remove`;
  `root.classList.toggle('theme-dark', t.mode === 'dark')`. Replaces the `startsWith('modern')` hack.
- `normalizeThemeName(stored)` (§7): match `stored` against `name`/`legacyAliases`.
- The app's theme-switch options + the `novoRefresh2026Enabled` gate (§0.2–0.3).

**novo-design-tokens — build manifest** (`build.mjs`): replace the single `buildModern()` with a
generation loop, so adding a generation is one array entry:
```js
const GENERATIONS = [
  { name: 'bh2026', source: 'src/tokens/bh2026/subatomic.figma-export.json' },
  // bh2022 currently uses the classic value/darkValue pipeline (the :root base) — not this loop yet.
];
GENERATIONS.forEach(buildGeneration); // emits css/variables-<name>.css scoped [data-theme="<name>"]
```
This aligns with the repo's stated long-term trajectory (CLAUDE.md) of an N-theme registry converging
on the Figma tiered/semantic model.

---

## 5. Architecture — base vs explicit (phased)

**Phase A — near-term (low risk, ready now).** Exactly one generation is the implicit `:root` **base**
(`bh2022` today, `isBase: true`, no `data-theme`); every other generation is an explicit
`[data-theme=bh<YYYY>]` override (`bh2026`). This matches how the code already works — minimal change.

**Phase B — target symmetry (do when it earns its keep, e.g. adding bh2030 or swapping the default).**
Make **every** generation an explicit `[data-theme=bh<YYYY>]` peer:
- Move the base token set out of bare `:root` into `[data-theme="bh2022"]`; leave `:root` holding only
  cross-generation primitives + a safe fallback.
- Always set `data-theme` on `<html>` (even the default), driven by the registry (`isBase` retires).
- Now bh2022 / bh2026 / bh2030 are identical in shape; the "default" is just which name the registry
  marks default — no "base swap" gymnastics when a new generation becomes default.

**Recommendation:** ship **Phase A** with the rename (§6); adopt **Phase B** when the third generation
(bh2030) lands or when the default generation changes — whichever comes first. The §8 recipe notes the
small delta between the two.

---

## 6. Phase A migration — the rename (concrete, per repo)

Execute **bh2022 + bh2026 together** on the working branches (`f/modern-theming`, being renamed to
`f/BH-101949-novo-refresh`) — shared normalization; the 2026 theme is pre-GA. Dependency order:
tokens → novo-elements → novo; publish snapshots between.

### 6.1 novo-design-tokens (bh2026 build)
- `build.mjs`: `MODERN_SOURCE` → `src/tokens/bh2026/subatomic.figma-export.json`; `SELECTOR` →
  `:root[data-theme="bh2026"], :root.theme-bh2026`; `buildModern()` → `buildBh2026()` (or the §4
  `GENERATIONS` loop); output `css/variables-bh2026.css`; header comment + `console.log` string.
- `package.json` exports `./css/variables-modern(.min)` → `…-bh2026(.min)`.
- `.gitignore`: `css/variables-modern.*` → `css/variables-bh2026.*`.
- `git mv src/tokens/modern/` → `src/tokens/bh2026/` (incl. `variables-modern.preview.css` →
  `variables-bh2026.preview.css`).
- **bh2022:** none — `variables.css` (`:root`) *is* bh2022 in Phase A. Docs note only.
- **Verify:** `npm run build` → `css/variables-bh2026.css`, selector/header say `bh2026`, 377/0-unresolved.

### 6.2 novo-elements
- `git mv styles/themes/modern.scss` → `themes/bh2026.scss`; inside: `@mixin modern-variables` →
  `bh2026-variables`, selector → `[data-theme='bh2026']`, header/provisional-accent comments.
- `styles/base.scss` import → `./themes/bh2026`.
- **31 component SCSS files** (grew via Wave-3 + polish; the sed is list-agnostic so it catches all) —
  swap every `data-theme='modern'` / `data-theme="modern"` / `theme-modern`
  → `bh2026`. Scripted from `projects/novo-elements/src/elements`:
  ```bash
  grep -rlZ -e "data-theme='modern'" -e 'data-theme="modern"' -e 'theme-modern' . \
    | xargs -0 sed -i '' -e "s/data-theme='modern'/data-theme='bh2026'/g" \
                         -e 's/data-theme="modern"/data-theme="bh2026"/g' \
                         -e 's/theme-modern/theme-bh2026/g'
  ```
  Files: autocomplete, breadcrumbs, button, card, color-picker, data-table, date-picker, dropdown,
  expansion, field, header, menu, modal (×2: modal + notification), picker-results, popover, progress,
  search, select-search, select, simple-table, stepper, switch, tabs, tiles, time-picker, tip-well,
  toast, toolbar, tooltip.
- `theme-options.ts`: add the registry (§4); replace `applyThemeToDom`'s `startsWith('modern')` with
  the registry lookup; default `themeName` → `'bh2022'`; update JSDoc. Add a typed
  `ThemeName = 'bh2022' | 'bh2026' | ...` on `NovoThemeOptions`.
- Demo (`projects/demo/app/app.component.ts` + `.html`): `'modern-light'` → `'bh2026'`; rename
  `modernTheme`→`bh2026Theme`, `toggleModernTheme()`→`toggleBh2026Theme()`; `data-automation-id`
  `theme-modern-switch`→`theme-bh2026-switch`.
- Republish `novo-elements-snapshot`.

### 6.3 novo (app — bh2026 side)
The visual-polish work added more `[data-theme='modern']` styling — now **5 app/lib scss files** (was 2).
Swap the attribute value across all of them with the same sed, from the novo repo root:
```bash
grep -rlZ -e "data-theme='modern'" -e 'data-theme="modern"' -e 'theme-modern' apps libs \
  | xargs -0 sed -i '' -e "s/data-theme='modern'/data-theme='bh2026'/g" \
                       -e 's/data-theme="modern"/data-theme="bh2026"/g' \
                       -e 's/theme-modern/theme-bh2026/g'
```
Covers: `apps/novo/styles.scss` (incl. the provisional-accent selector),
`apps/novo/app/record/Record.main.scss` (frosted `#novo-record-header`),
`apps/novo/app/record/components/workflow/Workflow.scss` (neutral workflow),
`apps/novo/app/resources/components/dashboard/extras/two-column-layout/TwoColumnLayout.scss` (24px gaps),
`libs/shared/src/components/profile-header-fields/profile-header-fields.component.scss` (airy header).
Then, not caught by the sed:
- `apps/novo/styles.scss` import: `@import 'novo-elements/styles/themes/modern'` → `…/themes/bh2026`.
- `Mainframe.app.ts` L632 (`isModernTheme`): `=== 'modern-light'` → `=== 'bh2026'`; L636 setter ON-branch
  → `'bh2026'`. Optional: rename `isModernTheme`→`isBh2026Theme` (+ template binding).

### 6.4 bh2022 retrofit (name-only)
The v6 golden look **is** the base (`variables.css :root`, `themes/light.scss`/`dark.scss`, Montserrat).
No CSS moves in Phase A — just the name:
- `novo.providers.ts` L251: `{ themeName: 'classic' }` → `{ themeName: 'bh2022' }`.
- `Mainframe.app.ts` L158: fallback `… || 'classic'` → `… || 'bh2022'` (inside `normalizeThemeName`).
- `Mainframe.app.ts` L636 setter OFF-branch: `'classic'` → `'bh2022'`.
- Delete unused stray `themes/light-test.scss`.
- *Optional consistency:* `git mv themes/light.scss → bh2022-light.scss`, `dark.scss → bh2022-dark.scss`
  (+ `base.scss` imports, `@mixin` names). Files name the *mode*, so this is optional.

---

## 7. Persistence & backward-compat (+ the product decision)

The switch is **sticky** — `themeName` is saved per-user (`preferences.save('NovoTheme', {themeName})`)
plus a server default (`settings.defaultNovoThemeName`). Legacy stored values: `classic`, `modern-light`,
maybe `modern` / `modern-dark`.

> ⚠️ **PRODUCT DECISION — `modern-light` is overloaded.** Pre-project it was the **default** and meant
> the **v6 golden (bh2022)** look; this project *repurposed* it (switch ON) to mean **bh2026**. A stored
> `modern-light` is therefore ambiguous — for the mass of users + the server default it means golden;
> for a few pre-GA testers it means 2026 — indistinguishable by value.
>
> **Recommendation: legacy `modern-light`/`modern-dark` → `bh2022`** (safe historical meaning; does
> **not** silently GA the unfinished 2026 theme to every default user). Pre-GA 2026 testers re-toggle
> **once** (the setter now writes canonical `bh2026`, so it sticks). No forward ambiguity.

**DECIDED (per product):** `modern-light` → `bh2022-light`, `modern-dark` → `bh2022-dark`,
`modern` → `bh2026-light`. (So legacy does **not** silently move onto the 2026 refresh — it maps to the
golden generation.) Raw legacy→name mapping:
```ts
export function normalizeThemeName(stored?: string): string {
  switch (stored) {
    case 'bh2026-light': case 'modern':                    return 'bh2026-light';
    case 'bh2022-dark':  case 'modern-dark':  case 'dark':  return 'bh2022-dark';
    case 'bh2022-light': case 'modern-light': case 'classic': case 'light':
    default:                                               return 'bh2022-light'; // base
  }
}
```
This is the pure name mapping. **The flag-gated default/override behavior in §0.3 takes precedence** —
e.g. when `novoRefresh2026Enabled` is on with no explicit refresh-era pref, the theme defaults to
`bh2026-light` (Modern) regardless of this mapping; when the flag is off, any `bh2026-light` pref is
ignored (main behavior). Apply normalization at `Mainframe.app.ts` L157-159 and `novo.providers.ts`
L249-250. Keep legacy aliases recognized permanently (cheap insurance).

---

## 8. Adding a future generation — the `bh2030` recipe (the payoff)

With the convention + registry, a new generation is **additive** — no renames, no hunting:

**novo-design-tokens**
1. Add the Figma export at `src/tokens/bh2030/subatomic.figma-export.json`.
2. Add `{ name: 'bh2030', source: 'src/tokens/bh2030/subatomic.figma-export.json' }` to `GENERATIONS`.
3. `npm run build` → `css/variables-bh2030.css` (scoped `[data-theme="bh2030"]`); add the package export.

**novo-elements**
4. Add `themes/bh2030.scss` (semantic map + `@mixin bh2030-variables`, selector `[data-theme='bh2030']`);
   import it in `base.scss`.
5. Add `{ name: 'bh2030', releaseYear: 2030, isBase: false, legacyAliases: [] }` to `THEME_GENERATIONS`.
   `applyThemeToDom` + `normalizeThemeName` pick it up automatically.
6. Add component `[data-theme='bh2030']` overrides **only where bh2030 diverges** from the base.

**novo**
7. Add `bh2030` to the theme-switch options — no structural change (the registry drives behavior).

**If on Phase B (§5):** bh2030 is a peer with zero special-casing. **On Phase A:** bh2030 is another
override alongside bh2026 (still additive). Promoting a new generation to *default* is the moment to
adopt Phase B.

---

## 9. Order · verification · rollback

**Order:** tokens → novo-elements (verify in **demo**, NE deps installed) → novo (verify in **app**, NE
symlinked via `novo-with-novo-elements-sources`). Merge together. No dual-accept period needed pre-GA
(normalization handles the only stateful concern). *If ever needed later:* `applyThemeToDom` sets both
attrs + selectors match `[data-theme='modern'], [data-theme='bh2026']`, then drop the old one.

**Verify (all three):**
- tokens: `css/variables-bh2026.css` generated; selector/header say `bh2026`; 377/0-unresolved.
- novo-elements: demo compiles clean; `grep -rIn -e "data-theme=.modern" -e "theme-modern" -e "'modern-light'" -e "variables-modern" -e "buildModern" projects/novo-elements/src` → empty.
- novo: app compiles; switch ON → `<html data-theme="bh2026">`; switch OFF → no `data-theme` (bh2022
  base); seeded legacy `classic`/`modern-light` prefs read as **OFF/bh2022** (§7); accent/card/header
  still modern when on.
- cross-repo sweep: `grep -rIn -iw -e modern -e classic` in **code** → only intentional product-word prose.

**Rollback:** all on unmerged feature branches, no GA impact — revert the coordinated commits.

---

## 10. Loose-ends checklist

**bh2026 (override theme)**
- [ ] `data-theme` value: 31 component SCSS + theme file (novo-elements) + 5 app/lib SCSS (novo)
- [ ] `themeName` strings: theme-options, demo, Mainframe setter ON-branch
- [ ] `applyThemeToDom` `startsWith('modern')` → registry lookup
- [ ] generated CSS name + `.gitignore` + package `exports`
- [ ] theme SCSS file + `base.scss` import + `@mixin` name
- [ ] token dir + `preview.css` + `build.mjs` (source/selector/fn/output/logs)
- [ ] provisional-accent selector (novo-elements theme file + app `styles.scss`)
- [ ] demo switch (var/method/automation-id)

**bh2022 (base retrofit)**
- [ ] `themeName 'classic'` → `'bh2022'` (providers L251, Mainframe L158 + L636 OFF-branch, theme-options default)
- [ ] `bh2022` marked `isBase` in registry → stays base (no `data-theme`)
- [ ] delete `themes/light-test.scss`
- [ ] optional: `themes/light.scss`/`dark.scss` → `bh2022-light/dark.scss`

**`novoRefresh2026Enabled` gating (§0)**
- [ ] mode-suffixed themeNames (`bh2022-light`/`bh2022-dark`/`bh2026-light`); `data-theme="bh2026"` (generation) + `.theme-dark` for mode
- [ ] `refreshEnabled = security.has('novoRefresh2026Enabled')` gate; flag OFF === main (gate the baseline changes in §0.2, not just the CSS)
- [ ] switch getter/setter → `bh2026-light` (on) / `bh2022-light` (off); default Modern when flag-on
- [ ] switch ↔ pref ↔ setting reconciliation (§0.3); resolve §0.4 open decisions with product

**Shared / architecture**
- [ ] theme **registry** added (novo-elements catalog + tokens build manifest) — the "keep-them-straight" backbone
- [ ] `normalizeThemeName` at both read points (incl. §7 product decision)
- [ ] `ThemeName` union type
- [ ] docs both repos: code keys + product-word map; optional `MODERN_*.md` → `BH*.md`
- [ ] snapshot republish coordination (tokens + novo-elements)
- [ ] **execute bh2022 + bh2026 together**
- [ ] Phase B + `bh2030` recipe (§8) captured for future; optional branch rename `f/bh-theming`
