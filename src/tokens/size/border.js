// Look! No namespaces!
module.exports = {
  width: {
    none: { value: "0" },
    thin: { value: "1px" },
    thick: { value: "2px" },
    base: { value: "{size.border.width.none.value}" },
  },
  radius: {
    round: { value: "0.4rem" },
    square: { value: "0rem" },
    circle: { value: 99999 },
    base: { value: "{size.border.radius.round.value}" },
  },
};
