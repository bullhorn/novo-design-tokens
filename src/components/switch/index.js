const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  track: {
    color: {
      background: "{color.empty}",
      selected: "{color.primaryOverlay}",
    },
  },
  thumb: {
    color: {
      text: "{color.primaryContrast}",
      selected: "{color.primary}",
      background: "{color.empty}",
    },
  },
  icon: {
    color: {
      text: "{color.text}",
      selected: "{color.primaryContrast}",
    },
  },
  border: {
    width: "{border.width}",
    radius: "{size.height.sm}",
  },
  spacing: "spacing.md",
  height: "{size.height.sm}",
});
