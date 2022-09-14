module.exports = {
  palette: require("./palette"),
  color: require("./color"),
  icon: require("./icons"),
  // expand sizing variables to root
  ...require("./content"),
  // expand typography variables to root
  ...require("./typography"),
};
