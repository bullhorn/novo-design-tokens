const named = require("./named");
const semantic = require("./semantic");
const brand = require("./brand");
const entity = require("./entity");
const system = require("./system");
const { makeScaledColors } = require("../../utils/color-utils");

module.exports = {
  black: { value: "#000" },
  white: { value: "#fff" },
  ...system,
  brand,
  ...named,
  ...semantic,
  ...entity,
};
