/**
 * Theme/Semantic colors
 */
const { tokenize, describeWith } = require("../../utils/token-utils");

// Subtle
module.exports = tokenize({
  ...{
    background: "{color.white}", // body Color
    backgroundSubtle: "{palette.gray.98}", // alt background color for containers
    backgroundMuted: "{palette.gray.95}", // a muted state for backgrounds, do we need this
    backgroundDisabled: "{palette.gray.98}", // Background color for whenever a components is disabled
    backgroundOverlay: "#0000001f",
  },
  ...{
    text: `{palette.gray.10}`,
    textSubtle: `{palette.gray.30}`,
    textMuted: `{palette.gray.70}`,
    textDisabled: `{palette.gray.50}`,
    textCode: `{palette.red.30}`,
  },
  ...{
    selection: "{palette.blue.50}",
    selectionTint: "{palette.blue.70}", // focus & hover
    selectionShade: "{palette.blue.30}",
    selectionContrast: "{palette.blue.contrast.50}",
    selectionOverlay: "{palette.blue.alpha}",
  },
  ...{
    success: "{palette.green.50}",
    successTint: "{palette.green.70}",
    successShade: "{palette.green.30}",
    successContrast: "{palette.green.contrast.50}",
    successOverlay: "{palette.green.alpha}",
  },
  ...{
    warning: "{palette.yellow.90}",
    warningTint: "{palette.yellow.95}",
    warningShade: "{palette.yellow.80}",
    warningContrast: "{palette.yellow.contrast.90}",
    warningOverlay: "{palette.yellow.alpha}",
  },
  ...{
    error: "{palette.red.50}",
    errorTint: "{palette.red.70}",
    errorShade: "{palette.red.30}",
    errorContrast: "{palette.red.contrast.50}",
    errorOverlay: "{palette.red.alpha}",
  },
  ...{
    info: "{palette.aqua.50}",
    infoTint: "{palette.aqua.70}",
    infoShade: "{palette.aqua.30}",
    infoContrast: "{palette.aqua.contrast.50}",
    infoOverlay: "{palette.aqua.alpha}",
  },
  ...{
    empty: "{palette.gray.90}",
    emptyTint: "{palette.gray.95}",
    emptyShade: "{palette.gray.80}",
    emptyContrast: "{palette.gray.contrast.90}",
    emptyOverlay: "{palette.gray.alpha}",
  },
  ...{
    disabled: "{palette.gray.70}",
    disabledTint: "{palette.gray.80}",
    disabledShade: "{palette.gray.60}",
    disabledContrast: "{palette.gray.contrast.70}",
    disabledOverlay: "{palette.gray.alpha}",
  },
});
