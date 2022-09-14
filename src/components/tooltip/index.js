const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  backgroundColor: "{color.empty}",
  borderRadius: "{border.radius}",
  padding: "{spacing.md}",
});
