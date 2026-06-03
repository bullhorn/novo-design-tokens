import StyleDictionary from "style-dictionary";
import { minifyDictionary } from "style-dictionary/utils";

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
