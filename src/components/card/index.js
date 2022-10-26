const { white } = require("../../utils/color-utils");
const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  // spacing: "{spacing.md}",
  border: {
    radius: "{border.radius}",
  },
  shadow: "{shadow.z2}",
  color: {
    background: "{color.background}",
    border: "transparent",
    text: "{color.text}",
  },
});
