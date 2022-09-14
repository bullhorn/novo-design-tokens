module.exports = {
  spacing: require("./spacing"),
  border: require("./border"),
  ...require("./elevation"),
  size: {
    height: {
      none: { value: "0" },
      px: { value: "1px" },
      xs: { value: "1.2rem" }, // 2
      sm: { value: "2.4rem" }, // 4
      md: { value: "3.2rem" }, // 8
      lg: { value: "4.8rem" }, // 12
      xl: { value: "6rem" }, // 20
      "2xl": { value: "8.4rem" }, // 28
      "3xl": { value: "12rem" }, // 4
    },
  },
};
