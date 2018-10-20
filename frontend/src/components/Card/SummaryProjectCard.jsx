import React from "react";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Card from "material-kit-react/components/Card/Card";
import CardBody from "material-kit-react/components/Card/CardBody";

import { cardTitle } from "material-kit-react/assets/jss/material-kit-react";

const style = {
    cardTitle,
};

class SummaryProjectCard extends React.Component {
    render() {
        const { projectTitle, projectDescription ,classes } = this.props;
        return (
            <Card style={{width: "20rem"}}>
                <CardBody>
                    <h4 className={classes.cardTitle}>{projectTitle}</h4>
                    <p>{projectDescription}</p>
                </CardBody>
            </Card>
        );
    }
}

export default withStyles(style)(SummaryProjectCard);