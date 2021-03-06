module.exports = {
  theme: require("./theme"),
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
    1: { value: "0 1px 2px rgba(0, 0, 0, 0.15)" },
    2: { value: "0 3px 7px rgba(0, 0, 0, 0.15)" },
    3: { value: "0px 4px 10px rgba(0, 0, 0, 0.25)" },
    4: { value: "0px 16px 28px 0 rgba(0, 0, 0, 0.25)" },
    5: { value: "0px 27px 24px 0 rgba(0, 0, 0, 0.25)" },
    multi: {
      value:
        "0 -1px 3px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)",
    },
    card: { value: "{shadow.multi.value}" },
    popover: { value: "{shadow.1.value}" },
  },
};
