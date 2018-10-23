import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import Button from "material-kit-react/components/CustomButtons/Button";
import Card from "material-kit-react/components/Card/Card";
import CardBody from "material-kit-react/components/Card/CardBody";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardFooter from "material-kit-react/components/Card/CardFooter";
import signupPageStyle from "material-kit-react/assets/jss/material-kit-react/views/loginPage.js";
import image from "../../sign.jpg";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            cardAnimaton: "cardHidden",
            formData: {
                fullname: '',
                email: '',
                password: '',
                password_confirmation: '',
            },
            submitted: false,

        };

        this.submitted = false;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.formData.password) {
                return false;
            }
            return true;
        });
    }

    handleChange(event) {
        const { formData } = this.state;
        formData[event.target.name] = event.target.value;
        this.setState({ formData });
    }

    handleSubmit() {
        this.setState({ submitted: true }, () => {
            setTimeout(() => this.setState({ submitted: false }), 5000);
        });
    }

    componentDidMount() {
        // we add a hidden class to the card and after 700 ms we delete it and the transition appears
        setTimeout(
            function () {
                this.setState({ cardAnimaton: "" });
            }.bind(this),
            700
        );
    }
    render() {
        const { formData, submitted } = this.state;
        const { classes, ...rest } = this.props;

        return (
            <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmit}
            >
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
                            <GridContainer justify="center">
                                <GridItem xs={12} sm={12} md={6}>
                                    <Card className={classes[this.state.cardAnimaton]}>
                                        <form className={classes.form} >
                                            <CardHeader color="primary" className={classes.cardHeader}>
                                                <h4>REGISTER</h4>
                                            </CardHeader>
                                            <CardBody>
                                                <TextValidator
                                                    label="Full Name..."
                                                    onChange={this.handleChange}
                                                    name="fullname"
                                                    value={formData.fullname}
                                                    validators={['required']}
                                                    errorMessages={['this field is required']}
                                                />
                                                <br />
                                                <br />
                                                <TextValidator
                                                    label="Email..."
                                                    onChange={this.handleChange}
                                                    name="email"
                                                    value={formData.email}
                                                    validators={['required', 'isEmail']}
                                                    errorMessages={['this field is required', 'email is not valid']}
                                                />
                                                <br />
                                                <br />
                                                <TextValidator
                                                    label="Password..."
                                                    onChange={this.handleChange}
                                                    name="password"
                                                    type="password"
                                                    validators={['required']}
                                                    errorMessages={['this field is required']}
                                                    value={formData.password}
                                                />
                                                <br />
                                                <br />
                                                <TextValidator
                                                    label="Re-enter Password..."
                                                    onChange={this.handleChange}
                                                    name="password_confirmation"
                                                    type="password"
                                                    validators={['isPasswordMatch', 'required']}
                                                    errorMessages={['password mismatch', 'this field is required']}
                                                    value={formData.password_confirmation}
                                                />
                                                <br />
                                                <br />
                                            </CardBody>
                                            <CardFooter className={classes.cardFooter}>
                                                <Button
                                                    raised
                                                    type="submit"
                                                    disabled={submitted}
                                                >
                                                    {
                                                        (submitted && 'Your form is submitted!') ||
                                                        (!submitted && 'Register')
                                                    }
                                                </Button>
                                            </CardFooter>
                                        </form>
                                    </Card>
                                </GridItem>
                            </GridContainer>
                        </div>

                    </div>
                </div>
            </ValidatorForm>
        );
    }
}
export default withStyles(signupPageStyle)(RegisterForm);