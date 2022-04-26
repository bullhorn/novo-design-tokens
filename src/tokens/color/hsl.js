// const core = require("./core");

// TODO: Replace our color wheel with HSL values

const tokenize = (obj) =>
  Object.keys(obj).reduce((ret, name) => {
    const value = obj[name];
    return Object.assign({}, ret, {
      [name]: { value },
      [`${name}-10`]: { value: `hsla({color.hsl.${name}.value}, 15%, 100%)` },
      [`${name}-20`]: { value: `hsla({color.hsl.${name}.value}, 25%, 100%)` },
      [`${name}-30`]: { value: `hsla({color.hsl.${name}.value}, 40%, 100%)` },
      [`${name}-40`]: { value: `hsla({color.hsl.${name}.value}, 50%, 100%)` },
      [`${name}-50`]: { value: `hsla({color.hsl.${name}.value}, 60%, 100%)` },
      [`${name}-60`]: { value: `hsla({color.hsl.${name}.value}, 70%, 100%)` },
      [`${name}-70`]: { value: `hsla({color.hsl.${name}.value}, 80%, 100%)` },
      [`${name}-80`]: { value: `hsla({color.hsl.${name}.value}, 88%, 100%)` },
      [`${name}-90`]: { value: `hsla({color.hsl.${name}.value}, 95%, 100%)` },
    });
  }, {});

module.exports = tokenize({
  //   jobOrder: '350, 43%',
  //   candidate: '146, 47%',
  //   contact: '33, 100%',
  //   company: '204, 71%,',
  //   lead: '315, 29%',

  // Are these HS? :^^^:
  gray: "0, 0%",
  red: "354, 67%",
  pink: "324, 56%",
  orange: "13, 81%",
  yellow: "37, 91%",
  green: "89, 47%",
  teal: "165, 55%",
  aqua: "196, 68%",
  blue: "214, 68%",
  indigo: "257, 58%",
  violet: "269, 30%",
});
