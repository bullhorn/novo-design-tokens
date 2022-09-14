const { readFileSync } = require("fs");
const convertToDataUri = require("mini-svg-data-uri");

const tokenize = (obj, descriptors) =>
  Object.keys(obj).reduce((ret, name) => {
    const value = obj[name];
    if (typeof value === "string" || value instanceof String) {
      return Object.assign({}, ret, {
        [name]: { value, descriptors },
      });
    }
    return Object.assign({}, ret, {
      [name]: tokenize(value),
    });
  }, {});

const tokenizeAssets = (obj) =>
  Object.keys(obj).reduce((ret, name) => {
    const file = obj[name];
    const buffer = readFileSync(file);
    const value = `url("${convertToDataUri(buffer.toString())}")`;
    return Object.assign({}, ret, {
      [name]: { value },
    });
  }, {});

const describeWith = (tokens, descriptors) => {
  if (tokens.hasOwnProperty("value")) {
    return { ...tokens, ...descriptors };
  }
  return Object.keys(tokens).reduce((ret, name) => {
    const value = tokens[name];
    return Object.assign({}, ret, {
      [name]: describeWith(value, descriptors),
    });
  }, {});
};

module.exports = {
  tokenize,
  tokenizeAssets,
  describeWith,
};
