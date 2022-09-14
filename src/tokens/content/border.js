const { tokenize } = require("../../utils/token-utils.js");

module.exports = tokenize({
  width: "1px",
  radius: "0px",
  main: "{border.width} solid {color.border}",
  disabled: "{border.width} dashed {color.disabled}",
  error: "{border.width} solid {color.error}",
});

/* 
<novo-button variant="ghost|rounded|" color="primary"></novo-button>  button-border-radius <== theme-border-radius <== border-radius-round 

:root {
  --button-border-radius: var(--border-radius-full);
  --border-radius-round: 5px;
}

.use-round-borders {
  border-radius: var(--border-radius-round);
}
*/
