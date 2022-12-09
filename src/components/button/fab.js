const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  shadow: {
    hover: "{button.shadow.hover}",
    active: "{button.shadow.active}",
  },
  color: {
    background: "{color.primary}",
    text: "{color.primaryContrast}",
    border: "transparent",
  },
});
