import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Chip from "@material-ui/core/Chip/Chip.js"
import classNames from "classnames";

import Helmet from 'react-helmet';
import HeaderLinks from "components/Header/HeaderLinks";
import Footer from "components/Footer/Footer";
import Parallax from "material-kit-react/components/Parallax/Parallax";
import Header from "components/Header/Header";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import CallMade from "@material-ui/icons/CallMade";
import Card from "material-dashboard-react/dist/components/Card/Card";
import Button from "material-kit-react/components/CustomButtons/Button";

import combineStyles from "services/combineStyles";

import CardAvatar from "material-dashboard-react/dist/components/Card/CardAvatar";
import CardBody from "material-dashboard-react/dist/components/Card/CardBody";
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";

import tooltipStyle from "material-kit-react/assets/jss/material-kit-react/tooltipsStyle";
import landingPageStyle from "material-kit-react/assets/jss/material-kit-react/views/landingPage.js";
import loginPageStyle from "material-kit-react/assets/jss/material-kit-react/views/loginPage";


import Paper from '@material-ui/core/Paper';

import {
    tryGetProject,
    getProjectReset
} from "redux/project/Actions.js";

import connect from "react-redux/es/connect/connect";
import default_image from "assets/img/faces/default_image.png";

const styles = {
    
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    }
};

const dashboardRoutes = [];

class GuestProjectPage extends Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            expanded: false,
            cardAnimaton: "cardHidden",
            project: {
                owner: {},
                bids: [],
                attachments: [],
                freelancer: {},
                tags: []
            },
        };
    }
    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    componentDidMount() {
        const { project_id } = this.props.match.params;
        this.props.tryGetProject(project_id);
    }

    componentDidUpdate(prevProps, prevState) {
        const { getProjectInProgress, getProjectHasError, getProjectCompleted, project } = this.props.project;

        if (!getProjectInProgress && !getProjectHasError && getProjectCompleted) {
            const bids = project.bids.sort(function(a, b) {
                return parseFloat(a.status) - parseFloat(b.status);
            });
            const freelancer = project.freelancer || {};
            const attachments = project.attachments || [];
            const tags = project.tags || [];
            var current_project = { ...project, bids: bids, freelancer: freelancer, attachments: attachments, tags: tags };
            this.setState({ project: current_project });

            this.props.getProjectReset();
        }
    }

    render() {
        const { classes, ...rest } = this.props;
        let userBox, attachmentBox;

            attachmentBox = <GridItem xs={12} sm={12} md={12}>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '80%' }}>Attachhment Name</TableCell>
                                <TableCell style={{ width: '20%' }}>Attachment Link</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.project.attachments.map(file => (
                                <TableRow key={file}>
                                    <TableCell>{file}</TableCell>
                                    <TableCell>
                                        <Button
                                            color="github" simple
                                            justIcon
                                            href={process.env.REACT_APP_API_URL + "media/attachments/" + this.state.project.project_id + "/" + file}
                                            target="_blank"
                                            className={classes.buttonLink}
                                        >
                                            <CallMade />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </GridItem>;
            userBox = <GridItem xs={12} sm={12} md={12}>
                <h2 className={classes.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: "black" }}>Project Owner</h2>
                <br />
                <Card profile>
                    <CardAvatar profile>
                        <img src={process.env.REACT_APP_API_STATIC_URL + "profile_images/" + this.state.project.owner.profile_image}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = default_image
                            }} alt="..." />
                    </CardAvatar>
                    <CardBody profile>
                        <h4>{this.state.project.owner.full_name}</h4>
                        <h6 className={classes.title}>{this.state.project.owner.bio}</h6>
                    </CardBody>
                </Card>
            </GridItem>;
        var bids = (
            <TableBody>
                {this.state.project.bids.map((prop, key) => {
                    let accepted;
                    accepted = false;
                    return (
                        <TableRow key={key} selected={accepted}>
                            <TableCell component="th" scope="row" numeric>
                                {prop.offer}$
                                </TableCell>
                            <TableCell>{prop.freelancer.full_name}</TableCell>
                            <TableCell numeric>{prop.freelancer.avg_rating}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        );

        let milestoneBidContainer = <GridItem xs={12} sm={12} md={12}>
            <h2 className={classes.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: "black" }}>Bids</h2>
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Suggested Price</TableCell>
                            <TableCell>Bid Owner</TableCell>
                            <TableCell numeric>Bid Owner's Rate</TableCell>
                        </TableRow>
                    </TableHead>
                    {bids}
                </Table>
                <br />
            </Paper>
        </GridItem>;

        let tagsList;

        tagsList = this.state.project.tags.map((prop, key) => {
            return (
                <Tooltip
                    id="tooltip-left"
                    title={prop.description}
                    placement="top"
                    classes={{ tooltip: classes.tooltip }}
                >
                    <Button fontSize={"16px"} color="success">{prop.label}</Button>
                </Tooltip>
            );
        });

        return (
                <div>
                    <Helmet
                        title='Home Page'
                        meta={[
                            { property: 'og:title', content: 'Home Page' },
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
                    <Parallax small filter image={require("assets/img/landing-bg.jpg")}>
                        <div className={classes.container}>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={12}>
                                <h1 className={classes.title}>{this.state.project.title}</h1>
                                </GridItem>
                            </GridContainer>
                        </div>
                    </Parallax>
                <div className={classNames(classes.main, classes.mainRaised)}>
                    <div className={classes.container} style={{
                        padding: "64px"
                    }}>
                    <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <Paper className={classes.root} style={{ padding: "32px" }}>
                                    {tagsList}
                                    <h4 style={{
                                                color: "black"
                                            }}>
                                        {this.state.project.description}
                                    </h4>
                                    <br />
                                    <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%' }}>
                                        <Chip label={"Budget: $" + this.state.project.budget} className={classes.chip} />
                                        <Chip label={"Deadline: " + this.state.project.deadline} className={classes.chip} />
                                    </div>
                                </Paper>
                            </GridItem>
                            {milestoneBidContainer}
                        </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <GridContainer>
                                    {userBox}
                                </GridContainer>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                                <GridContainer>
                                    {attachmentBox}
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
                    </div>
                </div>
            <Footer />
            </div >
        );
    }
}

const combinedStyles = combineStyles(tooltipStyle, styles, loginPageStyle, landingPageStyle);

function bindAction(dispatch) {
    return {
        tryGetProject: (project_id) => dispatch(tryGetProject(project_id)),
        getProjectReset: () => dispatch(getProjectReset()),
    };
}

const mapStateToProps = state => ({
    project: state.project
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(combinedStyles)(GuestProjectPage));
