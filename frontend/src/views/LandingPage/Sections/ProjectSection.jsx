import React, {Component} from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";

import statStyle from "material-kit-react/assets/jss/material-kit-react/views/landingPageSections/productStyle";
import SummaryProjectCard from "../../../components/Card/SummaryProjectCard";

class ProjectSection extends Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.section}>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={8}>
                        <h2 className={classes.title}>Popular Projects</h2>
                        <h5 className={classes.description}>
                        </h5>
                    </GridItem>
                </GridContainer>
                <div>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={4} style={{
                            justifySelf: 'center',
                            alignSelf: 'center',
                        }}>
                            <SummaryProjectCard
                                projectTitle="Snapchat Clone"
                                projectDescription="I want to marry a Victoria's Secret model so I new a snapchat clone app asap."
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} style={{
                            justifySelf: 'center',
                            alignSelf: 'center',
                        }}>
                            <SummaryProjectCard
                                projectTitle="Tinder but with videos"
                                projectDescription="Seriously how come nobody every thought of this? I'm tired of uploading my videos to youtube"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4} style={{
                            justifySelf: 'center',
                            alignSelf: 'center',
                        }}>
                            <SummaryProjectCard
                                projectTitle="Instagram but only food pics"
                                projectDescription="According to my machine learning model, nobody ever uses instagram for anything else besides the food pics so lets get rich"
                            />
                        </GridItem>
                    </GridContainer>
                </div>
            </div>
        );
    }
}

export default withStyles(statStyle)(ProjectSection);