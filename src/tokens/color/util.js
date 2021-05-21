const { darken, lighten, meetsContrastGuidelines, rgba } = require("polished");

// Color Primitives
const transparent = "transparent";
const current = "currentColor";
const black = "#000";
const white = "#fff";
const gray = "#999";

const contrastColor = (color, light = white, dark = black) => {
  if (meetsContrastGuidelines(color, light).AALarge) {
    return light;
  }
  return dark;
};

/**
 * Create ColorScale object for a Color
 * @param {*} color: string // hex
 * @returns
 */
const makeColorScale = (color, light, dark) => {
  return {
    base: { value: color },
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

module.exports = {
  transparent,
  current,
  black,
  white,
  gray,
  makeColorScale,
};
