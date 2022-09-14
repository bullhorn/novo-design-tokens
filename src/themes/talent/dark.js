const { tokenize } = require("../../utils/token-utils.js");

module.exports = tokenize({
  color: {
    ...{
      background: "{color.named.midnight}", // body Color
      backgroundSecondary: "{color.named.darkness}", // alt background color for containers
      backgroundMuted: "{palette.gray.95}", // a muted state for backgrounds, do we need this
      backgroundDisabled: "{palette.gray.98}", // Background color for whenever a components is disabled
      backgroundOverlay: "#0000001f",
    },
    ...{
      text: `{palette.gray.90}`,
      textSecondary: `{palette.gray.30}`,
      textMuted: `{palette.gray.50}`,
      textDisabled: `{palette.gray.70}`,
      textCode: `{palette.red.70}`,
    },
  },
});
