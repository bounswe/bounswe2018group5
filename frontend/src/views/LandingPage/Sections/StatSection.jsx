import React, {Component} from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";

import statStyle from "material-kit-react/assets/jss/material-kit-react/views/landingPageSections/productStyle";
import StatCard from "components/Card/StatCard";

class StatSection extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.section}>
                <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={8}>
                        <h2 className={classes.title}>Current Statistics</h2>
                        <h5 className={classes.description}>
                        </h5>
                    </GridItem>
                </GridContainer>
                <div>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={4}>
                            <StatCard
                                statTitle="Projects Completed"
                                stat="1247"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                            <StatCard
                                statTitle="Clients"
                                stat="2156"
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={4}>
                            <StatCard
                                statTitle="Freelancers"
                                stat="3592"
                            />
                        </GridItem>
                    </GridContainer>
                </div>
            </div>
        );
    }
}

export default withStyles(statStyle)(StatSection);