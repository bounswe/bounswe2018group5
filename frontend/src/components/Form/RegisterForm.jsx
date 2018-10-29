import React, {Component} from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
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
import { tryRegister, registerReset } from "redux/auth/Actions.js";
import {connect} from "react-redux";

import { setCookie, LOGGEDIN_COOKIE, TOKEN_COOKIE } from "services/cookies.js";

import registerFormStyle from "material-kit-react/assets/jss/material-kit-react/views/loginPage";

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            cardAnimaton: "cardHidden",
            full_name: "",
            username: "",
            email: "",
            password: "",
            password_confirmation: ""
        };
    }

    handleSubmit(event) {
        const { full_name, username, password, email } = this.state;
        this.props.tryRegister(username, email, password, full_name);
        event.preventDefault();
    }

    componentDidMount() {
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
        const { registerInProgress, registerHasError, registerCompleted, api_token, loggedIn } = this.props.auth;

        if (registerInProgress && !registerHasError && !registerCompleted) {
        } else if (!registerInProgress && !registerHasError && registerCompleted) {
            setCookie(TOKEN_COOKIE, api_token, { path: "/" });
            setCookie(LOGGEDIN_COOKIE, loggedIn, { path: "/" });
            this.props.registerReset();
            history.push("/home");
        } else if (!registerInProgress && registerHasError && registerCompleted) {
            this.props.registerReset();
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
                                            <h4>Register</h4>
                                        </CardHeader>
                                        <CardBody>
                                            <CustomInput
                                                labelText="Full Name"
                                                id="full_name"
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
                                                    onChange: event => this.setState({ full_name: event.target.value })
                                                }}
                                            />
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
                                                labelText="Email"
                                                id="email"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    type: "email",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Email className={classes.inputIconsColor}/>
                                                        </InputAdornment>
                                                    ),
                                                    onChange: event => this.setState({ email: event.target.value })
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
                                            <CustomInput
                                                labelText="Password Confirmation"
                                                id="pass_conf"
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
                                                    onChange: event => this.setState({ password_confirmation: event.target.value })
                                                }}
                                            />
                                        </CardBody>
                                        <CardFooter className={classes.cardFooter}>
                                            <Button simple color="primary" size="lg" onClick={event => this.handleSubmit(event)}>
                                                Register
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </div>
                </div>
            </div>
        );
    }
}

function bindAction(dispatch) {
    return {
        tryRegister: (username, email, password, full_name) => dispatch(tryRegister(username, email, password, full_name)),
        registerReset: () => dispatch(registerReset())
    };
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(registerFormStyle)(RegisterForm));