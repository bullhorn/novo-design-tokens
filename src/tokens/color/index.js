// This is kinda cool, don't have to do that
// weird JSON structure nesting in every file.
const core = require("./core");

module.exports = {
  ...core,
  app: require("./app"),
  brand: require("./brand"),
  entity: require("./entity"),
  font: require("./font"),
};
