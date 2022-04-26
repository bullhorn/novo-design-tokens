const base = require("./base");

module.exports = Object.assign({}, base, {
  backgroundColor: { value: "{color.white.value}" },
  borderColor: { value: "{color.ocean.value}" },
  borderWidth: { value: "{size.border.width.base.value}" },
  color: { value: "{color.ocean.value}" },
});
