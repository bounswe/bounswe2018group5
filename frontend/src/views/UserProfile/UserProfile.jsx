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
    updateProfileReset,
    tryPutWallet,
    putWalletReset
} from "redux/user/Actions.js";

import default_image from "assets/img/faces/default_image.png";
import connect from "react-redux/es/connect/connect";
import combineStyles from "services/combineStyles";

import LinkedIn from 'services/LinkedIn'

import modalStyle from "material-kit-react/assets/jss/material-kit-react/modalStyle";


// Import React FilePond
import { FilePond, registerPlugin, File } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import { getCookie, TOKEN_COOKIE } from "services/cookies.js";

// We register the plugins required to do 
// image previews, cropping, resizing, etc.
registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
);


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
            depositModal: false,
            withdraw: 0,
            deposit_amount: 0,
            withdraw_amount: 0,
            currentPosition: null
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
        this.props.tryPutWallet(0, parseFloat(withdraw_amount));
        event.preventDefault();
    }

    handleDepositMoney(event) {
        const { deposit_amount } = this.state;
        this.props.tryPutWallet(parseFloat(deposit_amount), 0);
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
                portfolios: user.portfolios,
                balance: user.wallet.balance || 0
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

        const { putWalletInProgress, putWalletHasError, putWalletCompleted, wallet } = this.props.user;

        if (!putWalletInProgress && !putWalletHasError && putWalletCompleted) {
            let type;
            if (this.state.deposit_amount !== 0) {
                type = 'deposit';
            } else if (this.state.withdraw_amount !== 0) {
                type = 'withdraw';
            } else {
                type = '';
            }
            if (response) {
                this.setState({
                    balance: wallet.balance,
                    open: true,
                    color: 'success',
                    notificationMessage: type + ' is successful!'
                });
                setTimeout(function () {
                    this.setState({ open: false });
                }.bind(this), 6000);
            } else {
                this.setState({
                    open: true,
                    color: 'danger',
                    notificationMessage: type + ' is not successful!'
                });
                setTimeout(function () {
                    this.setState({ open: false });
                }.bind(this), 6000);
            }
            this.setState({ deposit_amount: 0, withdraw_amount: 0 });
            this.handleClose("withdrawModal");
            this.handleClose("depositModal");
            this.props.putWalletReset();
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

    responseLinkedin(response) {
        console.log(this);
        let currentPosition;
        if (response.positions.values) {
            currentPosition = response.positions.values[0];
            console.log(currentPosition);
            this.setState({ currentPosition });
        }
    }

    handleToLinkedIn() {
        this.setState({
            currentPosition: null,
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
                                attachments={prop.attachments}
                                owned={true}
                                handleToUpdate={this.handleToManagePortfolio.bind(this)}
                            />
                        </GridItem>
                    );
                })}
            </GridContainer>
        );
        let profile_image;
        if (user.profile_image) {
            profile_image = <File key={user.profile_image} src={"media/profile_images/" + user.profile_image} origin="local" />;
        }
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
                                        <Grid item xs={10}>
                                            <h4 className={classes.cardTitleWhite}>{"Portfolio"}</h4>
                                            <p className={classes.cardCategoryWhite}>Fill your portfolio</p>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <AddPortfolioModal 
                                                currentPosition={this.state.currentPosition}
                                                handleToUpdate={this.handleToUpdate.bind(this)}
                                                handleToLinkedIn={this.handleToLinkedIn.bind(this)}/>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <LinkedIn
                                                clientId={process.env.REACT_APP_LINKEDIN_CLIENT}
                                                callBack={this.responseLinkedin.bind(this)}
                                                fields=":(first-name,last-name,public-profile-url,location,headline,picture-url,positions,summary,num-connections)"
                                                className={'className'}
                                                loginButtonText={'Fetch From LinkedIn'}
                                                logoutButtonText={''}
                                                buttonType={'button'}
                                            />
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
                                        <FilePond
                                            className="filepond"
                                            name={"profile_image"}
                                            imagePreviewMaxHeight={50}
                                            imageCropAspectRatio={'1:1'}
                                            imageResizeTargetWidth={200}
                                            imageResizeTargetHeight={200}
                                            stylePanelLayout={'compact circle'}
                                            styleLoadIndicatorPosition={'center bottom'}
                                            styleProgressIndicatorPosition={'right bottom'}
                                            styleButtonRemoveItemPosition={'left bottom'}
                                            styleButtonProcessItemPosition={'right bottom'}
                                            instantUpload={false}
                                            server={{
                                                url: process.env.REACT_APP_API_URL,
                                                process: {
                                                    url: './api/user/profile/upload_image/',
                                                    method: 'POST',
                                                    headers: {
                                                        Authorization: getCookie(TOKEN_COOKIE)
                                                    },
                                                    timeout: 7000,
                                                    onload: null,
                                                    onerror: null
                                                },
                                                load: {
                                                    url: "./"
                                                }
                                            }}

                                            labelIdle={`Drag & Drop your picture or <span class="filepond--label-action">Browse</span>`}
                                            acceptedFileTypes={"image/png, image/jpeg"}
                                        >
                                            {profile_image}
                                        </FilePond>
                                        <img src={default_image} alt="..." />
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
                                            <b>Balance:</b> {this.state.balance}$
                                        </h4>
                                        <Button variant="contained" color="primary" onClick={() => this.handleClickOpen("withdrawModal")}>
                                            Withdraw Money
                                        </Button>

                                        <Button variant="contained" color="success" onClick={() => this.handleClickOpen("depositModal")}>
                                            Deposit Money
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
                    open={this.state.depositModal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => this.handleClose("depositModal")}
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
                            onClick={() => this.handleClose("depositModal")}>
                            <Close className={classes.modalClose} />
                        </IconButton>
                        <h4 className={classes.modalTitle}>Deposit Money</h4>
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
                                                onChange: event => this.setState({ deposit_amount: event.target.value })
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
                            onClick={event => this.handleDepositMoney(event)}
                            color={'primary'}
                        >
                            Deposit
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
        updateProfileReset: () => dispatch(updateProfileReset()),
        tryPutWallet: (deposit, withdraw) => dispatch(tryPutWallet(deposit, withdraw)),
        putWalletReset: () => dispatch(putWalletReset())
    };
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(combinedStyles)(UserProfile));