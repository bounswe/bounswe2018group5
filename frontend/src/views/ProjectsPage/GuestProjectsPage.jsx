import React from "react";
import Helmet from "react-helmet";
import classNames from "classnames";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons

import HeaderLinks from "components/Header/HeaderLinks";
import Footer from "components/Footer/Footer";
import Parallax from "material-kit-react/components/Parallax/Parallax";
import Header from "components/Header/Header";

// core components
import ProjectCard from "components/Card/ProjectCard";
import GridItem from "material-dashboard-react/dist/components/Grid/GridItem";
import GridContainer from "material-dashboard-react/dist/components/Grid/GridContainer";

import landingPageStyle from "material-kit-react/assets/jss/material-kit-react/views/landingPage.js";
import loginPageStyle from "material-kit-react/assets/jss/material-kit-react/views/loginPage";

import connect from "react-redux/es/connect/connect";
import combineStyles from "services/combineStyles";
import { tryGetProjects, getProjectsReset } from "redux/project/Actions.js";

const dashboardRoutes = [];

class GuestProjectsPage extends React.Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            projects: [],
        };
    }

    componentDidMount() {
        this.props.tryGetProjects();
    }

    componentDidUpdate(prevProps, prevState) {
        const { getProjectsInProgress, getProjectsHasError, getProjectsCompleted, projects } = this.props.project;

        if (!getProjectsInProgress && !getProjectsHasError && getProjectsCompleted) {
            this.setState({ projects: projects });
            this.props.getProjectsReset();
        }
    }

    handleToUpdate(project) {
        var { projects } = this.state;
        projects.push(project);
        this.setState({
            projects: projects,
        });
    }

    render() {
        const { projects } = this.state;
        const { classes, ...rest } = this.props;

        var project_grid = (
            <GridContainer>
                {projects.map((prop, key) => {
                    return (
                        <GridItem xs={12} sm={12} md={4} key={key}>
                            <ProjectCard
                                title={prop.title}
                                description={prop.description}
                                budget={prop.budget}
                                project_deadline={prop.deadline}
                                created_at={prop.created_at}
                                owner={prop.owner}
                                owner_id={prop.owner_id}
                                project_id={prop.project_id}
                                milestones={prop.milestones}
                                tags={prop.tags}
                                link={"/browse/" + prop.project_id + "/"}
                            />
                        </GridItem>
                    );
                })}
            </GridContainer>
        );
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
                <Parallax filter small image={require("assets/img/landing-bg.jpg")}>
                    <div className={classes.container}>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={6}>
                                <h1 className={classes.title}>Browse Projects</h1>
                            </GridItem>
                        </GridContainer>
                    </div>
                </Parallax>
                <div className={classNames(classes.main, classes.mainRaised)}>
                    <div className={classes.container} style={{
                        padding: "64px"
                    }}>
                        {project_grid}
                    </div>
                </div>
                <Footer />
            </div>
        )
            ;
    }
}

function bindAction(dispatch) {
    return {
        tryGetProjects: () => dispatch(tryGetProjects()),
        getProjectsReset: () => dispatch(getProjectsReset())
    };
}

const mapStateToProps = state => ({
    project: state.project
});

const combinedStyles = combineStyles(loginPageStyle, landingPageStyle);

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(combinedStyles)(GuestProjectsPage));