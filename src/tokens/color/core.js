const { black, gray, makeColorScale, white } = require("./util");

// Base Colors
const baseColors = {
  // Core
  base: white,
  black,
  white,
  gray,
  grey: gray,
  offWhite: "#f4f4f4",
  light: "#bebebe",
  dark: "#3d464d",
  // Bullhorn Brand Orange
  orange: "#ff6900",
  navigation: "#202945",
  // Named Colors
  skyBlue: "#009bdf",
  steel: "#5b6770",
  metal: "#637893",
  sand: "#f4f4f4",
  silver: "#e2e2e2",
  stone: "#bebebe",
  ash: "#a0a0a0",
  slate: "#707070",
  charcoal: "#282828",
  moonlight: "#2f384f",
  midnight: "#202945",
  darkness: "#0b0f1a",
  navy: "#0d2d42",
  aqua: "#3bafda",
  ocean: "#4a89dc",
  mint: "#37bc9b",
  grass: "#8cc152",
  sunflower: "#f6b042",
  bittersweet: "#eb6845",
  grapefruit: "#da4453",
  carnation: "#d770ad",
  lavender: "#967adc",
  mountain: "#9678b6",
};

// Use a reduce function to take the array of keys in baseColor
// and map them to an object with the same keys.
module.exports = Object.keys(baseColors).reduce((ret, name) => {
  const color = baseColors[name];
  return Object.assign({}, ret, {
    [name]: makeColorScale(color),
  });
}, {});
