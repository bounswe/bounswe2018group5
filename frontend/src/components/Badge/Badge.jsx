import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import badgeStyle from "material-kit-react/assets/jss/material-kit-react/components/badgeStyle";

function Badge({ ...props }) {
  const { classes, color, children, fontSize } = props;
  let styles;
  if (fontSize) {
    styles = { fontSize: fontSize }
  } else {
    styles = { fontSize: "10px" }
  }
  return (
      <span className={classes.badge + " " + classes[color]} style={styles}>{children}</span>
  );
}

Badge.defaultProps = {
  color: "gray"
};

Badge.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "warning",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ])
};

export default withStyles(badgeStyle)(Badge);