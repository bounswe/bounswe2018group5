import React from "react";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
// @material-ui/icons
import Notifications from "@material-ui/icons/Notifications";
// core components
import Button from "material-dashboard-react/dist/components/CustomButtons/Button";

import headerLinksStyle from "material-dashboard-react/dist/assets/jss/material-dashboard-react/components/headerLinksStyle";

class HeaderLinks extends React.Component {
    state = {
        open: false
    };
    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }

        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        const { open } = this.state;
        return (
            <div>
                <div className={classes.manager}>
                    <Button
                        buttonRef={node => {
                            this.anchorEl = node;
                        }}
                        color={window.innerWidth > 959 ? "transparent" : "white"}
                        justIcon={window.innerWidth > 959}
                        simple={!(window.innerWidth > 959)}
                        aria-owns={open ? "menu-list-grow" : null}
                        aria-haspopup="true"
                        onClick={this.handleToggle}
                        className={classes.buttonLink}
                    >
                        <Notifications className={classes.icons} />
                        <span className={classes.notifications}>5</span>
                        <Hidden mdUp implementation="css">
                            <p onClick={this.handleClick} className={classes.linkText}>
                                Notification
                            </p>
                        </Hidden>
                    </Button>
                    <Poppers
                        open={open}
                        anchorEl={this.anchorEl}
                        transition
                        disablePortal
                        className={
                            classNames({ [classes.popperClose]: !open }) +
                            " " +
                            classes.pooperNav
                        }
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                id="menu-list-grow"
                                style={{
                                    transformOrigin:
                                        placement === "bottom" ? "center top" : "center bottom"
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={this.handleClose}>
                                        <MenuList role="menu">
                                            <MenuItem
                                                onClick={this.handleClose}
                                                className={classes.dropdownItem}
                                            >
                                                Mike John responded to your email
                                            </MenuItem>
                                            <MenuItem
                                                onClick={this.handleClose}
                                                className={classes.dropdownItem}
                                            >
                                                You have 5 new tasks
                                            </MenuItem>
                                            <MenuItem
                                                onClick={this.handleClose}
                                                className={classes.dropdownItem}
                                            >
                                                You're now friend with Andrew
                                            </MenuItem>
                                            <MenuItem
                                                onClick={this.handleClose}
                                                className={classes.dropdownItem}
                                            >
                                                Another Notification
                                            </MenuItem>
                                            <MenuItem
                                                onClick={this.handleClose}
                                                className={classes.dropdownItem}
                                            >
                                                Another One
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Poppers>
                </div>
            </div>
        );
    }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
