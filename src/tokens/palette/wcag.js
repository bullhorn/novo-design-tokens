const chroma = require("chroma-js");
const { apcaContrastColor } = require("../../utils/color-utils");

const scale = [98, 95, 90, 80, 70, 60, 50, 40, 30, 20, 15];
const bow = "#3d464d";
const wob = "#ffffff";

const sortObject = (obj) =>
  Object.keys(obj)
    .sort()
    .reduce((accumulator, key) => {
      accumulator[key] = obj[key];
      return accumulator;
    }, {});

const calcColorScale = (
  name,
  hex,
  { h = [0, 0], c = [20, 20], l = [20, 120] } = {}
) => {
  // Only uses (L)ightness from B
  const combine = (a, b) => [a[0] + b[0], a[1] + b[1], b[2]];
  const [l0, l1, l2] = l;
  const pale = [h[1], c[2], l2];
  const lightShift = [h[1], c[1], l1];
  const darkShift = [h[0], c[0], l0];
  console.log(lightShift, darkShift);
  const hcl = chroma(hex).hcl();
  const high = combine(hcl, lightShift);
  const low = combine(hcl, darkShift);
  const light = chroma.hcl(high).hex();
  const dark = chroma.hcl(low).hex();
  const colors =
    l2 >= 0
      ? [
          chroma.hcl(combine(hcl, pale)).hex(),
          ...chroma.scale([light, dark]).mode("lch").colors(10),
        ]
      : chroma.scale([light, dark]).mode("lch").colors(11);

  const scaled = {
    ...colors.reduce(
      (record, color, i) => {
        return {
          ...record,
          [scale[i]]: { value: color },
        };
      },
      { 10: { value: chroma(hex).set("hcl.l", 0.15).hex() } }
    ),
  };

  // const contrast = apcaContrastColor(name, hex, wob, bow);
  const contrast = {
    ...colors.reduce(
      (record, color, i) => {
        return {
          ...record,
          [scale[i]]: {
            value: apcaContrastColor(`${name}-${scale[i]}`, color, wob, bow),
          },
        };
      },
      { 10: { value: wob } }
    ),
  };

  return {
    [name]: {
      // hex,
      alpha: { value: chroma(hex).alpha(0.1).hex() },
      contrast,
      ...sortObject(scaled),
    },
  };
};

const calculateColors = (colors) => {
  const expanded = Object.keys(colors).reduce((record, name) => {
    const [color, shift] = Array.isArray(colors[name])
      ? colors[name]
      : [colors[name]];
    return {
      ...record,
      ...calcColorScale(name, color, shift),
    };
  }, {});
  return expanded;
};

module.exports = {
  calcColorScale,
  calculateColors,
};
