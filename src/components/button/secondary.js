const base = require("./base");

module.exports = Object.assign({}, base, {
  "background-color": { value: "{color.white}" },
  "border-color": { value: "{color.ocean}" },
  "border-width": { value: "{size.border.width.base}" },
  "border-radius": { value: "{size.border.radius.base}" },
  color: { value: "{color.ocean}" },
});
