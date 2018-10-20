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

class StatCard extends React.Component {
    render() {
        const { statTitle, stat ,classes } = this.props;
        return (
            <Card style={{width: "20rem"}}>
                <CardBody>
                    <h3 className={classes.cardTitle}>{statTitle}</h3>
                    <p>{stat}</p>
                </CardBody>
            </Card>
        );
    }
}

export default withStyles(style)(StatCard);