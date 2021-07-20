const base = require("./base");

module.exports = Object.assign({}, base, {
  "background-color": { value: "{color.white.value}" },
  "border-color": { value: "{color.ocean.value}" },
  "border-width": { value: "{size.border.width.base.value}" },
  "border-radius": { value: "{size.border.radius.base.value}" },
  color: { value: "{color.ocean.value}" },
});
