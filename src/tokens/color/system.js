const { tokenize, describeWith } = require("../../utils/token-utils");

module.exports = tokenize({
  ...{
    background: "{color.white}", // body Color
    backgroundSubtle: "{palette.gray.98}", // alt background color for containers
    backgroundMuted: "{palette.gray.95}", // a muted state for backgrounds, do we need this
    backgroundDisabled: "{palette.gray.98}", // Background color for whenever a components is disabled
    backgroundOverlay: "#0000001f",
  },
  ...{
    text: `{palette.gray.15}`,
    textSubtle: `{palette.gray.30}`, // #4f5361
    textMuted: `{palette.gray.60}`,
    textDisabled: `{palette.gray.70}`,
    textCode: `{palette.red.30}`,
  },
  selection: "{color.primary}",
  selectionContrast: "{color.primaryContrast}",
  error: "{color.danger}",
  errorContrast: "{color.dangerContrast}",
  hover: `{color.backgroundOverlay}`,
  active: `{color.primaryOverlay}`,
  border: `{palette.gray.90}`,
  placeholder: `{palette.gray.50}`,
  link: "{color.selection}",
  caption: "{color.textSubtle}",
  label: "{color.textSubtle}",
  title: "{color.text}",
  button: "{color.text}",
  shadow: "rgba(0, 0, 0, 0.2)",
  scrollbar: {
    thumb: "{palette.gray.90}",
    thumbHover: "{palette.gray.50}",
  },
});
