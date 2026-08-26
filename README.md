# novo-design-tokens [![npm](https://img.shields.io/npm/v/novo-design-tokens?style=flat-square)](https://www.npmjs.com/package/novo-design-tokens)

Design tokens for the Bullhorn/Novo Design System.

## Using the tokens

```
npm install novo-design-tokens
```

### Themes

| Theme             | Selector                | CSS entry                                          |
|-------------------|-------------------------|----------------------------------------------------|
| `bh2022` (base)   | `:root`                 | `novo-design-tokens/css/bh2022`, `.../bh2022-dark` |
| `bh2026` (modern) | `[data-theme="bh2026"]` | `novo-design-tokens/css/bh2026`                    |

### CSS

```js
import "novo-design-tokens/css/bh2022";       // base (:root)
import "novo-design-tokens/css/bh2022-dark";  // optional dark overrides
import "novo-design-tokens/css/bh2026";       // modern ([data-theme="bh2026"])
```

> In Sass, use the extensionless path so variables are inlined. A `.css` suffix makes Sass emit a passthrough `@import`.

### SCSS

```scss
@use "novo-design-tokens/scss";

.box {
  @include padding("md");
  @include background-color(blue, "dark");
  @include font("lg");
  border: 2px solid getColor(gray, "light");
  color: rgba($candidate, 0.3);
}
```

### JS

```js
import {color, spacing} from "novo-design-tokens";

document.querySelector("#el").style.backgroundColor = color.candidate;
document.querySelector("#el").style.padding = spacing.lg;
```

The theme registry at `novo-design-tokens/manifest` (`lib/manifest.json`) lists all themes, selectors, and CSS paths.

## Updating tokens (developers)

### bh2022 (hand-authored)

Edit the DTCG source files directly:

- Primitives: `src/core/<category>.json`
- Semantic + components: `src/themes/bh2022/`

Then rebuild:

```bash
npm start
```

### bh2026 (Figma-sourced)

1. Export updated tokens from Figma as JSON.
2. Replace the files in `src/themes/bh2026/`:
    - `core.figma-export.json`
    - `tier-1.figma-export.json`
    - `tier-2.figma-export.json`
    - `semantic.figma-export.json`
3. Rebuild:

```bash
npm start
```

That's it — the build resolves aliases and converts Figma's color format automatically.

### Verify

```bash
npm test   # build + regression suite (snapshots + invariants)
```

Intentional output changes require updating fixtures in `test/fixtures/`.

See `CLAUDE.md` for architecture details.
