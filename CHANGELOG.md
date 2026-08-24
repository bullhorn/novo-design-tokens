# [1.3.0](https://github.com/bullhorn/novo-design-tokens/compare/v1.2.0...v1.3.0) (2026-08-24)


### Features

* **bh2026:** Additional bh2026 tokens from Figma ([#7](https://github.com/bullhorn/novo-design-tokens/issues/7)) ([c958434](https://github.com/bullhorn/novo-design-tokens/commit/c9584347dec9b0aba12a5266ba17c3c39f957c0d))

# [1.2.0](https://github.com/bullhorn/novo-design-tokens/compare/v1.1.0...v1.2.0) (2026-08-18)


### Features

* **bh2026:** Increase semantic level tokens and refactor Figma exports ([#6](https://github.com/bullhorn/novo-design-tokens/issues/6)) ([20db0e8](https://github.com/bullhorn/novo-design-tokens/commit/20db0e8cb2ff75bc9b979cd49eb792f8127fa4db))

# [1.1.0](https://github.com/bullhorn/novo-design-tokens/compare/v1.0.0...v1.1.0) (2026-07-23)


### Features

* **bh2026:** Updated colors and semantic tokens ([062278e](https://github.com/bullhorn/novo-design-tokens/commit/062278e3f522d5765d6df880cefec50bda456846))

# [1.0.0](https://github.com/bullhorn/novo-design-tokens/compare/v0.1.4...v1.0.0) (2026-07-10)


* feat(theme)!: Add bh2026 theme and DTCG refactor ([#5](https://github.com/bullhorn/novo-design-tokens/issues/5)) ([e7fe56c](https://github.com/bullhorn/novo-design-tokens/commit/e7fe56cbd3149dda38f489100ca620a951e08531)), closes [#ffffff](https://github.com/bullhorn/novo-design-tokens/issues/ffffff) [#fff](https://github.com/bullhorn/novo-design-tokens/issues/fff)


### BREAKING CHANGES

* Refactored entire repo to be based on DTCG standard json format for style tokens

Going forward, style tokens will be generated from tools like Figma instead of created by hand from a style file hierarchy.

* fix(deps): Patch vulnerabilities and remove abandoned postcss-prettify

Upgrade handlebars (critical JS injection fix), postcss, autoprefixer,
and polished to latest minor/patch versions. Remove postcss-prettify
(unmaintained since 2016, bundles vulnerable postcss@5). Update GitHub
Actions to v4. Reduces audit vulnerabilities from 52 to 37.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

* feat(deps): Upgrade semantic-release ecosystem to v24

Upgrade semantic-release from v19 to v24.2.9 and all plugins to their
latest compatible versions. Convert release.config.js to ESM
(release.config.mjs) since semantic-release v20+ is ESM-only. Reduces
audit vulnerabilities from 37 to 3 (all 3 are unfixable bundled npm
internals).

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

* chore(deps): Upgrade postcss-cli, clean-css-cli, and sass

- postcss-cli 9.1.0 → 11.0.1
- clean-css-cli 4.3.0 → 5.6.3
- sass 1.54.9 → 1.100.0

Build output remains byte-identical. Note: sass@1.100 emits deprecation
warnings for @import (removed in Dart Sass 3.0) but this is non-breaking
and fixing it would require a breaking change to consumers.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

* feat(deps)!: Upgrade style-dictionary from v3 to v5
* Style Dictionary v5 produces slightly different output:
* CSS output files are renamed to a per-theme scheme
(variables.css -> bh2022.css, variables-dark.css -> bh2022-dark.css,
variables-bh2026.css -> bh2026.css). The extensionless export subpaths are
preserved via deprecated aliases, but direct file-path imports using the .css
extension (e.g. novo-design-tokens/css/variables.css) no longer resolve — use
the extensionless export subpaths (novo-design-tokens/css/bh2022, etc.).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

* refactor(structure): move bh2026 under src/themes + reconcile docs

Finish the tiered layout so both themes live under src/themes/ (bh2022 +
bh2026), leaving src/core/ for shared primitives. Retire the vestigial
src/tokens/ dir.

- git mv src/tokens/bh2026 -> src/themes/bh2026; remove empty src/tokens/.
- Drop the stale src/themes/bh2026/variables-bh2026.preview.css artifact.
- manifest: bh2026 source path updated; unify on `outputs` ({ light }) so both
  theme shapes share one field (drop the singular `output` + isBase branch).
- Document decisions: (5) Tier-3 bh2026 components deferred pending design
  (in flux) — committed as source of truth, wiring scoped as P5; (6) Figma
  themes are self-contained (own primitives) — shared core applies only to
  hand-authored themes; the cross-theme contract is the emitted --* var names.
- Docs: README rewritten (correct tree, JS paths, per-theme CSS + data-theme,
  deprecation notes; fixes the P4-broken .css-extension import example),
  CLAUDE.md + THEME_GENERATIONS_PLAN.md + TOKENS_MULTITHEME_REFACTOR.md
  reconciled to the implemented build; stale src/tokens paths + pre-P4 output
  filenames corrected.

Output unchanged (bh2022 + bh2026 value-identical; build green).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

* fix(pkg): declare node>=22 engines + repair stale clean script

Review findings from the post-restructure audit:
- Add `engines: { node: ">=22.0.0" }` — the repo requires Node 22 (Style
  Dictionary v5 / ESM) and documents it, but never enforced it.
- Fix `clean` to `rm -rf css lib` (was `rm -rf build`, a dir the build never
  produces, so `clean` cleaned nothing).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

* test: add zero-dep build regression guard (node:test)

Locks in the post-refactor correctness we'd been verifying by hand. `npm test`
runs build.mjs then:
- snapshots the deterministic outputs (css/bh2022, bh2022-dark, bh2026,
  scss/variables, lib/variables.json) against committed fixtures — catches
  value drift; update the fixture when a change is intentional.
- asserts invariants: bh2026 = 377 unique tokens (no parser collisions), no
  duplicate var names, no unresolved {refs} leak into any output, bh2022
  background back-compat dup present, lib/manifest.json mirrors the registry,
  every package.json export target resolves, JS artifacts have the right shape.

Uses Node's built-in runner (needs Node >=22, matching engines) — no new deps.
test/ is outside the npm `files` allowlist, so it isn't published.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

* ci: run tests on PRs/branches + gate release on tests

Wire the regression guard into CI so testing is enforced, not optional.

- Add .github/workflows/ci.yml: on every pull_request and feature-branch push,
  run `npm ci` + `npm test` (Node 22, npm cache). This is the check to require
  via branch protection on PRs to main.
- release.yml: add a `Test` step before Build so a failing suite blocks a
  release, and pin Node to 22 to match package.json engines (was lts/*).
- Re-sync package-lock.json after the engines/scripts edits so `npm ci` passes.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

* chore: add `npm start` build alias + stop tracking personal .vscode config

- Add `start` script aliasing `npm run build` (routes through build so the
  postbuild postcss+minify still runs); `build` stays for CI/prepare/hooks.
- Untrack .vscode/ and gitignore it: settings.json held only personal
  workbench color customizations (imposed one dev's theme on everyone) and
  launch.json just ran the build (now redundant with `npm start`). Local files
  are left in place, just no longer committed.
- CLAUDE.md quick reference updated to `npm start` / `npm test`.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

* docs: remove planning/working docs, tighten comments

Keep the repo to final-product files only.

- Delete planning/working docs: TOKENS_MULTITHEME_REFACTOR, THEME_GENERATIONS_PLAN,
  THEMING_PLAN, MODERN_THEME_PLAN, MODERN_DESIGN_IMPLEMENTATION, MODERN_NAMING_REVIEW,
  src/themes/bh2026/{MODERN_DESIGN_ASKS,NAMING_ALIGNMENT,README}.md, and the stale
  DEVELOPMENT.md.
- Condense verbose comment blocks in build.mjs/manifest.mjs to concise one-liners and
  drop references to the removed docs.
- CLAUDE.md: strip the migration/plan narrative, fix the now-false "no test suite" note
  (add Testing & CI), remove dangling doc links.
- README: replace the DEVELOPMENT.md link with a short inline dev section.

Build + test unchanged (12/12 pass).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

* chore(deps): update dev tooling + raise Node engine floor to >=22.14.0

Bump devDependencies to latest: style-dictionary 5.4.1->5.5.0,
sass 1.100->1.101, postcss 8.5.15->8.5.16, autoprefixer 10.5.0->10.5.2,
and release tooling semantic-release 24->25 + @semantic-release/npm 12->13.

Raise engines.node to >=22.14.0 to match semantic-release 25's floor
(Style Dictionary v5 needs >= 22). Still covers all Node-22 consumers
(novo-elements CI 22.22.0, novo engines >=22.12.0) with no EBADENGINE.

Build output is byte-identical (snapshot suite 12/12) on Node 22 and 24,
so published pre-built artifacts are unchanged for downstream consumers.
Also clears all npm audit vulnerabilities (was 20, now 0).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

* Simplify documentation

* Update guidance

* Cleanup package.json

* docs(claude): trim guidance to essentials + fix release branch

Keep the load-bearing bits (layout, two-theme-shapes architecture, the
gotchas, adding tokens/themes, exports, testing/release); drop reference-y
detail discoverable in build.mjs. Fix: release runs on main only (not
main/next/beta/alpha), per release.config.mjs.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>

* Removing commented out code

* Retrofitting border-radius values

## [0.1.4](https://github.com/bullhorn/novo-design-tokens/compare/v0.1.3...v0.1.4) (2026-04-16)


### Bug Fixes

* **release:** Add more exports ([beb7371](https://github.com/bullhorn/novo-design-tokens/commit/beb73714d343e85f3401198b6d843a28d99e7c59))

## [0.1.3](https://github.com/bullhorn/novo-design-tokens/compare/v0.1.2...v0.1.3) (2026-04-16)


### Bug Fixes

* **release:** Fix exports ([a8feeb0](https://github.com/bullhorn/novo-design-tokens/commit/a8feeb098e7de9825778143937018ba7cea1534b))

## [0.1.2](https://github.com/bullhorn/novo-design-tokens/compare/v0.1.1...v0.1.2) (2026-04-15)


### Bug Fixes

* **release:** Fix release scripts ([4ffeb83](https://github.com/bullhorn/novo-design-tokens/commit/4ffeb83d44973305ccb0e8450a495e4632d59365))

## [0.1.1](https://github.com/bullhorn/novo-design-tokens/compare/v0.1.0...v0.1.1) (2026-04-09)


### Bug Fixes

* **release:** Fix release scripts ([d576302](https://github.com/bullhorn/novo-design-tokens/commit/d576302c8905c07a045290202e0d77888307d806))

# [0.1.0](https://github.com/bullhorn/novo-design-tokens/compare/v0.0.9...v0.1.0) (2026-04-08)


### Bug Fixes

* adding color entry for task entity ([28e381d](https://github.com/bullhorn/novo-design-tokens/commit/28e381d7f060f0d9883b8af4b47d445493336a8f))
* **ESM:** Add ESM export support ([5fc95ff](https://github.com/bullhorn/novo-design-tokens/commit/5fc95ff0c822aa6e6985f16064620878f44f1fbc))
* **ESM:** Add ESM export support to novo-design-tokens ([b07d76e](https://github.com/bullhorn/novo-design-tokens/commit/b07d76e26040ce738b213040b8f3c131aae980ac))
* **ESM:** correct ESM export configuration ([ee99ed0](https://github.com/bullhorn/novo-design-tokens/commit/ee99ed0dac56547e584ff7ffeab2aa6918cd7f62))


### Features

* **Release:** Added Semantic Release ([dd359a7](https://github.com/bullhorn/novo-design-tokens/commit/dd359a7ca731028072354f7c3d7ae9625483f555))

# [0.1.0](https://github.com/bullhorn/novo-design-tokens/compare/v0.0.9...v0.1.0) (2026-04-08)


### Bug Fixes

* adding color entry for task entity ([28e381d](https://github.com/bullhorn/novo-design-tokens/commit/28e381d7f060f0d9883b8af4b47d445493336a8f))
* **ESM:** Add ESM export support ([5fc95ff](https://github.com/bullhorn/novo-design-tokens/commit/5fc95ff0c822aa6e6985f16064620878f44f1fbc))
* **ESM:** Add ESM export support to novo-design-tokens ([b07d76e](https://github.com/bullhorn/novo-design-tokens/commit/b07d76e26040ce738b213040b8f3c131aae980ac))


### Features

* **Release:** Added Semantic Release ([dd359a7](https://github.com/bullhorn/novo-design-tokens/commit/dd359a7ca731028072354f7c3d7ae9625483f555))

# [0.1.0](https://github.com/bullhorn/novo-design-tokens/compare/v0.0.9...v0.1.0) (2026-04-08)


### Bug Fixes

* adding color entry for task entity ([28e381d](https://github.com/bullhorn/novo-design-tokens/commit/28e381d7f060f0d9883b8af4b47d445493336a8f))
* **ESM:** Add ESM export support to novo-design-tokens ([b07d76e](https://github.com/bullhorn/novo-design-tokens/commit/b07d76e26040ce738b213040b8f3c131aae980ac))


### Features

* **Release:** Added Semantic Release ([dd359a7](https://github.com/bullhorn/novo-design-tokens/commit/dd359a7ca731028072354f7c3d7ae9625483f555))
