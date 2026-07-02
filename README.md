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

> Deprecated: `css/variables`, `css/variables-dark`, `css/variables-bh2026` still resolve (aliases to
> the new files) but will be removed in a future major — migrate to the `css/<theme>` paths above.
> Direct `.css`-extension imports (e.g. `css/variables.css`) no longer resolve; use the extensionless
> subpaths shown here.

#### SCSS

The design tokens are also shipped with utility mixins to make it easier to apply design tokens to
your components.

```scss
@use "novo-design-tokens/scss";

.mything {
  margin-right: 0.8rem;
}

.box {
  @include background-color(gray);
  @include color(gray, "contrast");
  @include padding("md");

  // padding: 0.6rem;
  padding-top: $spacing-md;
  color: rgba($candidate, 0.3);
  @include margin("xs");
  @include background-color(blue, "dark");
  border: 2px solid getColor(gray, "light");

  &:hover {
    color: darken($candidate, 0.13333);
  }
}

.text {
  color: $candidate;
  @include color(blue); // base
  &.xs {
    @include font("xs");
  }
  &.sm {
    @include font("sm");
  }
  &.md {
    @include font("md");
  }
  &.lg {
    @include font("lg");
  }
  &.xl {
    @include font("xl");
  }
}
```

## Development

Read more [here](DEVELOPMENT.md).

## Built with

- [Style Dictionary](https://github.com/amzn/style-dictionary)
- [clean-css](https://github.com/jakubpawlowicz/clean-css-cli)
