import StyleDictionary from "style-dictionary";
import { minifyDictionary } from "style-dictionary/utils";
import { writeFileSync } from "node:fs";
import { THEMES, BASE_THEME, FIGMA_THEMES } from "./manifest.mjs";

// Base theme (bh2022) — tiered DTCG source (`$value`). NOTE: `$type` is intentionally
// omitted. SD's type-specific transforms normalize values (e.g. #fff -> #ffffff, hex
// casing, dimension rounding) which would change the frozen output; the DTCG values are
// already authored in final CSS form, so we skip typing and keep byte-identical output.
const sd = new StyleDictionary({
  source: BASE_THEME.sources,
  usesDtcg: true,
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "css/",
      files: [
        {
          destination: BASE_THEME.outputs.light.replace(/^css\//, ""),
          format: "css/variables",
          filter: (token, a, b, c) => {
            // varNames are dash-case versions of colors, only generated for SCSS convenience, and are not needed by CSS var() statements.
            return !token.path.includes('varNames');
          }
        },
        {
          destination: BASE_THEME.outputs.dark.replace(/^css\//, ""),
          format: "css/dark",
          filter: (token) => token.darkValue,
        },
      ],
    },
    scss: {
      transformGroup: "scss",
      buildPath: "scss/",
      files: [
        {
          destination: "variables.scss",
          format: "scss/map-deep",
        },
      ],
    },
    js: {
      transformGroup: "js",
      files: [
        {
          format: "javascript/module",
          destination: "lib/variables.js",
        },
      ],
    },
    mjs: {
      transformGroup: "js",
      files: [
        {
          format: "javascript/esm",
          destination: "lib/variables.esm.js",
        },
      ],
    },
    json: {
      transformGroup: "js",
      files: [
        {
          format: "json/nested",
          destination: "lib/variables.json",
        },
      ],
    },
  },
});

sd.registerFormat({
  name: "javascript/esm",
  format: function ({ dictionary }) {
    const minified = minifyDictionary(dictionary.tokens, true);
    const tokens = Object.keys(minified).map((name) => {
      const value = JSON.stringify(minified[name], null, 2);
      return `export const ${name} = ${value};`;
    });

    return [
      `/**`,
      ` * Do not edit directly`,
      ` * Generated on ${new Date().toUTCString()}`,
      ` **/`,
      ...tokens,
    ].join("\n");
  },
});

sd.registerFormat({
  name: "javascript/module",
  format: function ({ dictionary }) {
    const tokens = JSON.stringify(
      minifyDictionary(dictionary.tokens, true),
      null,
      2
    );
    return [
      `/**`,
      ` * Do not edit directly`,
      ` * Generated on ${new Date().toUTCString()}`,
      ` **/`,
      `module.exports = ${tokens};`,
    ].join("\n");
  },
});

sd.registerFormat({
  name: "css/dark",
  format: async function (args) {
    const dictionary = { ...args.dictionary };
    dictionary.allTokens = dictionary.allTokens.map((token) => {
      if (token.darkValue) {
        // DTCG: the emitted value is read from $value; swap in the (resolved) dark value.
        return { ...token, $value: token.darkValue, value: token.darkValue };
      }
      return token;
    });
    const cssVarsFormat = sd.hooks.formats["css/variables"];
    return cssVarsFormat({ ...args, dictionary });
  },
});

await sd.buildAllPlatforms();

/**
 * Figma-sourced themes (bh2026, and any future bh<YYYY>) build through Style
 * Dictionary — same engine as the classic base above — via a custom parser that
 * normalizes the committed Figma "subatomic" export in-memory at build time.
 *
 * The export is a self-contained 3-tier collection (core / Tier 1 / Tier 2) whose
 * aliases ({color.border}, {spacing.16}) resolve across tiers in a *flat* namespace.
 * That does not fit SD's single nested tree — tier-1 `color.border` (a leaf) and
 * tier-2 `color.border.*` (a group) collide. The parser de-collides by flattening
 * every leaf to a single dashed-name token whose value is already resolved and
 * unit-converted, so SD sees a clean, reference-free token set.
 *
 * Figma forward-generation is preserved: the raw export stays the committed source
 * of truth and the parser reads it directly — re-export from Figma, rebuild, done.
 *
 * Lengths convert px -> rem at Novo's 10px root (rem = px / 10). Border widths stay
 * px (hairline), font-weights stay unitless, and the `round` radius sentinel (>=999)
 * stays px. See src/tokens/bh2026/NAMING_ALIGNMENT.md.
 */
const REM_BASE = 10;
const ALIAS = /^\{(.+)\}$/;

// Collapse a redundant ramp group when the leaf repeats its parent with a numeric
// suffix: transparency/white/white-80 -> transparency/white-80 (matches the Figma
// alias `{color.transparency.white-80}` and avoids the doubled --color-…-white-white-80
// var name). Numeric-only so non-numeric ramps like color/blue/blue-gray are untouched.
const normalizePath = (path) => {
  const segs = path.split("/");
  const out = [];
  for (let i = 0; i < segs.length; i += 1) {
    const next = segs[i + 1];
    if (next && next.startsWith(`${segs[i]}-`) && /^\d/.test(next.slice(segs[i].length + 1))) {
      continue; // drop the redundant parent; the next segment already carries the name
    }
    out.push(segs[i]);
  }
  return out.join("/");
};

const toRem = (n) => (n === 0 ? "0" : `${parseFloat((n / REM_BASE).toFixed(4))}rem`);

/**
 * Parse a Figma "subatomic" export string into a flat, resolved, reference-free
 * Style Dictionary token set: { "<dashed-name>": { value: "<final-css-value>" } }.
 * Aliases are resolved and lengths unit-converted here so SD needs no further
 * transforms (the flat de-collided names are exactly the emitted `--<name>`).
 */
function parseFigmaExport(contents, label = "figma export") {
  // The export is an array of collections: [{ "<name>": { modes: { "<mode>": {…} } } }].
  // Each collection has a single mode today; we take the first.
  const collections = JSON.parse(contents);
  const isLeaf = (n) =>
    n && typeof n === "object" && Object.prototype.hasOwnProperty.call(n, "$value");

  // Flatten each collection's leaves into ordered [path, rawValue]; build a flat
  // dotted-path namespace (collection prefix stripped) so aliases resolve tier-agnostically.
  const ns = new Map();
  const leaves = [];
  const walk = (node, path) => {
    if (isLeaf(node)) {
      const p = normalizePath(path);
      leaves.push([p, node.$value]);
      ns.set(p.replace(/\//g, "."), node.$value);
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue; // skip $type/$scopes metadata
      walk(value, path ? `${path}/${key}` : key);
    }
  };
  for (const collection of collections) {
    const [, body] = Object.entries(collection)[0];
    const mode = Object.values(body.modes ?? {})[0] ?? {};
    walk(mode, "");
  }

  const resolve = (val, seen = new Set()) => {
    if (typeof val === "string") {
      const match = val.trim().match(ALIAS);
      if (match) {
        const key = match[1];
        if (seen.has(key) || !ns.has(key)) return { unresolved: true, val };
        seen.add(key);
        return resolve(ns.get(key), seen);
      }
    }
    return { unresolved: false, val };
  };

  let unresolved = 0;
  const cssValue = (path, raw) => {
    const { val, unresolved: bad } = resolve(raw);
    if (bad) {
      unresolved += 1;
      return String(val);
    }
    if (typeof val === "number") {
      if (path.includes("font-weight")) return String(val); // unitless
      if (path.startsWith("border/width")) return `${val}px`; // hairline stays px
      if (val >= 999) return `${val}px`; // round sentinel
      return toRem(val);
    }
    return String(val); // colors (#…), keywords (Inter, none, uppercase…)
  };

  const tokens = {};
  for (const [path, raw] of leaves) {
    tokens[path.replace(/\//g, "-")] = { value: cssValue(path, raw) };
  }
  console.log(
    `parsed ${label} — ${leaves.length} tokens` +
      (unresolved ? ` (⚠ ${unresolved} unresolved aliases)` : ", 0 unresolved")
  );
  return tokens;
}

// Register the Figma parser + a thin CSS-vars format globally so every theme's SD
// instance shares them. The parser fully resolves values, so the css platform runs
// no value transforms — the emitted `--<name>` is the token's flat path verbatim.
StyleDictionary.registerParser({
  name: "figma/subatomic",
  pattern: /subatomic\.figma-export\.json$/,
  parser: ({ filePath, contents }) => parseFigmaExport(contents, filePath),
});

StyleDictionary.registerFormat({
  name: "figma/css-vars",
  format: ({ dictionary, options }) => {
    const { selector, name, source } = options;
    const header =
      `/* ${name} theme — generated by build.mjs from ${source}.\n` +
      `   Do not edit directly. Lengths px -> rem at ${REM_BASE}px base; border-widths px; font-weight unitless. */\n`;
    const body = dictionary.allTokens
      .map((token) => `  --${token.path.join("-")}: ${token.value};`)
      .join("\n");
    return `${header}${selector} {\n${body}\n}\n`;
  },
});

// Build every Figma-sourced theme in the manifest through Style Dictionary. One entry
// per theme; adding a theme needs no new build code. (Classic-sd themes are built by
// the base SD instance above; P3 folds them into this manifest-driven model too.)
for (const theme of FIGMA_THEMES) {
  const themeSd = new StyleDictionary({
    source: [theme.source],
    // Opt this instance into the Figma parser (registered parsers only run when named here).
    parsers: ["figma/subatomic"],
    platforms: {
      css: {
        // Parser emits final values + de-collided names; no value/name transforms needed.
        transforms: [],
        buildPath: "css/",
        files: [
          {
            destination: theme.output.replace(/^css\//, ""),
            format: "figma/css-vars",
            options: { selector: theme.selector, name: theme.name, source: theme.source },
          },
        ],
      },
    },
  });
  await themeSd.buildAllPlatforms();
}

// Publish the theme registry for consumers (novo-elements/novo) so they can enumerate
// themes + their selectors and CSS entry points without hardcoding paths. Exported as
// `novo-design-tokens/manifest`.
const publishedManifest = {
  themes: THEMES.map((theme) => {
    const outputs = theme.isBase ? theme.outputs : { light: theme.output };
    const css = Object.fromEntries(
      Object.entries(outputs).map(([mode, path]) => [mode, `./${path}`])
    );
    return { name: theme.name, isBase: !!theme.isBase, selector: theme.selector, modes: theme.modes, css };
  }),
};
writeFileSync("lib/manifest.json", JSON.stringify(publishedManifest, null, 2) + "\n");
console.log("lib/manifest.json — published theme registry");
