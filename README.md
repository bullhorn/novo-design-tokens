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
├── tokens/                                 # token source files
├── lib/                                    # generated js & json files
├── css/                                    # generated css files
└── scss/                                   # generated scss files
    ├── mixins/                             # pre-built mixins for applying
    ├── breakpoint/
    │    ├── all (.scss|.css)
    │    ├── breakpoint (.scss|.css)        # breakpoint variables
    │    └── container-width (.scss|.css)   # container-width variables
    ├── color/
    │    ├── all (.scss|.css)
    │    ├── brand (.scss|.css)             # brand color variables
    │    └── ui (.scss|.css)                # ui color variables
    ├── spacing/
    │   ├── all (.scss|.css)
    │   ├── layout (.scss|.css)             # layout spacing variables
    │   └── spacing (.scss|.css)            # component spacing variables
    ├── typography/
    │   ├── all (.scss|.css)
    │   ├── font (.scss|.css)               # font variables
    │   ├── font-size (.scss|.css)          # font-size variables
    │   └── line-height (.scss|.css)        # line-height variables
    └── all (.scss|.css)                    # all variables
```

### Using the tokens

Tokens are available for web platforms for now and can be included in your project as JS, CSS variables, or SCSS variables and mixins.

#### JS

```js
import { color, size } from "novo-design-tokens";

document.querySelector("#el").style.backgroundColor = color.entity.candidate;
document.querySelector("#el").style.color = color.grass.contrast;
document.querySelector("#el").style.padding = size.spacing.lg;
```

#### CSS with webpack

Import the available `variables.css` or `variables.min.css` file. Imported CSS variables will be applied to the `:root` element.

```js
// import all tokens
import "novo-design-tokens/css/variables.css";
```

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
