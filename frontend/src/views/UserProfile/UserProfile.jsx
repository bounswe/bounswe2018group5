import React, {Component} from "react";
import Helmet from "react-helmet";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AddAlert from "@material-ui/icons/AddAlert";
import {Select, MenuItem, FormControl, InputLabel, FilledInput} from '@material-ui/core';
// core components
import PortfolioCard from "components/Card/PortfolioCard";
import Grid from '@material-ui/core/Grid';
import AddPortfolioModal from 'components/Modal/AddPortfolioModal.jsx';
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
import OtherButton from "material-kit-react/components/CustomButtons/Button";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import { Close } from '@material-ui/icons';
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
import combineStyles from "services/combineStyles";

import modalStyle from "material-kit-react/assets/jss/material-kit-react/modalStyle";

const styles = {
    textCenter: {
        textAlign: "center"
    },
    textMuted: {
        color: "#6c757d"
    },
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

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

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
            gender: -2,
            type: -1,
            portfolios: [],
            withdrawModal: false,
            addMoneyModal: false
        };
    }

    handleClickOpen(modal) {
        var x = [];
        x[modal] = true;
        this.setState(x);
    }

    handleClose(modal) {
        var x = [];
        x[modal] = false;
        this.setState(x);
    }

    handleToUpdate(portfolio) {
        var { portfolios } = this.state;
        portfolios.push(portfolio);
        this.setState({
            portfolios: portfolios,
        });
    }

    handleWithdrawMoney(event) {
        const { withdraw_amount } = this.state;
        
        event.preventDefault();
    }

    handleAddMoney(event) {
        const { add_amount } = this.state;
        
        event.preventDefault();
    }

    handleChangePassword(event) {
        const {password} = this.state;
        this.props.tryChangePassword(password);
        this.setState({updatePassword: true});
        event.preventDefault();
    }

    handleUpdateProfile(event) {
        let {full_name, bio, gender, type} = this.state;
        gender = gender === -2 ? null : gender;
        type = type === -1 ? null : type;
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
            this.setState({
                user: user, 
                full_name: user.full_name, 
                bio: user.bio, 
                gender: user.gender === null ? -2 : user.gender, 
                type: user.type === null ? -1 : user.type,
                portfolios: user.portfolios
            });
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
                const user = {
                    ...this.state.user,
                    full_name: this.state.full_name,
                    bio: this.state.bio,
                    type: this.state.type
                }
                this.setState({
                    user: user,
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

    handleToManagePortfolio(portfolio, type) {
        var { portfolios } = this.state;
        let new_portfolios;
        if (type === 'edit') {
            new_portfolios = portfolios.map((prop, key) => {
                return portfolio.id === prop.id ? portfolio : prop;
            })
        } else if (type === 'delete') {
            new_portfolios = portfolios.filter(function (elem, index, portfolios) {
                return portfolio.id !== elem.id ;
            });
        }
        this.setState({
            portfolios: new_portfolios,
        });
    }

    render() {
        const {classes} = this.props;
        const {user, portfolios} = this.state;
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
                                owned={true}
                                handleToUpdate={this.handleToManagePortfolio.bind(this)}
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
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <Card>
                                <CardHeader color="primary">
                                    <Grid container>
                                        <Grid item xs={11}>
                                            <h4 className={classes.cardTitleWhite}>{"Portfolio"}</h4>
                                            <p className={classes.cardCategoryWhite}>Fill your portfolio</p>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <AddPortfolioModal handleToUpdate={this.handleToUpdate.bind(this)}/>
                                        </Grid>
                                    </Grid>
                                    </CardHeader>
                                    <CardBody>
                                        {porfolio_grid}
                                    </CardBody>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>

                                <Card profile>
                                    <CardAvatar profile>
                                        <img src={process.env.REACT_APP_API_STATIC_URL + "profile_images/" + user.profile_image}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = default_image
                                            }} alt="..." />
                                    </CardAvatar>
                                    <CardBody profile>
                                        <h6 className={classes.cardCategory}>
                                            {typeof user.type === "undefined" || user.type === null ? "User Type Not Set" : user.type ? "Client" : "Freelancer"}
                                        </h6>
                                        <h4 className={classes.cardTitle}>
                                            {user.full_name ? user.full_name : ""}
                                            <br />
                                            {user.email ? user.email : ""}
                                        </h4>
                                        <p className={classes.description}>
                                            {user.bio ? user.bio : ""}
                                        </p>
                                    </CardBody>
                                </Card>
                            </GridItem>

                            <GridItem xs={12} sm={12} md={12}>
                                <Card className={classes.textCenter}>
                                    <CardBody>
                                        <h3 className={classes.cardTitle}>Wallet</h3>
                                        <h4 className={classes.cardTitle}>
                                            <b>Balance:</b> {34}$
                                        </h4>
                                        <Button variant="contained" color="primary" onClick={() => this.handleClickOpen("withdrawModal")}>
                                            Withdraw Money
                                        </Button>

                                        <Button variant="contained" color="success" onClick={() => this.handleClickOpen("addMoneyModal")}>
                                            Add Money
                                        </Button>
                                    </CardBody>
                                </Card>
                            </GridItem>

                            <GridItem xs={12} sm={12} md={12}>
                                <Card>
                                    <CardHeader color="primary">
                                        <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                                        <p className={classes.cardCategoryWhite}>Complete your profile</p>
                                    </CardHeader>
                                    <CardBody>
                                        <GridContainer>
                                            <GridItem xs={12} sm={12} md={6}>
                                                <CustomInput
                                                    labelText="Full Name"
                                                    id="full_name"
                                                    autoFocus
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        onChange: event => this.setState({ full_name: event.target.value }),
                                                        value: this.state.full_name ? this.state.full_name : "",
                                                    }}
                                                />
                                            </GridItem>
                                        </GridContainer>
                                        <GridContainer>
                                            <GridItem xs={12} sm={12} md={6}>
                                                <FormControl fullWidth={true} variant="filled" className={classes.formControl}>
                                                    <InputLabel htmlFor="outlined-age-simple">Gender</InputLabel>
                                                    <Select
                                                        value={this.state.gender}
                                                        onChange={event => this.setState({ gender: event.target.value })}
                                                        input={
                                                            <FilledInput name="gender" />
                                                        }
                                                    >
                                                        <MenuItem value={-1}>Male</MenuItem>
                                                        <MenuItem value={0}>Other</MenuItem>
                                                        <MenuItem value={1}>Female</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </GridItem>
                                            <GridItem xs={12} sm={12} md={6}>
                                                <FormControl fullWidth={true} variant="filled" className={classes.formControl}>
                                                    <InputLabel htmlFor="outlined-age-simple">User Type</InputLabel>
                                                    <Select
                                                        value={this.state.type}
                                                        onChange={event => this.setState({ type: event.target.value })}
                                                        input={
                                                            <FilledInput name="type" />
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
                                                        onChange: event => this.setState({ bio: event.target.value }),
                                                        value: this.state.bio ? this.state.bio : "",
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
                            <GridItem xs={12} sm={12} md={12}>
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
                                                        onChange: event => this.setState({ password: event.target.value })
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
                                                        onChange: event => this.setState({ password_confirmation: event.target.value })
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
                            </GridContainer>
                        </GridItem>
                    </GridContainer>

                <Dialog
                    scroll="body"
                    classes={{
                        root: classes.center,
                        paper: classes.modal
                    }}
                    open={this.state.withdrawModal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => this.handleClose("withdrawModal")}
                    aria-labelledby="modal-slide-title"
                    aria-describedby="modal-slide-description">
                    <DialogTitle
                        id="classic-modal-slide-title"
                        disableTypography
                        className={classes.modalHeader}>
                        <IconButton
                            className={classes.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => this.handleClose("withdrawModal")}>
                            <Close className={classes.modalClose} />
                        </IconButton>
                        <h4 className={classes.modalTitle}>Withdraw Money</h4>
                    </DialogTitle>
                    <DialogContent
                        id="modal-slide-description"
                        className={classes.modalBody}>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput
                                            labelText="Amount"
                                            id="amount"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: 'number',
                                                onChange: event => this.setState({withdraw_amount: event.target.value})
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </DialogContent>
                    <DialogActions
                        className={classes.modalFooter + " " + classes.modalFooterCenter}>
                        <OtherButton
                            onClick={event => this.handleWithdrawMoney(event)}
                            color={'primary'}
                        >
                            Withdraw
                        </OtherButton>
                    </DialogActions>
                </Dialog>
                
                <Dialog
                    scroll="body"
                    classes={{
                        root: classes.center,
                        paper: classes.modal
                    }}
                    open={this.state.addMoneyModal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => this.handleClose("addMoneyModal")}
                    aria-labelledby="modal-slide-title"
                    aria-describedby="modal-slide-description">
                    <DialogTitle
                        id="classic-modal-slide-title"
                        disableTypography
                        className={classes.modalHeader}>
                        <IconButton
                            className={classes.modalCloseButton}
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={() => this.handleClose("addMoneyModal")}>
                            <Close className={classes.modalClose} />
                        </IconButton>
                        <h4 className={classes.modalTitle}>Add Money</h4>
                    </DialogTitle>
                    <DialogContent
                        id="modal-slide-description"
                        className={classes.modalBody}>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput
                                            labelText="Amount"
                                            id="amount"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: 'number',
                                                onChange: event => this.setState({ add_amount: event.target.value })
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </DialogContent>
                    <DialogActions
                        className={classes.modalFooter + " " + classes.modalFooterCenter}>
                        <OtherButton
                            onClick={event => this.handleAddMoney(event)}
                            color={'primary'}
                        >
                            Add
                        </OtherButton>
                    </DialogActions>
                </Dialog>


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

const combinedStyles = combineStyles(styles, modalStyle);

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
)(withStyles(combinedStyles)(UserProfile));