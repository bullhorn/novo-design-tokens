const { tokenize } = require("../../utils/token-utils");

//var(--button-height);
//var(--button-color-background);
module.exports = tokenize({
  height: "{size.height.md}",
  spacing: "{spacing.md}",
  textTransform: "uppercase",
  fontSize: "{font.size.button}",
  borderRadius: "{border.radius}",
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
