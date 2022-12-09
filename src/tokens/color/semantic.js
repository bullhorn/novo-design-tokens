/**
 * Theme/Semantic colors
 */
const { tokenize, describeWith } = require("../../utils/token-utils");

// Subtle
module.exports = tokenize({
  ...{
    primary: "{palette.blue.50}",
    primaryTint: "{palette.blue.70}", // focus & hover
    primaryShade: "{palette.blue.30}",
    primaryContrast: "{palette.blue.contrast.50}",
    primaryOverlay: "{palette.blue.alpha}",
  },
  ...{
    secondary: "{palette.orange.70}",
    secondaryTint: "{palette.orange.80}", // focus & hover
    secondaryShade: "{palette.orange.50}",
    secondaryContrast: "{palette.orange.contrast.70}",
    secondaryOverlay: "{palette.orange.alpha}",
  },
  ...{
    positive: "{palette.blue.50}",
    positiveTint: "{palette.blue.70}",
    positiveShade: "{palette.blue.30}",
    positiveContrast: "{palette.blue.contrast.50}",
    positiveOverlay: "{palette.blue.alpha}",
  },
  ...{
    success: "{palette.green.50}",
    successTint: "{palette.green.70}",
    successShade: "{palette.green.30}",
    successContrast: "{palette.green.contrast.50}",
    successOverlay: "{palette.green.alpha}",
  },
  ...{
    danger: "{palette.red.50}",
    dangerTint: "{palette.red.70}",
    dangerShade: "{palette.red.30}",
    dangerContrast: "{palette.red.contrast.50}",
    dangerOverlay: "{palette.red.alpha}",
  },
  ...{
    neutral: "{palette.gray.90}",
    neutralTint: "{palette.gray.95}",
    neutralShade: "{palette.gray.80}",
    neutralContrast: "{palette.gray.contrast.90}",
    neutralOverlay: "{palette.gray.alpha}",
  },
  ...{
    warning: "{palette.yellow.90}",
    warningTint: "{palette.yellow.95}",
    warningShade: "{palette.yellow.80}",
    warningContrast: "{palette.yellow.contrast.90}",
    warningOverlay: "{palette.yellow.alpha}",
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
});
