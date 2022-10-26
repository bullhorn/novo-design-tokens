const button = require(".");
const { tokenize } = require("../../utils/token-utils");

module.exports = tokenize({
  shadow: {
    hover: "{button.shadow.hover}",
    active: "{button.shadow.active}",
  },
  color: {
    background: "{color.selection}",
    backgroundHover: "{color.selectionTint}",
    backgroundActive: "{color.selectionShade}",
    text: "{color.selectionContrast}",
    border: "transparent",
  },
});

// button.primary.color.background.@: color.selection.@
// button.primary.color.background.hover = color.selection.tint

// > Note: description using indexes starting at 1.
//
// CTI: category -> type -> item -> variant -> state
// category: [required] index 1.
// type: [required] index 2.
// item: [optional] len=4,5 then index 3.
// variant: [optional] len=3 then index 3, len=4,5 then len-1.
// state: [optional] len=4,5 always last index

// border-radius
// color-background
// color-background-subtle
// color-background-disabled ???

// color-success
// color-success-tint

// color-background-button-primary-hover

// ---
// Component CTI: item -> variant -> category -> type  -> state
// category: [required] no variant index 2 else index 3.
// type: [required] no variant index 3 else index 4.
// item: [required] index 1.
// variant: [optional] index 2 if len=5 or (len=4 & no state).
// state: [optional] use known list

// button-primary-color-background-hover
//    ↑      ↑      ↑       ↑        ↑
//    |      |      |       |      state
//    |      |      |     type
//    |      |   category
//    |   variant
//  item

// button-color-background-hover   (len=4.. state=hover so no variant)
// button-primary-color-background (len=4.. no state so variant primary)
// button-large-border-radius      (len=4.. v=2)

// use known "states" ==> hover, active, checked, focus, invalid, disabled
