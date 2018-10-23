import React from "react";
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
import CustomInput from "material-kit-react/components/CustomInput/CustomInput";
import signupPageStyle from "material-kit-react/assets/jss/material-kit-react/views/loginPage.js";
import image from "../../sign.jpg";
import FormValidator from '../../components/FormValidator/FormValidator.js';

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.validator = new FormValidator([
            {
                field: 'fullname',
                method: 'isEmpty',
                validWhen: false,
                message: 'Please provide a name.'
            },
            {
                field: 'email',
                method: 'isEmpty',
                validWhen: false,
                message: 'Email is required.'
            },
            {
                field: 'email',
                method: 'isEmail',
                validWhen: true,
                message: 'That is not a valid email.'
            },
            {
                field: 'password',
                method: 'isEmpty',
                validWhen: false,
                message: 'Password is required.'
            },
            {
                field: 'password_confirmation',
                method: 'isEmpty',
                validWhen: false,
                message: 'Password confirmation is required.'
            },
            {
                field: 'password_confirmation',
                method: this.passwordMatch,   // notice that we are passing a custom function here
                validWhen: true,
                message: 'Password and password confirmation do not match.'
            }
        ]);
        this.state = {
            cardAnimaton: "cardHidden",
            fullname: '',
            email: '',
            password: '',
            password_confirmation: '',
            validation: this.validator.valid(),
        };

        this.submitted = false;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }


    passwordMatch = (confirmation, state) => (state.password === confirmation);

    handleInputChange = event => {
        event.preventDefault();
        this.setState({
            [event.target.id]: event.target.value,
        });
    };

    /*handleInputChange(e) {
        let target = e.target;
        let value = target.value;
        let name = target.id;

        this.setState({
            [name]: value
        });
    }*/

    handleFormSubmit = event => {
        event.preventDefault();

        const validation = this.validator.validate(this.state);
        this.setState({ validation });
        this.submitted = true;
        console.log(validation);
        if (validation.isValid) {
            // handle actual form submission here
            console.log("valid");
            console.log(this.state);
        }
    };

    componentDidMount() {
        // we add a hidden class to the card and after 700 ms we delete it and the transition appears
        setTimeout(
            function() {
                this.setState({ cardAnimaton: "" });
            }.bind(this),
            700
        );
    }
    render() {
        const { classes, ...rest } = this.props;
        let validation = this.submitted ?                         // if the form has been submitted at least once
            this.validator.validate(this.state) :   // then check validity every time we render
            this.state.validation;                  // otherwise just use what's in state
        console.log(this.state);
        return (
            <div>
                <div
                    className={classes.pageHeader}
                    style={{
                        backgroundImage: "url(" + image + ")",
                        backgroundSize: "cover",
                        backgroundPosition: "top center"
                    }}
                >
                    <div className={classes.container}>
                        <GridContainer justify="right">
                            <GridItem xs={12} sm={12} md={4}>
                                <Card className={classes[this.state.cardAnimaton]}>
                                    <form className={classes.form} onSubmit={this.handleFormSubmit}>
                                        <CardHeader color="primary" className={classes.cardHeader}>
                                            <h4>REGISTER</h4>
                                        </CardHeader>
                                        <CardBody>
                                            <div className={validation.fullname.isInvalid && 'has-error'}>
                                                <CustomInput
                                                    labelText="Full Name..."
                                                    id="fullname"
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        type: "text",
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <People className={classes.inputIconsColor} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    onChange={this.handleInputChange}/>
                                                <span className="help-block" style={{color:'red'}}>{validation.fullname.message}</span>
                                            </div>
                                            <div className={validation.email.isInvalid && 'has-error'}>
                                                <CustomInput
                                                    labelText="Email..."
                                                    id="email"
                                                    formControlProps={{
                                                        fullWidth: true
                                                    }}
                                                    inputProps={{
                                                        type: "email",
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Email className={classes.inputIconsColor} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    onChange={this.handleInputChange}/>
                                                <span className="help-block" style={{color:'red'}}>{validation.email.message}</span>
                                            </div>
                                            <div className={validation.password.isInvalid && 'has-error'}>
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
                                                        )
                                                    }}
                                                    onChange={this.handleInputChange}/>
                                                <span className="help-block" style={{color:'red'}}>{validation.password.message}</span>
                                            </div>
                                                <div className={validation.password.isInvalid && 'has-error'}>
                                                <CustomInput
                                                    labelText="Re-enter Password"
                                                    id="password_confirmation"
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
                                                        )
                                                    }}
                                                    onChange={this.handleInputChange}/>
                                                    <span className="help-block" style={{color:'red'}}>{validation.password_confirmation.message}</span>
                                                </div>
                                        </CardBody>
                                        <CardFooter className={classes.cardFooter}>
                                            <Button onClick={(e) => this.handleFormSubmit(e)} simple color="primary" size="lg">
                                                REGISTER
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
export default withStyles(signupPageStyle)(RegisterForm);