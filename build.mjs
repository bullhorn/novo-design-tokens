import StyleDictionary from "style-dictionary";
import { minifyDictionary } from "style-dictionary/utils";
import { readFileSync, writeFileSync } from "node:fs";

const sd = new StyleDictionary({
  source: ["src/tokens/index.js", "src/components/index.js"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "css/",
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
          filter: (token, a, b, c) => {
            // varNames are dash-case versions of colors, only generated for SCSS convenience, and are not needed by CSS var() statements.
            return !token.path.includes('varNames');
          }
        },
        {
          destination: "variables-dark.css",
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
    const minified = minifyDictionary(dictionary.tokens);
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
      minifyDictionary(dictionary.tokens),
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
        return { ...token, value: token.darkValue };
      }
      return token;
    });
    const cssVarsFormat = sd.hooks.formats["css/variables"];
    return cssVarsFormat({ ...args, dictionary });
  },
});

await sd.buildAllPlatforms();

/**
 * Modern theme build (independent token source: Figma "subatomic" export).
 *
 * Sourced directly from the committed Figma export (src/tokens/modern/
 * subatomic.figma-export.json) so the build is reproducible from one source of
 * truth — drop in a fresh export and rebuild.
 *
 * The modern set is a self-contained 3-tier collection (core / Tier 1 / Tier 2)
 * whose aliases ({color.border}, {spacing.16}) resolve across tiers in a flat
 * namespace. That does not fit Style Dictionary's single nested tree — tier-1
 * `color.border` (a leaf) and tier-2 `color.border.*` (a group) collide — so we
 * resolve and transform it directly here.
 *
 * Lengths convert px -> rem at Novo's 10px root (rem = px / 10). Border widths stay
 * px (hairline), font-weights stay unitless, and the `round` radius sentinel (>=999)
 * stays px. See src/tokens/modern/NAMING_ALIGNMENT.md.
 */
const MODERN_SOURCE = "src/tokens/modern/subatomic.figma-export.json";

function buildModern() {
  const REM_BASE = 10;
  // :root-anchored so modern token values (e.g. --border-radius-round) win over the
  // base :root tokens of the same name (equal specificity would otherwise depend on load order).
  const SELECTOR = ':root[data-theme="modern"], :root.theme-modern';
  const ALIAS = /^\{(.+)\}$/;

  // The export is an array of collections: [{ "<name>": { modes: { "<mode>": {…} } } }].
  // Each collection has a single mode today; we take the first.
  const collections = JSON.parse(readFileSync(MODERN_SOURCE, "utf8"));
  const tierLabel = (name) =>
    name === "core" ? "core" : name.startsWith("Tier 1") ? "tier1" : name.startsWith("Tier 2") ? "tier2" : name;

  // Flatten each collection's leaves into ordered [path, rawValue]; build a flat
  // dotted-path namespace (collection prefix stripped) so aliases resolve tier-agnostically.
  const ns = new Map();
  const tierLeaves = {};
  const isLeaf = (n) =>
    n && typeof n === "object" && Object.prototype.hasOwnProperty.call(n, "$value");
  const walk = (node, path, out) => {
    if (isLeaf(node)) {
      out.push([path, node.$value]);
      ns.set(path.replace(/\//g, "."), node.$value);
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("$")) continue; // skip $type/$scopes metadata
      walk(v, path ? `${path}/${k}` : k, out);
    }
  };
  for (const collection of collections) {
    const [name, body] = Object.entries(collection)[0];
    const mode = Object.values(body.modes ?? {})[0] ?? {};
    const out = [];
    walk(mode, "", out);
    tierLeaves[tierLabel(name)] = out;
  }

  const resolve = (val, seen = new Set()) => {
    if (typeof val === "string") {
      const m = val.trim().match(ALIAS);
      if (m) {
        const key = m[1];
        if (seen.has(key) || !ns.has(key)) return { unresolved: true, val };
        seen.add(key);
        return resolve(ns.get(key), seen);
      }
    }
    return { unresolved: false, val };
  };

  const toRem = (n) =>
    n === 0 ? "0" : `${parseFloat((n / REM_BASE).toFixed(4))}rem`;

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

  let out = `/* Modern theme — generated by build.mjs from ${MODERN_SOURCE}.\n`;
  out += `   Do not edit directly. Lengths px -> rem at ${REM_BASE}px base; border-widths px; font-weight unitless. */\n`;
  out += `${SELECTOR} {\n`;
  for (const tier of Object.keys(tierLeaves)) {
    out += `\n  /* --- ${tier} --- */\n`;
    for (const [path, raw] of tierLeaves[tier]) {
      out += `  --${path.replace(/\//g, "-")}: ${cssValue(path, raw)};\n`;
    }
  }
  out += `}\n`;

  writeFileSync("css/variables-modern.css", out);
  const total = Object.values(tierLeaves).reduce((a, l) => a + l.length, 0);
  console.log(
    `css/variables-modern.css — ${total} tokens` +
      (unresolved ? ` (⚠ ${unresolved} unresolved aliases)` : ", 0 unresolved")
  );
}

buildModern();
