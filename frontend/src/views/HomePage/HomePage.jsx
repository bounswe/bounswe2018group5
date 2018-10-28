import React from "react";
import Helmet from "react-helmet";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons

// core components
import AddProjectModal from 'components/Modal/AddProjectModal.jsx';

import homePageStyle from "material-dashboard-react/dist/assets/jss/material-dashboard-react/views/dashboardStyle";

class HomePage extends React.Component {
    render() {
        return (
            <div>
                <Helmet
                    title='Home Page'
                    meta={[
                        {property: 'og:title', content: 'Home Page'},
                    ]} />
                <AddProjectModal />
            </div>
        );
    }
}

export default withStyles(homePageStyle)(HomePage);