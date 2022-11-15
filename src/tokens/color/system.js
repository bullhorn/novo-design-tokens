const { tokenize, describeWith } = require("../../utils/token-utils");

module.exports = tokenize({
  hover: `{color.selectionOverlay}`,
  active: `{color.backgroundOverlay}`,
  border: `{palette.gray.70}`,
  placeholder: `{palette.gray.50}`,
  link: "{palette.indigo.50}",
  caption: "{color.textSubtle}",
  label: "{color.textSubtle}",
  title: "{color.text}",
  button: "{color.text}",
  shadow: "{palette.gray.10}",
  scrollbar: {
    thumb: "{palette.gray.90}",
    thumbHover: "{palette.gray.50}",
  },
});
