const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  shadow: {
    hover: "{button.shadow.hover}",
    active: "{button.shadow.active}",
  },
  color: {
    background: "{color.selection}",
    text: "{color.selectionContrast}",
    border: "transparent",
  },
});
