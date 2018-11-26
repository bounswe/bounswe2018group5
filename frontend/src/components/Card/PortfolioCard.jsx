import React from "react";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
// core components
import Card from "material-kit-react/components/Card/Card";
import CardBody from "material-kit-react/components/Card/CardBody";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardFooter from "material-kit-react/components/Card/CardFooter";
import PortfolioDropdown from "components/DropDown/PortfolioDropdown"

import {Link} from "react-router-dom";

import imagesStyles from "material-kit-react/assets/jss/material-kit-react/imagesStyles";

import {cardTitle} from "material-kit-react/assets/jss/material-kit-react";

const style = {
    ...imagesStyles,
    cardTitle,
    textMuted: {
        color: "#6c757d"
    },
};

class PortfolioCard extends React.Component {
    handleToUpdate(portfolio, type) {
        this.props.handleToUpdate(portfolio, type);
    }
    render() {
        const { classes, portfolio_id, title, description, date, project_id, owned } = this.props;
        const portfolio = {
            portfolio_id,
            title,
            description,
            date,
            project_id,
        };
        let cardHeader;
        if (owned === true) {
            cardHeader = <Grid item xs={3} style={{ textAlign: "right" }}>
                <PortfolioDropdown portfolio_info={portfolio} handleToUpdate={this.handleToUpdate.bind(this)} />
            </Grid>;
        } else {
            cardHeader = '';
        }
        return (
            <Card style={{width: "100%"}}>
                <CardBody>
                    <Grid container>
                        <Grid item xs={9}>
                            <h4 className={classes.cardTitle}>{title}</h4>
                        </Grid>
                        {cardHeader}
                    </Grid>
                    <p>{description}</p>
                </CardBody>
                {/* <CardFooter className={classes.textMuted}>tags</CardFooter> */}
            </Card>
        );
    }
}

export default withStyles(style)(PortfolioCard);