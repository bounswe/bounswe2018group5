import React, {Component} from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import People from "@material-ui/icons/People";
// core components
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Button from "material-kit-react/components/CustomButtons/Button";
import Card from "material-kit-react/components/Card/Card";
import CardBody from "material-kit-react/components/Card/CardBody";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardFooter from "material-kit-react/components/Card/CardFooter";
import CustomInput from "components/CustomInput/CustomInput";
import { tryLogin, loginReset } from "redux/auth/Actions.js";
import {connect} from "react-redux";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "material-dashboard-react/dist/components/Snackbar/Snackbar";

import { setCookie, getCookie, LOGGEDIN_COOKIE, TOKEN_COOKIE } from "services/cookies.js";

import loginPageStyle from "material-kit-react/assets/jss/material-kit-react/views/loginPage";

class LoginForm extends Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            cardAnimaton: "cardHidden",
            username: "",
            password: "",
            open: false,
            place: 'tr',
            notificationMessage: ''
        };
    }

    handleSubmit(event) {
        const { username, password } = this.state;
        this.props.tryLogin(username, password);
        event.preventDefault();
    }

    componentDidMount() {
        const { history } = this.props;

        const loggedIn = getCookie(LOGGEDIN_COOKIE);        
        if (loggedIn === "true") return history.push("/home");
        // we add a hidden class to the card and after 700 ms we delete it and the transition appears
        setTimeout(
            function () {
                this.setState({cardAnimaton: ""});
            }.bind(this),
            700
        );
    }

    componentDidUpdate(prevProps, prevState) {
        const { history } = this.props;
        const { loginInProgress, loginHasError, loginCompleted, api_token, loggedIn, error } = this.props.auth;

        if (loginInProgress && !loginHasError && !loginCompleted) {
        } else if (!loginInProgress && !loginHasError && loginCompleted) {
            if (loggedIn) {
                setCookie(TOKEN_COOKIE, api_token, { path: "/" });
                setCookie(LOGGEDIN_COOKIE, loggedIn, { path: "/" });
                history.push("/home");
            } else {
                this.setState({
                    open: true,
                    color: 'danger',
                    notificationMessage: error
                });
                setTimeout(function () {
                    this.setState({ open: false });
                }.bind(this), 6000);
            }
            this.props.loginReset();
        } else if (!loginInProgress && loginHasError && loginCompleted) {
            this.props.loginReset();
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <div
                    className={classes.pageHeader}
                    style={{
                        backgroundImage: "url(" + require("assets/img/bg7.jpg") + ")",
                        backgroundSize: "cover",
                        backgroundPosition: "top center"
                    }}
                >
                    <div className={classes.container}>
                        <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={6}>
                                <Card className={classes[this.state.cardAnimaton]}>
                                    <form className={classes.form}>
                                        <CardHeader color="primary" className={classes.cardHeader}>
                                            <h4>Login</h4>
                                        </CardHeader>
                                        <CardBody>
                                            <CustomInput
                                                labelText="Username"
                                                id="username"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "text",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <People className={classes.inputIconsColor}/>
                                                        </InputAdornment>
                                                    ),
                                                    onChange: event => this.setState({ username: event.target.value })
                                                }}
                                            />
                                            <CustomInput
                                                labelText="Password"
                                                id="pass"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "password",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Icon className={classes.inputIconsColor}>
                                                                lock_outline
                                                            </Icon>
                                                        </InputAdornment>
                                                    ),
                                                    onChange: event => this.setState({ password: event.target.value })
                                                }}
                                            />
                                        </CardBody>
                                        <CardFooter className={classes.cardFooter}>
                                            <Button simple color="primary" size="lg" onClick={event => this.handleSubmit(event)}>
                                                Login
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </div>
                </div>
                <Snackbar
                    place={this.state.place}
                    icon={AddAlert}
                    color={this.state.color}
                    message={this.state.notificationMessage}
                    open={this.state.open}
                    closeNotification={() => this.setState({ open: false })}
                    close
                />
            </div>
        );
    }
}

function bindAction(dispatch) {
    return {
        tryLogin: (username, password) => dispatch(tryLogin(username, password)),
        loginReset: () => dispatch(loginReset())
    };
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(loginPageStyle)(LoginForm));