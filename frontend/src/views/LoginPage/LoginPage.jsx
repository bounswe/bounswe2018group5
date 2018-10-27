import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

import HeaderLinks from "components/Header/HeaderLinks";
import Footer from "components/Footer/Footer";
// core components
import LoginForm from 'components/Form/LoginForm';
import Header from "components/Header/Header";
import Helmet from 'react-helmet';

import signupPageStyle from "material-kit-react/assets/jss/material-kit-react/views/loginPage.js";

const dashboardRoutes = [];

class LoginPage extends Component {
    render() {
        const { classes, history,...rest } = this.props;
        return (
            <div>
                <Helmet
                    title='Login'
                    meta={[
                        { property: 'og:title', content: 'Login' },
                    ]} />
                <Header
                    color="transparent"
                    routes={dashboardRoutes}
                    brand="Freelancer"
                    rightLinks={<HeaderLinks rightButton='register' />}
                    fixed
                    changeColorOnScroll={{
                        height: 400,
                        color: "white"
                    }}
                    {...rest}
                />
                <LoginForm history={history}></LoginForm>
                <Footer />
            </div>
        );
    }
}

export default withStyles(signupPageStyle)(LoginPage);