import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import GridContainer from "material-dashboard-react/dist/components/Grid/GridContainer";
import GridItem from "material-dashboard-react/dist/components/Grid/GridItem";

import headerLinksStyle from "material-dashboard-react/dist/assets/jss/material-dashboard-react/components/headerLinksStyle";

class HeaderLinks extends React.Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            query: ""
        };
    }

    searchProjects = (e) => {
        const { history } = this.props;
        const { query } = this.state;
        if (query !== "") {
            history.push("/home/index/" + query);
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div style={{
                position: "fixed",
                right: "64px",
            }}>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={10}>
                        <Input 
                            placeholder={"Search Projects"}
                            onChange={event => this.setState({query: event.target.value })}
                    />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={2}>
                        <Button variant="contained" mini size="small" color="primary" onClick={this.searchProjects}>
                            <SearchIcon className={classes.rightIcon} />
                        </Button>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
