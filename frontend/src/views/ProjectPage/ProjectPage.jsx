import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Chip from "@material-ui/core/Chip/Chip.js"
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel.js"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary.js"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails.js"
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Helmet from 'react-helmet';
import Bids from "../../components/Bids/Bids";
import Card from "material-dashboard-react/dist/components/Card/Card";
import CardFooter from "material-dashboard-react/dist/components/Card/CardFooter";

import CardAvatar from "material-dashboard-react/dist/components/Card/CardAvatar";
import CardBody from "material-dashboard-react/dist/components/Card/CardBody";
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import avatar from "assets/img/faces/christian.jpg";
import CreateBid from "../../components/CreateBid/CreateBid";
import MessageCard from "../../components/Card/MessageCard";

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

class ProjectPage extends Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            expanded: false,
            cardAnimaton: "cardHidden",
            project: {
                owner: {}
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
            this.setState({ project });
            this.props.getProjectReset();
        }
    }

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
                <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                        <h1 className={classes.title}>{this.state.project.title}</h1>
                        <Chip label="python" clickable className={classes.chip} color="primary" />
                        <Chip label="backend" clickable className={classes.chip} color="secondary" />
                        <Chip label="tornado" clickable className={classes.chip} color="primary" />
                        <Chip label="api" clickable className={classes.chip} color="secondary" />

                        <h4>
                            {this.state.project.description}
                                </h4>
                        <br />
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                <Chip label={"Budget: $" + this.state.project.budget} className={classes.chip} />
                                <Chip label={"Deadline: " + this.state.project.deadline} className={classes.chip} />
                            </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={1}></GridItem>
                    <GridItem xs={12} sm={12} md={5}>
                        <GridContainer xs={12} sm={12} md={12}>
                            <GridItem xs={12} sm={12} md={12}>
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
                                    <CardFooter>
                                        <MessageCard projectOwner="Mete Kocaman"></MessageCard>
                                    </CardFooter>
                                </Card>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                                <h2 className={classes.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: "black" }}>Bids</h2>
                                <Bids price="450" name="Mert Kizil" rate="3.5" style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', width: '100%' }}></Bids>
                                <br />
                                <CreateBid></CreateBid>
                            </GridItem>
                        </GridContainer>

                        
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}


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
)(withStyles(styles)(ProjectPage));
