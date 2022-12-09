const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  padding: "{spacing.md}",
  borderRadius: "{border.radius}",
  backgroundColor: "{color.empty}",
  borderDisabled: "{border.width} dashed {color.textDisabled}",
  borderValid: "{border.width} solid {color.border}",
  borderError: "{border.width} solid {color.error}",
});
