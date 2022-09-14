const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  shadow: {
    hover: "{button.shadow.hover}",
    active: "{button.shadow.active}",
  },
  color: {
    background: "transparent",
    text: "{color.selection}",
    border: "{color.selection}",
  },
});
