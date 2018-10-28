import React, {Component} from "react";
import Helmet from "react-helmet";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "material-dashboard-react/dist/components/Grid/GridItem";
import GridContainer from "material-dashboard-react/dist/components/Grid/GridContainer";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "material-dashboard-react/dist/components/CustomButtons/Button";
import Card from "material-dashboard-react/dist/components/Card/Card";
import CardHeader from "material-dashboard-react/dist/components/Card/CardHeader";
import CardAvatar from "material-dashboard-react/dist/components/Card/CardAvatar";
import CardBody from "material-dashboard-react/dist/components/Card/CardBody";
import CardFooter from "material-dashboard-react/dist/components/Card/CardFooter";
import { tryGetProfile, profileReset } from "redux/user/Actions.js";

import avatar from "assets/img/faces/christian.jpg";
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

class UserProfile extends Component {

    componentDidMount() {
        this.props.tryGetProfile();
    }

    render() {
        const {classes} = this.props;
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
                                <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                                <p className={classes.cardCategoryWhite}>Complete your profile</p>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={5}>
                                        <CustomInput
                                            labelText="Company (disabled)"
                                            id="company-disabled"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                disabled: true
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={3}>
                                        <CustomInput
                                            labelText="Username"
                                            id="username"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <CustomInput
                                            labelText="Email address"
                                            id="email-address"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="First Name"
                                            id="first-name"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="Last Name"
                                            id="last-name"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <CustomInput
                                            labelText="City"
                                            id="city"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <CustomInput
                                            labelText="Country"
                                            id="country"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <CustomInput
                                            labelText="Postal Code"
                                            id="postal-code"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <InputLabel style={{color: "#AAAAAA"}}>About me</InputLabel>
                                        <CustomInput
                                            labelText="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                                            id="about-me"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                multiline: true,
                                                rows: 5
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                            <CardFooter>
                                <Button color="primary">Update Profile</Button>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                        <Card profile>
                            <CardAvatar profile>
                                <a href="#pablo" onClick={e => e.preventDefault()}>
                                    <img src={avatar} alt="..."/>
                                </a>
                            </CardAvatar>
                            <CardBody profile>
                                <h6 className={classes.cardCategory}>CEO / CO-FOUNDER</h6>
                                <h4 className={classes.cardTitle}>Alec Thompson</h4>
                                <p className={classes.description}>
                                    Don't be scared of the truth because we need to restart the
                                    human foundation in truth And I love you like Kanye loves Kanye
                                    I love Rick Owens’ bed design but the back is...
                                </p>
                                <Button color="primary" round>
                                    Follow
                                </Button>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

function bindAction(dispatch) {
    return {
        tryGetProfile: () => dispatch(tryGetProfile()),
        profileReset: () => dispatch(profileReset())
    };
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(styles)(UserProfile));