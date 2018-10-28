import React, {Component} from "react";
import PropTypes from "prop-types";
import {Switch, Route, Redirect} from "react-router-dom";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import HomePage from "views/HomePage/HomePage.jsx";
import withStyles from "@material-ui/core/styles/withStyles";

import Person from "@material-ui/icons/Person";
import Home from "@material-ui/icons/Home";

import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// core components
import Header from "components/Header/LoggedInHeader.jsx";
import Footer from "components/Footer/LoggedInFooter.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import dashboardStyle from "material-dashboard-react/dist/assets/jss/material-dashboard-react/layouts/dashboardStyle";

const dashboardRoutes = [
    {
        path: "/home/index",
        sidebarName: "Home",
        navbarName: "Home",
        icon: Home,
        component: HomePage
    },
    {
        path: "/home/profile",
        sidebarName: "User Profile",
        navbarName: "Profile",
        icon: Person,
        component: UserProfile
    },
    { redirect: true, path: "/home", to: "/home/index", navbarName: "Redirect" }
];

const switchRoutes = (
    <Switch>
        {dashboardRoutes.map((prop, key) => {
            if (prop.redirect)
                return <Redirect from={prop.path} to={prop.to} key={key}/>;
            return <Route path={prop.path} component={prop.component} key={key}/>;
        })}
    </Switch>
);

class HomeLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false
        };
        this.resizeFunction = this.resizeFunction.bind(this);
    }

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };

    resizeFunction() {
        if (window.innerWidth >= 960) {
            this.setState({mobileOpen: false});
        }
    }

    componentDidMount() {
        console.log(this.props.children);
        if (navigator.platform.indexOf("Win") > -1) {
            const ps = new PerfectScrollbar(this.refs.mainPanel);
        }
        window.addEventListener("resize", this.resizeFunction);
    }

    componentDidUpdate(e) {
        if (e.history.location.pathname !== e.location.pathname) {
            this.refs.mainPanel.scrollTop = 0;
            if (this.state.mobileOpen) {
                this.setState({mobileOpen: false});
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeFunction);
    }

    render() {
        const {classes, ...rest} = this.props;
        console.log(this.props);
        return (
            <div className={classes.wrapper}>
                <Sidebar
                    routes={dashboardRoutes}
                    logoText={"Karpuz"}
                    handleDrawerToggle={this.handleDrawerToggle}
                    open={this.state.mobileOpen}
                    color="blue"
                    {...rest}
                />
                <div className={classes.mainPanel} ref="mainPanel">
                    <Header
                        routes={dashboardRoutes}
                        handleDrawerToggle={this.handleDrawerToggle}
                        {...rest}
                    />
                    {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
                    <div className={classes.content}>
                        <div className={classes.container}>{switchRoutes}</div>
                    </div>
                    <Footer/>
                </div>
            </div>
        );
    }
}

HomeLayout.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(HomeLayout);