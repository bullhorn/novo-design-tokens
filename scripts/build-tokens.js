const StyleDictionary = require("style-dictionary");
const getStyleDictionaryConfig = require("./token.config");
const getThemeConfig = require("./theme.config");
const registerFormats = require("./format.config");
const {
  combineThemeStyles,
  combineFigmaTokens,
} = require("./combine-theme-styles");

const PLATFORMS = ["css", "scss"];

registerFormats(StyleDictionary);

console.log(`\n\n Building global tokens...`);
StyleDictionary.extend(getStyleDictionaryConfig()).buildAllPlatforms();

const THEMES = ["novo", "talent"];
const MODES = ["light", "dark"];

THEMES.forEach((theme) => {
  MODES.forEach((mode) => {
    const sym = mode === "light" ? "☀️" : "🌙";
    console.log(`\n\n${sym} Building ${theme}-${mode} theme...`);
    StyleDictionary.extend(getThemeConfig(theme, mode)).buildAllPlatforms();
  });
});

combineThemeStyles(THEMES);
combineFigmaTokens(THEMES);
console.log(`tokens generated successfully!`);
