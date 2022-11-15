const { tokenize } = require("../../utils/token-utils.js");

module.exports = tokenize({
  border: {
    radius: "0.4rem",
  },
  button: {
    shadow: {
      hover: "{shadow.z2}",
      active: "{shadow.z1}",
    },
  },
  color: {
    ...{
      background: "{color.white}", // body Color
      backgroundSubtle: "{palette.gray.98}", // alt background color for containers
      backgroundMuted: "{palette.gray.95}", // a muted state for backgrounds, do we need this
      backgroundDisabled: "{palette.gray.98}", // Background color for whenever a components is disabled
      backgroundOverlay: "#0000001f",
    },
  },
});

// --background-body: #{$color-white};
// --background-main: #{$color-bright}; //efefef
// --background-bright: #{$color-white}; //f7f7f7
// --background-muted: #{$color-sand}; //f7f7f7
// --selection: #{$color-ocean}; //#9e9e9e;
// --text-main: #{$color-dark}; //#363636;
// --text-bright: #{$color-black};
// --text-muted: #{$color-slate}; //#70777f;
// --links: #{$color-ocean};
// --focus: #{$color-ocean};
// --border: #{$color-light}; //#dbdbdb;
// --code: #000;
// --animation-duration: 0.1s;
// --button-hover: #aaa;
// --scrollbar-thumb: #{$color-dark};
// --scrollbar-thumb-hover: #{$color-dark};
// --form-placeholder: #949494;
// --form-text: #000;
// --variable: #39a33c;
// --highlight: #ff0;
