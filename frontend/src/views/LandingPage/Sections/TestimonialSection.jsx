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
                        <GridItem xs={12} sm={12} md={4}>
                            <TestimonialCard
                                imageSrc={testimonial1}
                                testimonialName="John Doe"
                                testimonialOccupation="Model"
                                description="You can write here details about one of your team members.
                                            You can give more details about what they do. Feel free to
                                            add some <a href='#pablo'>links</a> for people to be able to
                                            follow them outside the site."
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                            <TestimonialCard
                                imageSrc={testimonial1}
                                testimonialName="John Doe"
                                testimonialOccupation="Model"
                                description="You can write here details about one of your team members.
                                            You can give more details about what they do. Feel free to
                                            add some <a href='#pablo'>links</a> for people to be able to
                                            follow them outside the site."
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                            <TestimonialCard
                                imageSrc={testimonial1}
                                testimonialName="John Doe"
                                testimonialOccupation="Model"
                                description="You can write here details about one of your team members.
                                            You can give more details about what they do. Feel free to
                                            add some <a href='#pablo'>links</a> for people to be able to
                                            follow them outside the site."
                            />
                        </GridItem>
                    </GridContainer>
                </div>
            </div>
        );
    }
}

export default withStyles(testimonialStyle)(TestimonialSection);