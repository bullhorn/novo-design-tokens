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

/** Legacy Variables
--background-body: #{$color-midnight}; //#202b38;
--background-main: #{$color-darkness}; //#161f27;
--background-bright: #{$color-moonlight}; //#1a242f
--background-dark: #{$color-onyx}; //e2e2e2
--background-muted: #{$color-neutral};
--selection: #{$color-ocean}; // #1c76c5;
--text-selection: #{$color-white};
--text-main: #{$color-light};
--text-muted: #{$color-stone};
--text-disabled: #a9b1ba;
--links: #{$color-sky-blue}; // #41adff;
--focus: #0096bfab;
--border: #{$color-onyx};
--code: #ffbe85;
--animation-duration: 0.1s;
--button-background: #{$dark};
--button-text: #{$light};
--button-hover: #324759;
--scrollbar-thumb: var(--button-hover);
--scrollbar-thumb-hover: var(--button-hover);
--form-placeholder: #a9a9a9;
--form-text: #fff;
--variable: #d941e2;
--highlight: #efdb43;

 */