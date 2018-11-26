import React, {Component} from "react";
import Helmet from "react-helmet";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import PortfolioCard from "components/Card/PortfolioCard";
import Grid from '@material-ui/core/Grid';
import GridItem from "material-dashboard-react/dist/components/Grid/GridItem";
import GridContainer from "material-dashboard-react/dist/components/Grid/GridContainer";
import Card from "material-dashboard-react/dist/components/Card/Card";
import CardHeader from "material-dashboard-react/dist/components/Card/CardHeader";
import CardAvatar from "material-dashboard-react/dist/components/Card/CardAvatar";
import CardBody from "material-dashboard-react/dist/components/Card/CardBody";
import Snackbar from "material-dashboard-react/dist/components/Snackbar/Snackbar";
import {
    tryGetUserProfile,
    userProfileReset
} from "redux/user/Actions.js";

import default_image from "assets/img/faces/default_image.png";
import connect from "react-redux/es/connect/connect";

const styles = {
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    }
};

class OtherUserProfile extends Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            cardAnimaton: "cardHidden",
            user: {},
            open: false,
            place: 'tr',
            notificationMessage: '',
            updateProfile: false,
            updatePassword: false,
            gender: -2,
            type: -1,
            portfolios: []
        };
    }

    componentDidMount() {
        const { user_id } = this.props.match.params;
        this.props.tryGetUserProfile(user_id);
    }

    componentDidUpdate(prevProps, prevState) {
        const { getUserProfileInProgress, getUserProfileHasError, getUserProfileCompleted, user} = this.props.user;

        if (!getUserProfileInProgress && !getUserProfileHasError && getUserProfileCompleted) {
            this.setState({
                user: user, 
                full_name: user.full_name, 
                bio: user.bio, 
                gender: user.gender, 
                type: user.type,
                portfolios: user.portfolios
            });
            this.props.userProfileReset();
        }
    }

    render() {
        const {classes} = this.props;
        const { user, portfolios } = this.state;
        var porfolio_grid = (
            <GridContainer>
                {portfolios.map((prop, key) => {
                    return (
                        <GridItem xs={12} sm={12} md={12} key={key}>
                            <PortfolioCard
                                portfolio_id={prop.id}
                                title={prop.title}
                                description={prop.description}
                                date={prop.date}
                                project_id={prop.project_id}
                            />
                        </GridItem>
                    );
                })}
            </GridContainer>
        );
        return (
            <div>
                <div>
                    <Helmet
                        title='Profile Page'
                        meta={[
                            {property: 'og:title', content: 'Profile Page'},
                        ]}/>
                </div>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                        <Card>
                            <CardHeader color="primary">
                                <Grid container>
                                    <Grid item xs={11}>
                                        <h4 className={classes.cardTitleWhite}>{"Portfolio"}</h4>
                                        <p className={classes.cardCategoryWhite}>Fill your portfolio</p>
                                    </Grid>
                                </Grid>
                            </CardHeader>
                            <CardBody>
                                {porfolio_grid}
                            </CardBody>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                        <Card profile>
                            <CardAvatar profile>
                                <img src={process.env.REACT_APP_API_STATIC_URL + "profile_images/" + user.profile_image}
                                     onError={(e) => {
                                         e.target.onerror = null;
                                         e.target.src = default_image
                                     }} alt="..."/>
                            </CardAvatar>
                            <CardBody profile>
                                <h6 className={classes.cardCategory}>
                                    {typeof user.type === "undefined" || user.type === null ? "User Type Not Set" : user.type ? "Client" : "Freelancer"}
                                </h6>
                                <h4 className={classes.cardTitle}>
                                    {user.full_name ? user.full_name : ""}
                                    <br/>
                                    {user.email ? user.email : ""}
                                </h4>
                                <p className={classes.description}>
                                    {user.bio ? user.bio : ""}
                                </p>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
                <Snackbar
                    place={this.state.place}
                    icon={AddAlert}
                    color={this.state.color}
                    message={this.state.notificationMessage}
                    open={this.state.open}
                    closeNotification={() => this.setState({open: false})}
                    close
                />
            </div>
        );
    }
}

function bindAction(dispatch) {
    return {
        tryGetUserProfile: (user_id) => dispatch(tryGetUserProfile(user_id)),
        userProfileReset: () => dispatch(userProfileReset()),
    };
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(styles)(OtherUserProfile));