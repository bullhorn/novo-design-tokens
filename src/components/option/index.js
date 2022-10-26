const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  height: "{size.height.md}",
  spacing: "{spacing.md}",
  // color: {
  //   background: "transparent",
  //   text: "{color.text}",
  //   hover: "{color.hover}",
  //   active: "{color.active}",
  // },
});
