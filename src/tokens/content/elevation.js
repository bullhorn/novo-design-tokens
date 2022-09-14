const { tokenize } = require("../../utils/token-utils.js");

module.exports = tokenize({
  zIndex: {
    none: 0,
    below: -1,
    low: 1,
    mid: 2,
    high: 3,
    highest: 99,
  },

  shadow: {
    none: "none",
    low: "0px 2px 8px rgba(36, 41, 46, 0.1)",
    mid: "0px 4px 16px rgba(36, 41, 46, 0.1)",
    high: "0px 6px 24px rgba(36, 41, 46, 0.1)",
    highest: "0px 8px 32px rgba(36, 41, 46, 0.1)",
    z0: "0px 0px 0px 0px rgba(0, 0, 0, 0.2), 0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 0px 0px rgba(0, 0, 0, 0.12)",
    z1: "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
    z2: "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
    z3: "0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)",
    z4: "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
    z5: "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12)",
    card: { value: "{shadow.z2}" },
    popover: { value: "{shadow.z2}" },
  },
});
