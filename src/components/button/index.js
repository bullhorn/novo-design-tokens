const base = require("./base");
const sizes = require("./sizes");

module.exports = {
  ...base,
  ...sizes,
  primary: require("./primary"),
  outlined: require("./secondary"),
  // basic: require("./basic"),
  fab: require("./fab"),
  standard: require("./standard"),
};
