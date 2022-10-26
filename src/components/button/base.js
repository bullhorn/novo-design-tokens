const { tokenize } = require("../../utils/token-utils");

//var(--button-height);
//var(--button-color-background);
module.exports = tokenize({
  spacing: "{spacing.md}",
  textTransform: "uppercase",
  size: {
    height: "{size.height.md}",
  },
  font: {
    size: "{font.size.button}",
  },
  border: {
    radius: "{border.radius}",
  },
  color: {
    background: "transparent",
    border: "transparent",
    text: "{color.text}",
    hover: "{color.hover}",
    active: "{color.active}",
  },
  shadow: {
    hover: "{shadow.none}",
    active: "{shadow.none}",
  },
});
