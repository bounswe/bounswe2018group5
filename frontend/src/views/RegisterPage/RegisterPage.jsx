import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

import HeaderLinks from "components/Header/HeaderLinks";
import Footer from "components/Footer/Footer";
// core components
import RegisterForm from 'components/Form/RegisterForm';
import Header from "components/Header/Header";
import Helmet from 'react-helmet';

import signupPageStyle from "material-kit-react/assets/jss/material-kit-react/views/loginPage.js";


const dashboardRoutes = [];

class RegisterPage extends Component {
    render() {
        const { classes, history, ...rest } = this.props;
        return (
            <div>
                <Helmet
                    title='Register'
                    meta={[
                        { property: 'og:title', content: 'Register' },
                    ]} />
                <Header
                    color="transparent"
                    routes={dashboardRoutes}
                    brand="Freelancer"
                    rightLinks={<HeaderLinks rightButton='login' />}
                    fixed
                    changeColorOnScroll={{
                        height: 400,
                        color: "white"
                    }}
                    {...rest}
                />
                <RegisterForm history={history}></RegisterForm>
                <Footer />
            </div>
        );
    }
}

export default withStyles(signupPageStyle)(RegisterPage);