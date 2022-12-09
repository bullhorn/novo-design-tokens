const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  spacing: "{spacing.md}",
  height: "{size.height.md}",
  fontSize: "{font.size.body}",
  fontWeight: "{font.weight.medium}",
  color: {
    background: "{color.background}",
    text: "{color.text}",
    active: "{color.primary}",
  },
});
