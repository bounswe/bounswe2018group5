import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
// core components
import footerStyle from "material-dashboard-react/dist/assets/jss/material-dashboard-react/components/footerStyle";

function LoggedInFooter({ ...props }) {
    const { classes } = props;
    return (
        <footer className={classes.footer}>
            <div className={classes.container}>
                <div className={classes.left}>
                </div>
                <p className={classes.right}>
          <span>
             &copy; {1900 + new Date().getYear()} , made with{" "}
              <a
                  href="https://github.com/bounswe/bounswe2018group5/wiki"
                  className={classes.a}
                  target="_blank"
                  rel="noopener noreferrer"
              >
                        Group 5
                    </a>{" "}
              for a better freelancer platform.
          </span>
                </p>
            </div>
        </footer>
    );
}

LoggedInFooter.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(footerStyle)(LoggedInFooter);