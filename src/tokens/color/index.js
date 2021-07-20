// This is kinda cool, don't have to do that
// weird JSON structure nesting in every file.
const {
  makeColors,
  makeContrastColors,
  makeShadeColors,
  makeTintColors,
} = require("./util");
const core = require("./core");
const app = require("./app");
const brand = require("./brand");
const entity = require("./entity");
const allColors = { ...core, ...app, ...brand, ...entity };

module.exports = {
  ...makeColors(allColors),
  shade: makeShadeColors(allColors),
  tint: makeTintColors(allColors),
  contrast: makeContrastColors(allColors, core.white, core.dark),
};
