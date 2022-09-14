const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  spacing: "{spacing.md}",
  height: "{size.height.md}",
  fontSize: "{font.size.body}",
  color: {
    background: "{color.background}",
    text: "{color.text}",
    active: "{color.selection}",
  },
});
