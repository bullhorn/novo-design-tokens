const tokenize = (obj) =>
  Object.keys(obj).reduce((ret, name) => {
    const value = obj[name];
    return Object.assign({}, ret, {
      [name]: { value },
    });
  }, {});

module.exports = {
  weight: tokenize({
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  }),

  family: tokenize({
    body: `'Roboto', Helvetica, Arial, sans-serif`,
    mono: `'Roboto Mono', Menlo, Monaco, Consolas, "Courier New", monospace`,
    base: `{font.family.body.value}`,
  }),

  size: tokenize({
    base: "12px",
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "2.5rem",
    "4xl": "3rem",
  }),

  spacing: tokenize({
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  }),

  height: tokenize({
    normal: "normal",
    none: "1",
    shorter: "1.25",
    short: "1.375",
    base: "1.5",
    tall: "1.625",
    taller: "2",
  }),

  color: tokenize({
    base: "{color.dark.value}",
    secondary: "{color.light.value}",
    link: "{color.ocean.value}",
  }),
};
