const chroma = require("chroma-js");
const {
  dotCase,
  kebabCase,
  toPascalCase,
  deepSet,
  isObject,
} = require("./helpers");

const isThemeToken = (token) => token.filePath.includes("theme");
const isComponentToken = (token) => token.filePath.includes("component");

const getComponentTokenSet = (token) => "components"; //`${token.path[0]}`;
const getTokenCategory = (token) =>
  isComponentToken(token) ? token.path[1] : token.path[0];
const getTokenType = (token) =>
  isComponentToken(token) ? token.path[2] : token.path[1];
const getThemeName = (token) => {
  const path = token.filePath.split("/");
  const [mode] = path.pop().split(".");
  const theme = path.pop();
  return `${theme}-${mode}`;
};

function isRefValue(val) {
  if (Array.isArray(val)) {
    return val.some((prop) => isRefValue(prop));
  }

  if (typeof val === "string") {
    return val.startsWith("{") && val.endsWith("}");
  }

  if (typeof val === "number") {
    return false;
  }

  return false;
}

function figmaFontType(token) {
  const type = token.attributes.type; //getTokenType(token);
  switch (type) {
    case "family":
      return "fontFamilies";
    case "weight":
      return "fontWeights";
    case "size":
      return "fontSizes";
    case "height":
      return "lineHeights";
    case "spacing":
      return "letterSpacing";
    default:
      return "unknown";
  }
}

function figmaBorderType(token) {
  // const type = getTokenType(token);
  const type = token.attributes.type;
  if (type.startsWith("width")) return "borderWidth";
  if (type.startsWith("radius")) return "borderRadius";
  if (type.startsWith("height")) return "lineHeights";

  return "other";
}

function figmaType(token) {
  // const category = getTokenCategory(token);
  switch (token.attributes.category) {
    case "color":
      // if (token.path.includes("contrast")) return "Contrast Color";
      return "color";
    case "palette":
      return "color";
    case "spacing":
      return "spacing";
    case "size":
      return "sizing";
    case "border":
      return figmaBorderType(token);
    case "font":
      return figmaFontType(token);
    case "shadow":
      return "boxShadow";
    default:
      console.log(
        token.path.join("-"),
        "---",
        token.attributes.category,
        token.attributes.type,
        token.attributes.variant
      );
      return "other";
  }
}

function figmaTokenSet(token) {
  // const category = getTokenCategory(token);
  // const tokenType = getTokenType(token);
  if (isThemeToken(token)) return getThemeName(token);
  if (isComponentToken(token)) return getComponentTokenSet(token);
  return "global";
}

function figmaPath(token) {
  return token.path.map((t) => kebabCase(t)).join(".");
}

function figmaValue(token) {
  if (isRefValue(token.original?.value)) {
    let ref = kebabCase(token.original.value).replace(/\{\}/gi, "");
    // if (ref.startsWith("Palette") || ref.startsWith("Color")) {
    //   const type = ref.split(/(?=[A-Z0-9])/)[1]?.toLowerCase();
    //   ref = `${type}.${ref}`;
    // }

    return `${ref}`;
  }
  return token.value;
}

const makeNestedTokens = (tokens, setkey = "tokenset") => {
  const hash = {};
  tokens.forEach((token) => {
    let { group, path, tokenset } = token;
    // path = group ? [group, path.split(".").slice(1)].join(".") : path;
    const truepath = [tokenset, path].filter(Boolean).join(".");
    deepSet(hash, truepath, token);
  });

  return hash;
};

const repairMissedBarrels = (tokens) => {
  const len = (it) => it.path.split(".").length;
  const nextChar = (a, b) => a.path.replace(b.path, "")[0];
  const barrels = [];
  const moved = [];
  return tokens
    .map((token) => {
      const shouldBarrel = tokens.some(
        (it) => it.path.includes(token.path) && nextChar(it, token) === "-"
      );
      if (shouldBarrel) {
        console.log(`Rolling a Barrel! @@@, ${token.path}`);
        barrels.push(token.path);
        moved.push({ from: token.path, to: token.path + ".@" });
        token.path += ".@";
      }
      return token;
    })
    .map((token) => {
      const partOfBarrel = barrels.some((it) => token.path.includes(it));
      if (partOfBarrel) {
        const newpath = token.path.replace("-", ".");
        moved.push({ from: token.path, to: newpath });
        token.path = newpath;
      }
      return token;
    })
    .map((token) => {
      const hasMovedValue = moved.find((it) => token.value === `{${it.from}}`);
      if (hasMovedValue) {
        token.value = `{${hasMovedValue.to}}`;
      }
      return token;
    });
};

const figmaTokens = (dictionary) => {
  const transformedTokens = dictionary.allTokens
    // .filter((token) => !token.attributes.type.includes("contrast"))
    .map((token) => {
      return {
        ...token.attributes.figma,
        value: figmaValue(token),
        description: "",
        ...(token.group ? { group: token.group } : {}),
        // bag: token,
      };
    }, {});
  return makeNestedTokens(repairMissedBarrels(transformedTokens));
};

module.exports = {
  figmaType,
  figmaValue,
  figmaPath,
  figmaTokenSet,
  figmaTokens,
};
