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
import {tryGetProjects, getProjectsReset} from "redux/project/Actions.js";

class HomePage extends React.Component {
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
        const {getProjectsInProgress, getProjectsHasError, getProjectsCompleted, projects} = this.props.project;

        if (!getProjectsInProgress && !getProjectsHasError && getProjectsCompleted) {
            this.setState({projects: projects});
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
        const {projects} = this.state;
        var project_grid = (
            <GridContainer>
                {projects.map((prop, key) => {
                    return (
                        <GridItem xs={12} sm={12} md={4} key={key}>
                            <ProjectCard
                                title={prop.title}
                                description={prop.description}
                                budget={prop.budget}
                                project_deadline={prop.deadline.substring(0, 10)}
                                created_at={prop.created_at.substring(0, 10)}
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
                <AddProjectModal handleToUpdate={this.handleToUpdate.bind(this)} />
                {project_grid}
            </div>
        );
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

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(homePageStyle)(HomePage));