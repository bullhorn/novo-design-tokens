import StyleDictionary from "style-dictionary";
import { minifyDictionary } from "style-dictionary/utils";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { THEMES, BASE_THEME, FIGMA_THEMES } from "./manifest.mjs";

// Base theme (bh2022): tiered DTCG source. `$type` is intentionally omitted — typing
// triggers SD transforms that normalize values (#fff -> #ffffff, etc.) and would change output.
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
          filter: (token) => {
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

// Figma-sourced themes build through Style Dictionary by reading all export files up-front,
// building a shared alias namespace across all tiers, resolving aliases + converting units,
// then passing the flat token map directly to SD (no SD file parser needed).
// Re-export from Figma → rename to *.figma-export.json → `npm run build`. Nothing else.
const REM_BASE = 10;
const ALIAS = /^\{(.+)}$/;

// Collapse a redundant numeric ramp: transparency/white/white-80 -> transparency/white-80
// (avoids a doubled `white-white-80` var name). Numeric-only, so color/blue/blue-gray is kept.
const normalizePath = (path) => {
  const segs = path.split("/");
  const out = [];
  for (let i = 0; i < segs.length; i += 1) {
    const next = segs[i + 1];
    if (next && next.startsWith(`${segs[i]}-`) && /^\d/.test(next.slice(segs[i].length + 1))) {
      continue;
    }
    out.push(segs[i]);
  }
  return out.join("/");
};

const toRem = (n) => (n === 0 ? "0" : `${parseFloat((n / REM_BASE).toFixed(4))}rem`);

const isLeaf = (n) =>
  n && typeof n === "object" && Object.prototype.hasOwnProperty.call(n, "$value");

// Walk a single Figma export object (flat dict or legacy array-of-collections) into a
// shared namespace map and leaves list. Called once per source file.
function walkFigmaFile(raw, ns, leaves) {
  const walk = (node, path) => {
    if (isLeaf(node)) {
      const p = normalizePath(path);
      leaves.push([p, node.$value]);
      ns.set(p.replace(/\//g, "."), node.$value);
      // Register raw (un-normalized) path too so aliases using the full Figma path still resolve.
      if (path !== p) ns.set(path.replace(/\//g, "."), node.$value);
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue; // skip $type/$scopes/$extensions metadata
      if (key.includes(" ")) continue;   // CSS custom props can't contain spaces
      walk(value, path ? `${path}/${key}` : key);
    }
  };

  if (Array.isArray(raw)) {
    // Legacy format: array of collections [{ "<name>": { modes: { "<mode>": {…} } } }]
    for (const collection of raw) {
      const [, body] = Object.entries(collection)[0];
      const mode = Object.values(body.modes ?? {})[0] ?? {};
      walk(mode, "");
    }
  } else {
    // Current format: flat dict { category: { token: { $value } } }
    walk(raw, "");
  }
}

// Parse multiple Figma export files into a single flat, resolved token set.
// Aliases resolve across all files (shared namespace); unit conversion applied here.
// Re-export → rebuild — SD needs no further transforms.
function buildFigmaTokens(filePaths, label = "figma theme") {
  const ns = new Map();
  const leaves = []; // [normalizedPath, rawValue] — all files, in source order

  for (const filePath of filePaths) {
    walkFigmaFile(JSON.parse(readFileSync(filePath, "utf8")), ns, leaves);
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
      return null; // caller skips — emitting "{...}" would cause SD to re-resolve and error
    }
    // New Figma DTCG color format: { colorSpace, components: [r,g,b] (0-1), alpha, hex }
    if (typeof val === "object" && val !== null && "hex" in val) {
      const hex = val.hex.toLowerCase();
      if (val.alpha === 1) return hex;
      const [r, g, b] = val.components.map((c) => Math.round(c * 255));
      const a = parseFloat(val.alpha.toFixed(4));
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    if (typeof val === "number") {
      if (path.includes("font-weight")) return String(val); // unitless
      if (path.startsWith("border/width")) return `${val}px`; // hairline stays px
      if (val >= 999) return `${val}px`; // round sentinel
      return toRem(val);
    }
    return String(val); // hex colors (#…), keywords (Inter, none, uppercase…)
  };

  const tokens = {};
  for (const [path, raw] of leaves) {
    const value = cssValue(path, raw);
    if (value === null) continue; // skip unresolvable aliases
    // CSS custom property names are case-sensitive but must use only [a-z0-9-] — lowercase.
    tokens[path.replace(/\//g, "-").toLowerCase()] = { value };
  }
  console.log(
    `parsed ${label} — ${leaves.length} tokens across ${filePaths.length} files` +
    (unresolved ? ` (⚠ ${unresolved} unresolved aliases)` : ", 0 unresolved")
  );
  return tokens;
}

// Parse CSS custom property declarations from a built CSS file: { "--name": "value" }.
function parseCssVars(css) {
  const vars = new Map();
  for (const [, name, value] of css.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    vars.set(name, value.trim());
  }
  return vars;
}

// Log a diff of token changes between old and new CSS output.
function reportCssDiff(oldCss, newCss, label) {
  const oldVars = parseCssVars(oldCss);
  const newVars = parseCssVars(newCss);
  const added = [...newVars.keys()].filter((k) => !oldVars.has(k));
  const removed = [...oldVars.keys()].filter((k) => !newVars.has(k));
  const changed = [...newVars.keys()].filter(
    (k) => oldVars.has(k) && oldVars.get(k) !== newVars.get(k)
  );
  console.log(
    `${label} diff vs previous build: +${added.length} added, -${removed.length} removed, ~${changed.length} changed`
  );
  if (added.length) console.log(`  added:   ${added.slice(0, 10).map((k) => `--${k}`).join(", ")}${added.length > 10 ? ` … +${added.length - 10} more` : ""}`);
  if (removed.length) console.log(`  removed: ${removed.slice(0, 10).map((k) => `--${k}`).join(", ")}${removed.length > 10 ? ` … +${removed.length - 10} more` : ""}`);
  if (changed.length) console.log(`  changed: ${changed.slice(0, 10).map((k) => `--${k}: ${oldVars.get(k)} → ${newVars.get(k)}`).join("\n           ")}${changed.length > 10 ? ` … +${changed.length - 10} more` : ""}`);
}

StyleDictionary.registerFormat({
  name: "figma/css-vars",
  format: ({ dictionary, options }) => {
    const { selector, name, sources } = options;
    const header =
      `/* ${name} theme — generated by build.mjs from ${sources.map((s) => s.split("/").pop()).join(", ")}.\n` +
      `   Do not edit directly. Lengths px -> rem at ${REM_BASE}px base; border-widths px; font-weight unitless. */\n`;
    const body = dictionary.allTokens
      .map((token) => `  --${token.path.join("-")}: ${token.value};`)
      .join("\n");
    return `${header}${selector} {\n${body}\n}\n`;
  },
});

// Build each Figma-sourced theme: parse all export files together (shared namespace for
// cross-tier alias resolution), then pass the resolved token map directly to SD.
for (const theme of FIGMA_THEMES) {
  const oldCss = existsSync(theme.outputs.light)
    ? readFileSync(theme.outputs.light, "utf8")
    : null;

  const tokens = buildFigmaTokens(theme.sources, theme.name);

  const themeSd = new StyleDictionary({
    tokens,
    platforms: {
      css: {
        transforms: [], // all values already resolved + unit-converted by buildFigmaTokens
        buildPath: "css/",
        files: [
          {
            destination: theme.outputs.light.replace(/^css\//, ""),
            format: "figma/css-vars",
            options: { selector: theme.selector, name: theme.name, sources: theme.sources },
          },
        ],
      },
    },
  });
  await themeSd.buildAllPlatforms();

  if (oldCss) {
    reportCssDiff(oldCss, readFileSync(theme.outputs.light, "utf8"), theme.name);
  }
}

// Publish the theme registry for consumers (`novo-design-tokens/manifest`).
const publishedManifest = {
  themes: THEMES.map((theme) => {
    const css = Object.fromEntries(
      Object.entries(theme.outputs).map(([mode, path]) => [mode, `./${path}`])
    );
    return { name: theme.name, isBase: !!theme.isBase, selector: theme.selector, modes: theme.modes, css };
  }),
};
writeFileSync("lib/manifest.json", JSON.stringify(publishedManifest, null, 2) + "\n");
console.log("lib/manifest.json — published theme registry");
