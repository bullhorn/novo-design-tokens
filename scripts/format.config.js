const { figmaTokens, figmaTokenSet, figmaType, figmaPath } = require("./figma");
const {
  dotCase,
  kebabCase,
  toPascalCase,
  deepSet,
  isObject,
} = require("./helpers");
const fs = require("fs");
const path = require("path");
const StyleDictionary = require("style-dictionary");

const validStates = [
  "hover",
  "active",
  "checked",
  "focus",
  "invalid",
  "disabled",
];

const validComponents = fs
  .readdirSync(path.resolve("./src/components"), { withFileTypes: true })
  .filter((item) => item.isDirectory())
  .map((item) => item.name);

function minifyDictionary(obj) {
  if (typeof obj !== "object" || Array.isArray(obj)) {
    return obj;
  }
  var toRet = {};
  if (obj.hasOwnProperty("value")) {
    return obj.value;
  } else {
    for (var name in obj) {
      if (obj.hasOwnProperty(name)) {
        toRet[name] = minifyDictionary(obj[name]);
      }
    }
  }
  return toRet;
}

module.exports = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    type: "attribute",
    name: "attribute/smart-cti",
    transformer: (token) => {
      let isComponent = token.filePath.includes("component");
      if (token.filePath.includes("themes")) {
        const normalized = kebabCase(token.path.join("-")).split("-");
        isComponent = validComponents.includes(normalized[0]);
      }

      // Only do this custom functionality in the 'component' top-level namespace.
      if (isComponent) {
        // Component CTI: item -> variant -> category -> type  -> state
        // category: [required] no variant index 2 else index 3.
        // type: [required] no variant index 3 else index 4.
        // item: [required] index 1.
        // variant: [optional] index 2 if len=5 or (len=4 & no state).
        // state: [optional] use known list

        // button-primary-color-background-hover
        //    ↑      ↑      ↑       ↑        ↑
        //    |      |      |       |      state
        //    |      |      |     type
        //    |      |   category
        //    |   variant
        //  item

        // button-color-background-hover   (len=4.. state=hover so no variant)
        // button-primary-color-background (len=4.. no state so variant primary)
        // button-large-border-radius      (len=4.. v=2)
        // button-border-radius            (len=4.. v=2)
        // use known "states" ==> hover, active, checked, focus, invalid, disabled

        const normalized = kebabCase(token.path.join("-")).split("-");
        const last = normalized.slice(-1)[0];
        const hasValidState = validStates.includes(last);

        switch (normalized.length) {
          case 5: {
            const [item, variant, category, type, state] = normalized;
            return { item, variant, category, type, state };
          }
          case 4: {
            if (hasValidState) {
              const [item, category, type, state] = normalized;
              return { item, category, type, state };
            } else {
              // button-large-borderRadius --- button large radius
              const [item, variant, category, type] = normalized;
              return { item, variant, category, type };
            }
          }
          default: {
            const [item, category, type] = normalized;
            return { item, category, type };
          }
        }
      } else {
        // > Note: description using indexes starting at 1.
        //
        // CTI: category -> type -> item -> variant -> state
        // category: [required] index 1.
        // type: [required] index 2.
        // item: [optional] len=4,5 then index 3.
        // variant: [optional] len=3 then index 3, len=4,5 then len-1.
        // state: [optional] len=4,5 always last index

        const normalized = kebabCase(token.path.join("-")).split("-");
        const last = normalized.slice(-1)[0];
        const hasValidState = validStates.includes(last);

        switch (normalized.length) {
          case 5: {
            const [category, type, item, variant, state] = normalized;
            return { category, type, item, variant, state };
          }
          case 4: {
            if (hasValidState) {
              const [category, type, variant, state] = normalized;
              return { category, type, variant, state };
            } else {
              const [category, type, item, variant] = normalized;
              return { category, type, item, variant };
            }
          }
          default: {
            // color-border
            // color-success-tint
            // color-background-muted
            // size-height-md
            // border-radius
            const [category, type, variant] = normalized;
            return { category, type, variant };
          }
        }
      }
    },
  });

  StyleDictionary.registerTransform({
    type: "attribute",
    name: "attribute/figma",
    transformer: (token) => {
      const originalAttrs = token.attributes || {};
      const figmaAttrs = {
        ...originalAttrs,
        figma: {
          tokenset: figmaTokenSet(token),
          type: figmaType(token),
          path: figmaPath(token),
        },
      };
      return figmaAttrs;
    },
  });

  StyleDictionary.registerTransformGroup({
    name: "figma",
    transforms: [
      "attribute/smart-cti",
      "attribute/figma",
      "name/cti/pascal",
      "time/seconds",
      "content/icon",
      "size/rem",
      "color/hex",
    ],
  });

  StyleDictionary.registerTransformGroup({
    name: "bh-css",
    transforms: [
      "attribute/smart-cti",
      "name/cti/kebab",
      "time/seconds",
      "content/icon",
      // "size/rem",
    ],
  });

  StyleDictionary.registerFormat({
    name: "figmaTokensPlugin",
    formatter: ({ dictionary }) => {
      const transformedTokens = figmaTokens(dictionary);
      return JSON.stringify(transformedTokens, null, 2);
    },
  });

  StyleDictionary.registerFormat({
    name: "javascript/esm",
    formatter: function (dictionary, options) {
      const minified = minifyDictionary(dictionary.properties);
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

  StyleDictionary.registerFormat({
    name: "javascript/module",
    formatter: function (dictionary, options) {
      const tokens = JSON.stringify(
        minifyDictionary(dictionary.properties),
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

  StyleDictionary.registerFilter({
    name: "fromSource",
    matcher: (token) => token.isSource,
  });
};
