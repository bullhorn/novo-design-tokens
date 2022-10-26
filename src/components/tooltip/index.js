const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  color: {
    background: "{color.text}",
    text: "{color.background}",
    border: "transparent",
  },
  border: {
    radius: "{border.radius}",
  },
  shadow: "{shadow.z2}",
});
