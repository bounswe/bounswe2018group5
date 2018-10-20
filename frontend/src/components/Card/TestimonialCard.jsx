import React, {Component} from "react";

import GridItem from "material-kit-react/components/Grid/GridItem";
import CardBody from "material-kit-react/components/Card/CardBody";
import Card from "material-kit-react/components/Card/Card";

import testimonialStyle from "material-kit-react/assets/jss/material-kit-react/views/landingPageSections/teamStyle";
import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";

class TestimonialCard extends Component {
    render() {
        const {
            imageSrc,
            testimonialName,
            testimonialOccupation,
            description,
            classes
        } = this.props;
        const imageClasses = classNames(
            classes.imgRaised,
            classes.imgRoundedCircle,
            classes.imgFluid
        );
        return (
            <Card plain>
                <GridItem xs={12} sm={12} md={6} className={classes.itemGrid} style={{
                    justifySelf: 'center',
                    alignSelf: 'center',
                }}>
                    <img src={imageSrc} alt="..." className={imageClasses}/>
                </GridItem>
                <h4 className={classes.cardTitle}>
                    {testimonialName}
                    <br/>
                    <small className={classes.smallTitle}>{testimonialOccupation}</small>
                </h4>
                <CardBody>
                    <p className={classes.description}>
                        {description}
                    </p>
                </CardBody>
            </Card>
        );
    }
}

export default withStyles(testimonialStyle)(TestimonialCard);