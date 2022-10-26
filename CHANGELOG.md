# [1.0.0-beta.6](https://github.com/bullhorn/novo-design-tokens/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2022-09-14)


### Bug Fixes

* **scss:** removing some old mixins ([8296ebd](https://github.com/bullhorn/novo-design-tokens/commit/8296ebda62a25d955accf4c93ea58258f40d8835))

# [1.0.0-beta.5](https://github.com/bullhorn/novo-design-tokens/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2022-09-14)


### Bug Fixes

* **scss:** helpers were excluded ([c81c9ff](https://github.com/bullhorn/novo-design-tokens/commit/c81c9ff9a30ca9d6897fddbe224c12bd6a6b6466))

# [1.0.0-beta.4](https://github.com/bullhorn/novo-design-tokens/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2022-09-14)


### Bug Fixes

* **scss:** removed variables.scss reference ([bc4cc4a](https://github.com/bullhorn/novo-design-tokens/commit/bc4cc4a230410a4dce4a54a684687ae5c7bff69c))

# [1.0.0-beta.3](https://github.com/bullhorn/novo-design-tokens/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2022-09-14)


### Bug Fixes

* **build:** removed prepublish script ([8b959f8](https://github.com/bullhorn/novo-design-tokens/commit/8b959f8a71df72e705826f9c964216481b54d057))

# [1.0.0-beta.2](https://github.com/bullhorn/novo-design-tokens/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2022-09-14)


### Bug Fixes

* **scss:** Mixin merge conflict ([89ac746](https://github.com/bullhorn/novo-design-tokens/commit/89ac746e724415f9bd4fd24f32e9cac21af68507))

# [1.0.0-beta.1](https://github.com/bullhorn/novo-design-tokens/compare/v0.1.0-beta.1...v1.0.0-beta.1) (2022-09-14)


* Merge pull request #3 from bullhorn/f/full-theme ([2f23ac0](https://github.com/bullhorn/novo-design-tokens/commit/2f23ac0abfc72fd6edfc9b1d967eab89756e0933)), closes [#3](https://github.com/bullhorn/novo-design-tokens/issues/3)


### BREAKING CHANGES

* Full Theme Support (WIP)
Major Changes and Features Added
- [x] Figma Token Generation
- [x] Component Specific Tokens
- [x] Theming support
- [x] APAC Contrast Color Generation

Still a WIP as we add the remaining component tokens
Talent and Novo theme files are generated but "Values" are not currently "accurate"
SCSS Mixins are being updated with helper to add and use css variables. SCSS variables will be removed.

Breaking Changes for NDS users:
- "Named" Color Variables are currently deprecated and most have been removed.
- Added new palette with generated color variables
  -  Use  `red`, `pink`, `orange`, `yellow`, `green`, `teal`, `blue`, `aqua`, `indigo`, `violet`, `gray`
  -  Palette adds `hex` color based on a `hcl` scale of 10,15,20-90,95,98.  ie. `var(--palette-blue-50)`

# [0.1.0-beta.1](https://github.com/bullhorn/novo-design-tokens/compare/v0.0.9...v0.1.0-beta.1) (2022-09-14)


### Bug Fixes

* adding color entry for task entity ([28e381d](https://github.com/bullhorn/novo-design-tokens/commit/28e381d7f060f0d9883b8af4b47d445493336a8f))


### Features

* **Release:** Added Semantic Release ([dd359a7](https://github.com/bullhorn/novo-design-tokens/commit/dd359a7ca731028072354f7c3d7ae9625483f555))
