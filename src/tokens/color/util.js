const {
  darken,
  lighten,
  readableColor,
  meetsContrastGuidelines,
  rgba,
  setLightness,
  shade,
  tint,
} = require("polished");

// Color Primitives
const transparent = "transparent";
const current = "currentColor";
const black = "#000";
const white = "#fff";

const contrastColor = (color, light = white, dark = black, overrides = []) => {
  if (
    overrides.includes(color) ||
    meetsContrastGuidelines(color, light).AALarge
  ) {
    return light;
  }
  return dark;
  // return readableColor(color, light, dark, false);
};

/**
 * Create ColorScale object for a Color
 * @param {*} color: string // hex
 * @returns
 */
const makeColorScale = (color, light, dark) => {
  return {
    "@": { value: color },
    shade: { value: darken(0.2, color) },
    tint: { value: lighten(0.2, color) },
    contrast: { value: contrastColor(color, light, dark) },
    50: { value: setLightness(0.5, color) },
    10: { value: setLightness(0.8, color) },
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
const makeScaledColors = (colors, light, dark) =>
  loopColors(colors, (c) => makeColorScale(c, light, dark));

const makeTintColors = (colors) =>
  loopColors(colors, (c) => ({ value: tint(0.2, c) }));
const makeShadeColors = (colors) =>
  loopColors(colors, (c) => ({ value: shade(0.2, c) }));
const makeContrastColors = (colors, light, dark, overrides) =>
  loopColors(colors, (c) => ({
    value: contrastColor(c, light, dark, overrides),
  }));
const makePaleColors = (colors) =>
  loopColors(colors, (c) => ({ value: setLightness(0.9, c) }));

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
  makePaleColors,
  makeScaledColors,
};
