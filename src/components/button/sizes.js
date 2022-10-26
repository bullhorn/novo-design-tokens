const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  small: {
    "size-height": "{size.height.sm}",
    spacing: "{spacing.sm}",
    fontSize: "{font.size.sm}",
    borderRadius: "{button.border.radius}",
  },
  large: {
    "size-height": "{size.height.lg}",
    spacing: "{spacing.lg}",
    fontSize: "{font.size.lg}",
    borderRadius: "{button.border.radius}",
  },
});
