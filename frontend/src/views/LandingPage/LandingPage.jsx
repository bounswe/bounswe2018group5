import React, { Component } from "react";
import Button from 'material-kit-react/components/CustomButtons/Button'

import withStyles from "@material-ui/core/styles/withStyles";

import landingPageStyle from "material-kit-react/assets/jss/material-kit-react/views/landingPage.js";

class LandingPage extends Component {
    render() {
        return (
            <div>
                <Button>Try!</Button>
            </div>
        );
    }
}

export default withStyles(landingPageStyle)(LandingPage);