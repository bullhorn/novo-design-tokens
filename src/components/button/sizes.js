const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  small: {
    height: "{size.height.sm}",
    spacing: "{spacing.sm}",
    fontSize: "{font.size.sm}",
    borderRadius: "{button.borderRadius}",
  },
  large: {
    height: "{size.height.lg}",
    spacing: "{spacing.lg}",
    fontSize: "{font.size.lg}",
    borderRadius: "{button.borderRadius}",
  },
});
