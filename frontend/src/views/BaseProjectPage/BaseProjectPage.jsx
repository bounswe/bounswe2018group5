import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Chip from "@material-ui/core/Chip/Chip.js"
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel.js"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary.js"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails.js"
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Footer from "components/Footer/Footer";

import Header from "components/Header/Header";
import HeaderLinks from "components/Header/HeaderLinks";
import Helmet from 'react-helmet';
import classNames from "classnames";
import Parallax from "material-kit-react/components/Parallax/Parallax";
import Bids from "../../components/Bids/Bids";
import Card from "material-dashboard-react/dist/components/Card/Card";
import CardFooter from "material-dashboard-react/dist/components/Card/CardFooter";

import CardAvatar from "material-dashboard-react/dist/components/Card/CardAvatar";
import CardBody from "material-dashboard-react/dist/components/Card/CardBody";
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import landingPageStyle from "material-kit-react/assets/jss/material-kit-react/views/landingPage.js";
import avatar from "assets/img/faces/christian.jpg";
import CreateBid from "../../components/CreateBid/CreateBid";
import MessageCard from "../../components/Card/MessageCard";

const dashboardRoutes = [];


class BaseProjectPage extends Component {

    state = { expanded: false };
    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    render() {
        const { classes, history, ...rest } = this.props;
        return (
            <div>
                <div>
                    <Helmet
                        title='Project Page'
                        meta={[
                            { property: 'og:title', content: 'Project Page' },
                        ]} />
                </div>

                <Header
                    color="transparent"
                    routes={dashboardRoutes}
                    brand="Freelancer"
                    rightLinks={<HeaderLinks rightButton={'login'} />}
                    handleDrawerToggle={this.handleDrawerToggle}
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
                                <h1 className={classes.title}>Social Media Monitoring Backend API</h1>
                                <Chip label="python" clickable className={classes.chip} color="primary" />
                                <Chip label="backend" clickable className={classes.chip} color="secondary" />
                                <Chip label="tornado" clickable className={classes.chip} color="primary" />
                                <Chip label="api" clickable className={classes.chip} color="secondary" />

                                <h4>
                                    This project will provide its users social media analysis.
                                    We do not have the frontend part of the project so documentation
                                    is important. We wait your offers.
                                </h4>
                                <br />

                            </GridItem>
                            <GridItem xs={12} sm={12} md={6}>
                                <br />
                                <ExpansionPanel style={{ opacity: '9' }}>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography className={classes.heading}>Show Details</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Typography>
                                            We are a small but visionary Internet company and we want to be ffective on social mediaplatforms.
                                            We need to monitor our social media accounts and activities in detail. We use Facebook ,Twitter,
                                            Instagram and LinkedIn. So you need to work with these platforms' APIs. We want you to have experience on APIs
                                            especially on these ones.Task will be coding only backend but must be well documented. Deadline is strict, but
                                            budget may be associated.
                                    </Typography>
                                    </ExpansionPanelDetails>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                        <Chip label="Budget: $500" className={classes.chip} />
                                        <Chip label="Deadline: April 26, 2019" className={classes.chip} />
                                    </div>

                                    <br />
                                    <br />
                                </ExpansionPanel>
                            </GridItem>
                        </GridContainer>
                    </div>
                </Parallax>
                <div className={classNames(classes.main, classes.mainRaised)}>
                    <div className={classes.container}>
                        <br />
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={5}>
                                <h2 className={classes.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: "black" }}>Project Owner</h2>
                                <br />
                                <Card profile>
                                    <CardAvatar profile>
                                        <img src={avatar} alt="..." />
                                    </CardAvatar>
                                    <CardBody profile>
                                        <h4>Mete Kocaman</h4>
                                        <h5 className={classes.cardCategoryWhite}>CEO at Sosyal Bilişim</h5>
                                    </CardBody>
                                    <CardFooter>
                                        <MessageCard projectOwner="Mete Kocaman"></MessageCard>
                                    </CardFooter>
                                </Card>
                            </GridItem>

                            <GridItem xs={12} sm={12} md={2}></GridItem>
                            <GridItem xs={12} sm={12} md={5}>
                                <h2 className={classes.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: "black" }}>Bids</h2>
                                <br />

                                <Bids price="450" name="Mert Kizil" rate="3.5" style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', width: '100%' }}></Bids>
                                <br />
                                <CreateBid></CreateBid>

                            </GridItem>

                        </GridContainer>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}


export default withStyles(landingPageStyle)(BaseProjectPage);
