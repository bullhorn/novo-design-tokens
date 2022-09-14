const { tokenize, describeWith } = require("../../utils/token-utils");

module.exports = tokenize({
  hover: `{color.selectionOverlay}`,
  active: `{color.backgroundOverlay}`,
  border: `{palette.gray.70}`,
  placeholder: `{palette.gray.50}`,
  link: "{palette.blue.50}",
  caption: "{color.textSecondary}",
  label: "{color.textSecondary}",
  title: "{color.text}",
  button: "{color.text}",
  shadow: "{palette.gray.10}",
});
