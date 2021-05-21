module.exports = {
  color: require("./color"),
  size: require("./size"),
  spacing: require("./spacing"),
  // expand typography variables to root
  ...require("./typography"),
  borderWidth: {
    none: { value: "0" },
    thin: { value: "1px" },
    thick: { value: "2px" },
  },
  borderRadius: {
    round: { value: "0.4rem" },
    square: { value: "0rem" },
    circle: { value: 99999 },
    default: { value: "{borderRadius.round.value}" },
  },
  shadow: {
    1: { value: "0px 2px 5px 0 rgba(0, 0, 0, 0.26)" },
    2: { value: "0px 3px 8px rgba(0, 0, 0, 0.2)" },
    3: { value: "0px 4px 10px rgba(0, 0, 0, 0.15)" },
    4: { value: "0px 16px 28px 0 rgba(0, 0, 0, 0.22)" },
    5: { value: "0px 27px 24px 0 rgba(0, 0, 0, 0.2)" },
    multi: {
      value:
        "0 -1px 3px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)",
    },
    card: { value: "{shadow.3.value}" },
    popover: { value: "{shadow.1.value}" },
  },
};
