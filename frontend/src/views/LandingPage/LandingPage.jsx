import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

import HeaderLinks from "components/Header/HeaderLinks";
import Footer from "components/Footer/Footer";
// core components
import Button from 'material-kit-react/components/CustomButtons/Button';
import Header from "material-kit-react/components/Header/Header";
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Parallax from "material-kit-react/components/Parallax/Parallax";
import Helmet from 'react-helmet';

import landingPageStyle from "material-kit-react/assets/jss/material-kit-react/views/landingPage.js";

import TestimonialSection from "./Sections/TestimonialSection";
import StatSection from "./Sections/StatSection";
import ProjectSection from "./Sections/ProjectSection";

const dashboardRoutes = [];

class LandingPage extends Component {
    render() {
        const { classes, ...rest } = this.props;
        return (
            <div>
                <Helmet
                    title='Freelancer Platform'
                    meta={[
                        { property: 'og:title', content: 'Freelancer Platform' },
                    ]} />
                <Header
                    color="transparent"
                    routes={dashboardRoutes}
                    brand="Freelancer"
                    rightLinks={<HeaderLinks />}
                    fixed
                    changeColorOnScroll={{
                        height: 400,
                        color: "white"
                    }}
                    {...rest}
                />
                <Parallax filter image={require("assets/img/landing-bg.jpg")}>
                    <div className={classes.container}>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={6}>
                                <h1 className={classes.title}>Freshest Freelance Job Platform Ever</h1>
                                <h4>
                                    Karpuz is a platform for lean entrepreneurs & agile developers to meet and match for
                                    small to middle scale projects.Got an idea? This is the place to find a rock star
                                    developer.Need to put your skills to use? Earn money while you do what you enjoy.
                                </h4>
                                <br />
                                <Link to="sign-up" className={classes.link}>
                                    <Button color="rose" size="lg" round>
                                        Register Now!
                                    </Button>
                                </Link>
                            </GridItem>
                        </GridContainer>
                    </div>
                </Parallax>
                <div className={classNames(classes.main, classes.mainRaised)}>
                    <div className={classes.container}>
                        <StatSection />
                        <ProjectSection />
                        <TestimonialSection />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default withStyles(landingPageStyle)(LandingPage);