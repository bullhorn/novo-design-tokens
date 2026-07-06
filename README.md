# novo-design-tokens [![npm](https://img.shields.io/npm/v/novo-design-tokens?style=flat-square)](https://www.npmjs.com/package/novo-design-tokens) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/novo-design-tokens?label=gzipped%20size&style=flat-square)](https://bundlephobia.com/result?p=novo-design-tokens)

Design tokens for the Bullhorn/Novo Design System.

## Getting started

### Installing the package:

```
npm install novo-design-tokens
```

### What's included

```
novo-design-tokens/
├── lib/                    # generated js (CJS + ESM), json, and manifest.json (theme registry)
├── css/                    # generated per-theme css: bh2022(.min), bh2022-dark(.min), bh2026(.min)
└── scss/                   # scss consumption layer (variables + mixins + functions)
```

### Themes

Two themes ship today, both as CSS custom properties:

| Theme | Selector | CSS entry |
|---|---|---|
| `bh2022` (base) | `:root` (+ dark) | `novo-design-tokens/css/bh2022`, `.../bh2022-dark` |
| `bh2026` | `[data-theme="bh2026"]` | `novo-design-tokens/css/bh2026` |

The theme registry is published at `novo-design-tokens/manifest` (`lib/manifest.json`) — name,
selector, modes, and css paths per theme — so you can enumerate themes without hardcoding.

### Using the tokens

Tokens are available for web and can be included as JS, CSS variables, or SCSS variables and mixins.

#### JS

```js
import { color, spacing } from "novo-design-tokens";

document.querySelector("#el").style.backgroundColor = color.candidate; // entity color
document.querySelector("#el").style.color = color.contrast.grass; // computed contrast
document.querySelector("#el").style.padding = spacing.lg;
```

#### CSS

Import a theme's variables. The base theme (`bh2022`) applies to `:root`; add `data-theme="bh2026"`
on a container (or `:root`) to activate the modern theme.

```js
import "novo-design-tokens/css/bh2022";       // base (:root)
import "novo-design-tokens/css/bh2022-dark";  // optional dark overrides
import "novo-design-tokens/css/bh2026";       // modern ([data-theme="bh2026"])
```

> Deprecated aliases `css/variables`, `css/variables-dark`, `css/variables-bh2026` still resolve but
> will be removed in a future major — use the `css/<theme>` paths above. Extension-suffixed imports
> (`css/variables.css`) do not resolve.

#### SCSS

Ships with utility mixins and functions for applying tokens in components:

```scss
@use "novo-design-tokens/scss";

.box {
  @include padding("md");                 // spacing scale
  @include background-color(blue, "dark"); // color + variant
  @include font("lg");                     // type scale
  border: 2px solid getColor(gray, "light");
  color: rgba($candidate, 0.3);            // entity color as a var
}
```

## Development

```bash
npm install   # install dependencies
npm start     # build all token outputs
npm test      # build + regression suite
```

Themes are declared in `manifest.mjs`; the build is `build.mjs`. `bh2022` is authored as DTCG
under `src/core` + `src/themes/bh2022`; `bh2026` is generated from its Figma export in
`src/themes/bh2026`. See `CLAUDE.md` for architecture and contribution details.

## Built with

- [Style Dictionary](https://github.com/amzn/style-dictionary)
- [clean-css](https://github.com/jakubpawlowicz/clean-css-cli)
