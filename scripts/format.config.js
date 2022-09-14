const { figmaTokens, figmaTokenSet, figmaType, figmaPath } = require("./figma");

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
      "attribute/cti",
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
      "attribute/cti",
      "name/cti/kebab",
      "time/seconds",
      "content/icon",
      "size/rem",
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
