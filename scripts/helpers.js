function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

function deepSet(obj, path, value, create) {
  var properties = path.split(".");
  var currentObject = obj;
  var property;

  create = create === undefined ? true : create;

  while (properties.length) {
    property = properties.shift();

    if (!currentObject) break;

    if (!isObject(currentObject[property]) && create) {
      currentObject[property] = {};
    }

    if (!properties.length) {
      currentObject[property] = value;
    }
    currentObject = currentObject[property];
  }

  return obj;
}

const toPascalCase = (string) => {
  return `${string}`
    .toLowerCase()
    .replace(new RegExp(/[-_.]+/, "g"), " ")
    .replace(new RegExp(/[^\w\s]/, "g"), "")
    .replace(
      new RegExp(/\s+(.)(\w*)/, "g"),
      ($1, $2, $3) => `${$2.toUpperCase() + $3}`
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
};

const kebabCase = (string) =>
  string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

// Don't replace '-'
const dotCase = (string) =>
  string
    .replace(/([a-z])([A-Z])/g, "$1.$2")
    .replace(/[\s_]+/g, ".")
    .toLowerCase();

module.exports = {
  dotCase,
  kebabCase,
  toPascalCase,
  deepSet,
  isObject,
};
