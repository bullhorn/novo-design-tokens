// const { makeColorScale } = require("./util");

// // Base Colors
// const entityColors = {
//   company: "#3399dd",
//   candidate: "#44bb77",
//   lead: "#aa6699",
//   contact: "#ffaa44",
//   opportunity: "#662255",
//   job: "#bb5566",
//   submission: "#a9adbb",
//   sendout: "#747884",
//   placement: "#0b344f",
//   note: "#747884",
//   contract: "#454ea0",
//   jobCode: "#696d79",
//   earnCode: "#696d79",
//   invoiceStatement: "#696d79",
//   billableCharge: "#696d79",
//   payableCharge: "#696d79",
// };

// // Use a reduce function to take the array of keys in baseColor
// // and map them to an object with the same keys.
// module.exports = Object.keys(entityColors).reduce((ret, name) => {
//   const color = entityColors[name];
//   return Object.assign({}, ret, {
//     [name]: makeColorScale(color),
//   });
// }, {});

module.exports = {
  company: { value: "#3399dd" },
  candidate: { value: "#44bb77" },
  lead: { value: "#aa6699" },
  contact: { value: "#ffaa44" },
  opportunity: { value: "#662255" },
  job: { value: "#bb5566" },
  submission: { value: "#a9adbb" },
  sendout: { value: "#747884" },
  placement: { value: "#0b344f" },
  note: { value: "#747884" },
  contract: { value: "#454ea0" },
  jobCode: { value: "#696d79" },
  earnCode: { value: "#696d79" },
  invoiceStatement: { value: "#696d79" },
  billableCharge: { value: "#696d79" },
  payableCharge: { value: "#696d79" },
};
