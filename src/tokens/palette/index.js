const { calculateColors } = require("./wcag");

module.exports = calculateColors({
  red: ["#ee204d", { l: [10, 110, 130] }], // "#DA4453",
  pink: "#D770AD",
  orange: "#ff6900",
  yellow: ["#DFFF00", { h: [-15, 0], c: [45, 20, 5], l: [50, 120, 140] }],
  green: "#50C878", //"#8CC152",
  teal: "#008080",
  aqua: "#3bafda",
  blue: "#1E88E5", //"007AFD", //"#4a89dc",
  indigo: "#4b0082", //"#5c6bc0","#967ADC",
  violet: "#9678B6",
  gray: ["#808080", { c: [0, 0], l: [16, 98] }],
});
