const { tokenize } = require("../../utils/token-utils");

module.exports = {
  ...tokenize({
    fontFamily: `{font.family.mono}`,
    backgroundColor: `{color.background}`,
    textColor: `{color.text}`,
    tagColor: `{palette.blue.30}`,
    propertyColor: `{palette.gray.40}`,
    valueColor: `{palette.gray.20}`,
    commentColor: `{palette.aqua.30}`,
  }),
  kbd: tokenize({
    backgroundColor: `{color.background}`,
    textColor: `{color.text}`,
  }),
};
