const {
  darken,
  lighten,
  readableColor,
  meetsContrastGuidelines,
  rgba,
} = require("polished");

// Color Primitives
const transparent = "transparent";
const current = "currentColor";
const black = "#000";
const white = "#fff";

const contrastColor = (color, light = white, dark = black) => {
  if (meetsContrastGuidelines(color, light).AALarge) {
    return light;
  }
  return readableColor(color, light, dark);
};

/**
 * Create ColorScale object for a Color
 * @param {*} color: string // hex
 * @returns
 */
const makeColorScale = (color, light, dark) => {
  return {
    value: color,
    shade: { value: darken(0.2, color) },
    tint: { value: lighten(0.2, color) },
    contrast: { value: contrastColor(color, light, dark) },
    // Disabled for right now because StyleDictionary converts all color values to hex
    // in the transform group
    // 50: { value: rgba(color, 0.5) },
    // 10: { value: rgba(color, 0.1) },
  };
};

// export interface ColorScale<T = string> {
//   default: T;
//   shade: T;
//   tint: T;
//   contrast: T;
//   50: T;
//   10: T;
// }

const loopColors = (colors, fn) => {
  return Object.keys(colors).reduce((ret, name) => {
    const color = colors[name];
    return Object.assign({}, ret, {
      [name]: fn(color),
    });
  }, {});
};

const makeColors = (colors) => loopColors(colors, (c) => ({ value: c }));
const makeTintColors = (colors) =>
  loopColors(colors, (c) => ({ value: lighten(0.2, c) }));
const makeShadeColors = (colors) =>
  loopColors(colors, (c) => ({ value: darken(0.2, c) }));
const makeContrastColors = (colors, light, dark) =>
  loopColors(colors, (c) => ({ value: contrastColor(c, light, dark) }));

module.exports = {
  transparent,
  current,
  black,
  white,
  makeColorScale,
  makeColors,
  makeTintColors,
  makeShadeColors,
  makeContrastColors,
};
