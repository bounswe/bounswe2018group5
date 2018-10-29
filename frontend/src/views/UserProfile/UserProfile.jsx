import React, {Component} from "react";
import Helmet from "react-helmet";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AddAlert from "@material-ui/icons/AddAlert";
import {Select, MenuItem, FormControl, InputLabel, FilledInput} from '@material-ui/core';
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
import Snackbar from "material-dashboard-react/dist/components/Snackbar/Snackbar";
import {
    tryGetProfile,
    profileReset,
    tryChangePassword,
    changePasswordReset,
    tryUpdateProfile,
    updateProfileReset
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

class UserProfile extends Component {
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
        };
    }

    handleChangePassword(event) {
        const {password, password_confirmation} = this.state;
        this.props.tryChangePassword(password);
        this.setState({updatePassword: true});
        event.preventDefault();
    }

    handleUpdateProfile(event) {
        const {full_name, bio, gender, type} = this.state;
        this.props.tryUpdateProfile(full_name, gender, bio, type);
        this.setState({updateProfile: true});
        event.preventDefault();
    }

    componentDidMount() {
        this.props.tryGetProfile();
    }

    componentDidUpdate(prevProps, prevState) {
        const {getProfileInProgress, getProfileHasError, getProfileCompleted, user} = this.props.user;

        if (!getProfileInProgress && !getProfileHasError && getProfileCompleted) {
            this.setState({user: user, full_name: user.full_name, bio: user.bio, gender: user.gender, type: user.type});
            this.props.profileReset();
        }

        const {changePasswordInProgress, changePasswordHasError, changePasswordCompleted, response} = this.props.user;

        if (this.state.updatePassword && !changePasswordInProgress && !changePasswordHasError && changePasswordCompleted) {
            if (response) {
                this.setState({
                    open: true,
                    color: 'success',
                    notificationMessage: 'Your Password is successfully changed!'
                });
                setTimeout(function () {
                    this.setState({open: false});
                }.bind(this), 6000);
            } else {
                this.setState({
                    open: true,
                    color: 'danger',
                    notificationMessage: 'Your Password is not changed!'
                });
                setTimeout(function () {
                    this.setState({open: false});
                }.bind(this), 6000);
            }
            this.setState({updatePassword: false});
            this.props.changePasswordReset();
        }

        const {updateProfileInProgress, updateProfileHasError, updateProfileCompleted} = this.props.user;

        if (this.state.updateProfile && !updateProfileInProgress && !updateProfileHasError && updateProfileCompleted) {
            if (response) {
                this.setState({
                    open: true,
                    color: 'success',
                    notificationMessage: 'Your Profile is successfully changed!'
                });
                setTimeout(function () {
                    this.setState({open: false});
                }.bind(this), 6000);
            } else {
                this.setState({
                    open: true,
                    color: 'danger',
                    notificationMessage: 'Your Profile is not changed!'
                });
                setTimeout(function () {
                    this.setState({open: false});
                }.bind(this), 6000);
            }
            this.setState({updateProfile: false});
            this.props.updateProfileReset();
        }
    }

    render() {
        const {classes} = this.props;
        const user = this.state.user;
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
                    <GridItem xs={12} sm={12} md={4}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                                <p className={classes.cardCategoryWhite}>Complete your profile</p>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <CustomInput
                                            labelText="Full Name"
                                            id="full_name"
                                            autoFocus
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event => this.setState({full_name: event.target.value}),
                                                value: this.state.full_name,
                                                autoFocus: !!this.state.full_name
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <FormControl fullWidth={true} variant="filled" className={classes.formControl}>
                                            <InputLabel htmlFor="outlined-age-simple">Gender</InputLabel>
                                            <Select
                                                value={this.state.gender ? this.state.gender : -2}
                                                onChange={event => this.setState({gender: event.target.value})}
                                                input={
                                                    <FilledInput name="gender"/>
                                                }
                                            >
                                                <MenuItem value={-1}>Male</MenuItem>
                                                <MenuItem value={0}>Other</MenuItem>
                                                <MenuItem value={1}>Female</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <FormControl fullWidth={true} variant="filled" className={classes.formControl}>
                                            <InputLabel htmlFor="outlined-age-simple">User Type</InputLabel>
                                            <Select
                                                value={this.state.type ? this.state.type : -1}
                                                onChange={event => this.setState({type: event.target.value})}
                                                input={
                                                    <FilledInput name="type"/>
                                                }
                                            >
                                                <MenuItem value={1}>Client</MenuItem>
                                                <MenuItem value={0}>Freelancer</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput
                                            labelText="Biography"
                                            id="bio"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                multiline: true,
                                                rows: 3,
                                                onChange: event => this.setState({bio: event.target.value}),
                                                value: this.state.bio
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                            <CardFooter>
                                <Button color="primary" onClick={event => this.handleUpdateProfile(event)}>Update
                                    Profile</Button>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Edit Password</h4>
                                <p className={classes.cardCategoryWhite}>Change your password</p>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput
                                            labelText="Password"
                                            id="password"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: "password",
                                                onChange: event => this.setState({password: event.target.value})
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput
                                            labelText="Password Confirmation"
                                            id="pass_conf"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: "password",
                                                onChange: event => this.setState({password_confirmation: event.target.value})
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </CardBody>
                            <CardFooter>
                                <Button color="primary" onClick={event => this.handleChangePassword(event)}>
                                    Update Password
                                </Button>
                            </CardFooter>
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
        tryGetProfile: () => dispatch(tryGetProfile()),
        profileReset: () => dispatch(profileReset()),
        tryChangePassword: (password) => dispatch(tryChangePassword(password)),
        changePasswordReset: () => dispatch(changePasswordReset()),
        tryUpdateProfile: (full_name, gender, bio, type) => dispatch(tryUpdateProfile(full_name, gender, bio, type)),
        updateProfileReset: () => dispatch(updateProfileReset())
    };
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(styles)(UserProfile));