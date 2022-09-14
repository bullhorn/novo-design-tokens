const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  borderRadius: "{border.radius}",
  spacing: "{spacing.md}",
  shadow: "{shadow.z2}",
  height: "{size.height.lg}",
  color: {
    background: "{color.background}",
    text: "{color.text}",
    border: "transparent",
  },
});
