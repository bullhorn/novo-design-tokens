const { tokenize } = require("../../utils/token-utils.js");

module.exports = tokenize({
  font: {
    size: {
      base: "10px",
    },
  },
  border: {
    radius: "4px",
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
  card: {
    shadow: "{shadow.low}",
  },
  fab: {
    shadow: "{shadow.mid}",
  },
  toast: {
    backgroundColor: "{color.background}",
    textColor: "{color.text}",
    borderRadius: "12px",
    shadow: "{shadow.low}",
  },
  drawer: {
    shadow: "{shadow.low}",
  },
  button: {
    size: {
      height: "2.7rem",
    },
    // borderRadius: "{border.radiusFull}",
    small: {
      size: {
        height: "20px",
      },
    },
    large: {
      size: {
        height: "40px",
      },
      borderRadius: "40px",
    },
  },

  // Actions
});

// Button sm, md, lg
// height
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
