const { tokenize, describeWith } = require("../../utils/token-utils");

module.exports = describeWith(
  tokenize({
    // Named Colors
    bright: "#f7f7f7",
    light: "#dbdbdb",
    neutral: "#4f5361",
    dark: "#3d464d",
    navigation: "#202945",
    moonlight: "#1a242f", // "#2f384f",
    midnight: "#202945", // "#202945",
    darkness: "#161f27", // "#0b0f1a",
    navy: "#0d2d42",
    // Anaylytics
    skyBlue: "#009bdf",
    ocean: "#4a89dc",
    mint: "#37bc9b",
    grass: "#8cc152",
    sunflower: "#f6b042",
    bittersweet: "#eb6845",
    grapefruit: "#da4453",
    carnation: "#d770ad",
    lavender: "#967adc",
    mountain: "#9678b6",
  })
);
