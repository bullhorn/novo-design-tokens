const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  spacing: "0",
  height: "{size.height.md}",
  shadow: "none",
  color: {
    background: "{color.background}",
    text: "{color.text}",
  },
});
