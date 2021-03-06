const PLATFORMS = ["css", "scss"];

const StyleDictionary = require("style-dictionary").extend({
  source: ["src/tokens/index.js", "src/components/index.js"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "css/",
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
        },
        {
          destination: `variables-dark.css`,
          format: `css/dark`,
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

function cssFormatWrapper(property) {
  return function (args) {
    const dictionary = Object.assign({}, args.dictionary);
    // Override each token's `value` with `property` value
    dictionary.allProperties = dictionary.allProperties.map((token) => {
      const propValue = token[property];
      if (propValue) {
        return Object.assign({}, token, {
          value: propValue,
        });
      } else {
        return token;
      }
    });
    // Use the built-in format but with our customized dictionary object
    // so it will output the hcValue instead of the value
    return StyleDictionary.format["css/variables"]({ ...args, dictionary });
  };
}

StyleDictionary.registerFormat({
  name: "css/dark",
  formatter: cssFormatWrapper("darkValue"),
});

StyleDictionary.buildAllPlatforms();
