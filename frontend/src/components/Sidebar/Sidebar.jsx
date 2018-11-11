import React, {Component} from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import ExitToApp from "@material-ui/icons/ExitToApp";
// core components
import HeaderLinks from "material-dashboard-react/dist/components/Header/HeaderLinks";

import logo from "assets/img/favicon.ico";
import image from "assets/img/sidebar.jpg";

import sidebarStyle from "material-dashboard-react/dist/assets/jss/material-dashboard-react/components/sidebarStyle";

import {removeCookie, LOGGEDIN_COOKIE, TOKEN_COOKIE} from "services/cookies";
import {connect} from "react-redux";
import { logout } from "redux/auth/Actions.js";

class Sidebar extends Component {
    // verifies if routeName is the one active (in browser input)
    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? true : false;
    }

    handleLogout(event) {
        this.props.logout();
        event.preventDefault();
    }

    componentDidUpdate(prevProps, prevState) {
        const { history } = this.props;
        const { loggedIn, logout } = this.props.auth;

        if (!loggedIn && logout) {
            removeCookie(TOKEN_COOKIE, { path: "/" });
            removeCookie(LOGGEDIN_COOKIE, { path: "/" });
            history.push("/");
        }
    }

    render() {
        const {classes, color, logoText, routes} = this.props;
        var logoutItemClasses = classNames({[" " + classes[color]]: true});
        var links = (
            <List className={classes.list}>
                {routes.map((prop, key) => {
                    if (prop.active === false) return null; 
                    if (prop.redirect) return null;
                    var activePro = " ";
                    var listItemClasses;
                    if (prop.path === "/upgrade-to-pro") {
                        activePro = classes.activePro + " ";
                        listItemClasses = classNames({
                            [" " + classes[color]]: true
                        });
                    } else {
                        listItemClasses = classNames({
                            [" " + classes[color]]: this.activeRoute(prop.path)
                        });
                    }
                    const whiteFontClasses = classNames({
                        [" " + classes.whiteFont]: this.activeRoute(prop.path)
                    });
                    return (
                        <NavLink
                            to={prop.path}
                            className={activePro + classes.item}
                            activeClassName="active"
                            key={key}
                        >
                            <ListItem button className={classes.itemLink + listItemClasses}>
                                <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
                                    {typeof prop.icon === "string" ? (
                                        <Icon>{prop.icon}</Icon>
                                    ) : (
                                        <prop.icon/>
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={prop.sidebarName}
                                    className={classes.itemText + whiteFontClasses}
                                    disableTypography={true}
                                />
                            </ListItem>
                        </NavLink>
                    );
                })}
                <NavLink
                    onClick={event => this.handleLogout(event)}
                    to={'#'}
                    className={classes.activePro + " " + classes.item}
                    activeClassName="active"
                >
                    <ListItem button className={classes.itemLink + logoutItemClasses}>
                        <ListItemIcon className={classes.itemIcon}>
                            <ExitToApp/>
                        </ListItemIcon>
                        <ListItemText
                            primary={'Logout'}
                            className={classes.itemText}
                            disableTypography={true}
                        />
                    </ListItem>
                </NavLink>
            </List>
        );
        var brand = (
            <div className={classes.logo}>
                <a href="/home" className={classes.logoLink}>
                    <div className={classes.logoImage}>
                        <img src={logo} alt="logo" className={classes.img}/>
                    </div>
                    {logoText}
                </a>
            </div>
        );
        return (
            <div>
                <Hidden mdUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor="right"
                        open={this.props.open}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        onClose={this.props.handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true // Better open performance on mobile.
                        }}
                    >
                        {brand}
                        <div className={classes.sidebarWrapper}>
                            <HeaderLinks/>
                            {links}
                        </div>
                        {image !== undefined ? (
                            <div
                                className={classes.background}
                                style={{backgroundImage: "url(" + image + ")"}}
                            />
                        ) : null}
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        anchor="left"
                        variant="permanent"
                        open
                        classes={{
                            paper: classes.drawerPaper
                        }}
                    >
                        {brand}
                        <div className={classes.sidebarWrapper}>{links}</div>
                        {image !== undefined ? (
                            <div
                                className={classes.background}
                                style={{backgroundImage: "url(" + image + ")"}}
                            />
                        ) : null}
                    </Drawer>
                </Hidden>
            </div>
        );
    }
};

Sidebar.propTypes = {
    classes: PropTypes.object.isRequired
};

function bindAction(dispatch) {
    return {
        logout: () => dispatch(logout())
    };
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(sidebarStyle)(Sidebar));