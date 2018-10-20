import React, {Component} from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import TestimonialCard from "../../../components/Card/TestimonialCard";

import testimonialStyle from "material-kit-react/assets/jss/material-kit-react/views/landingPageSections/teamStyle";

import testimonial1 from "../../../assets/img/faces/christian.jpg"

class TestimonialSection extends Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.section}>
                <h2 className={classes.title}>Here is our testimonials</h2>
                <div>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                            <TestimonialCard
                                imageSrc={testimonial1}
                                testimonialName="Elon Musk"
                                testimonialOccupation="CEO"
                                description="I found a project that suited my skills in less than 10 minutes. This is insane"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <TestimonialCard
                                imageSrc={testimonial1}
                                testimonialName="Mark Zuckerberg"
                                testimonialOccupation="CEO"
                                description="I found a developer for my dreams, now I'm a unicorn CEO!"
                            />
                        </GridItem>
                    </GridContainer>
                </div>
            </div>
        );
    }
}

export default withStyles(testimonialStyle)(TestimonialSection);