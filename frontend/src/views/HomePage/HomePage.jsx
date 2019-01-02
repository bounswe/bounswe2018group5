import React from "react";
import Helmet from "react-helmet";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons

// core components
import ProjectCard from "components/Card/ProjectCard";
import AddProjectModal from 'components/Modal/AddProjectModal.jsx';
import GridItem from "material-dashboard-react/dist/components/Grid/GridItem";
import GridContainer from "material-dashboard-react/dist/components/Grid/GridContainer";


import homePageStyle from "material-dashboard-react/dist/assets/jss/material-dashboard-react/views/dashboardStyle";
import connect from "react-redux/es/connect/connect";
import { tryGetProjects, getProjectsReset, tryGetRecommendedProjects, getRecommendedProjectsReset} from "redux/project/Actions.js";

import { getCookie, LOGGEDIN_USERID_COOKIE } from "services/cookies";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            projects: [],
            recom_projects: []
        };
    }

    componentDidMount() {
        this.props.tryGetProjects();
        const user_id = getCookie(LOGGEDIN_USERID_COOKIE);
        this.props.tryGetRecommendedProjects(user_id);
    }

    componentDidUpdate(prevProps, prevState) {
        const {getProjectsInProgress, getProjectsHasError, getProjectsCompleted, projects} = this.props.project;

        if (!getProjectsInProgress && !getProjectsHasError && getProjectsCompleted) {
            this.setState({projects: projects});
            this.props.getProjectsReset();
        }

        const { getRecommendedProjectsInProgress, getRecommendedProjectsHasError, getRecommendedProjectsCompleted, recom_projects, response} = this.props.project;

        if (!getRecommendedProjectsInProgress && !getRecommendedProjectsHasError && getRecommendedProjectsCompleted) {
            if(response) {
                this.setState({ recom_projects: recom_projects });
                this.props.getRecommendedProjectsReset();
            }
        }
    }

    handleToUpdate(project) {
        var {projects} = this.state;
        projects.push(project);
        this.setState({
            projects: projects,
        });
    }

    render() {
        const { projects, recom_projects } = this.state;
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
                            />
                        </GridItem>
                    );
                })}
            </GridContainer>
        );

        var recom_project_grid = (
            <GridContainer>
                {recom_projects.map((prop, key) => {
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
                        {property: 'og:title', content: 'Home Page'},
                    ]}/>
                <div style={{
                    position: "fixed",
                    bottom: "32px",
                    right: "32px",
                    zIndex: "200"
                }}>
                    <AddProjectModal handleToUpdate={this.handleToUpdate.bind(this)}/>
                </div>
                <h1>Recommended Projects</h1>
                {recom_projects.length > 0 ? recom_project_grid : 'Fill your portfolio and show recommended projects' }
                <h1>All Projects</h1>
                {project_grid}
            </div>
        )
            ;
    }
}

function bindAction(dispatch) {
    return {
        tryGetProjects: () => dispatch(tryGetProjects()),
        getProjectsReset: () => dispatch(getProjectsReset()),
        tryGetRecommendedProjects: (user_id) => dispatch(tryGetRecommendedProjects(user_id)),
        getRecommendedProjectsReset: () => dispatch(getRecommendedProjectsReset())
    };
}

const mapStateToProps = state => ({
    project: state.project
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(homePageStyle)(HomePage));