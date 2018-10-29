import React from "react";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Card from "material-kit-react/components/Card/Card";
import CardBody from "material-kit-react/components/Card/CardBody";
import CardFooter from "material-kit-react/components/Card/CardFooter";

import imagesStyles from "material-kit-react/assets/jss/material-kit-react/imagesStyles";

import { cardTitle } from "material-kit-react/assets/jss/material-kit-react";

const style = {
    ...imagesStyles,
    cardTitle,
    textMuted: {
        color: "#6c757d"
    },
};

class ProjectCard extends React.Component {
    render() {
        const { classes, title, description, project_deadline, budget, created_at } = this.props;
        return (
            <Card style={{width: "100%"}}>
                <CardBody>
                    <h4 className={classes.cardTitle}>{title}</h4>
                    <p>{description}</p>
                    <p align="right"><b>Budget: </b> {budget}$<br /> <b>Deadline: </b> {project_deadline}<br /><b>Created At:</b> {created_at}</p>
                </CardBody>
                <CardFooter className={classes.textMuted}>tags</CardFooter>
            </Card>
        );
    }
}

export default withStyles(style)(ProjectCard);