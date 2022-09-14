const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  track: {
    color: {
      background: "{color.empty}",
      selected: "{color.selectionOverlay}",
    },
  },
  thumb: {
    color: {
      text: "{color.selectionContrast}",
      selected: "{color.selection}",
      background: "{color.empty}",
    },
  },
  icon: {
    color: {
      text: "{color.text}",
      selected: "{color.selectionContrast}",
    },
  },
  border: {
    width: "{border.width}",
    radius: "{size.height.sm}",
  },
  spacing: "spacing.md",
  height: "{size.height.sm}",
});
