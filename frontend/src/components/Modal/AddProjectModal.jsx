import React from 'react';
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import {Add, Close} from '@material-ui/icons';
// core components
import Button from "material-dashboard-react/dist/components/CustomButtons/Button";

import modalStyle from "material-kit-react/assets/jss/material-kit-react/modalStyle";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "material-dashboard-react/dist/components/Snackbar/Snackbar";
import GridContainer from "material-dashboard-react/dist/components/Grid/GridContainer";
import GridItem from "material-dashboard-react/dist/components/Grid/GridItem";
import CustomInput from "components/CustomInput/CustomInput";
import DateTimePicker from "components/DateTimePicker/DateTimePicker";
import connect from "react-redux/es/connect/connect";
import {tryCreateProject, createProjectReset} from "redux/project/Actions.js";


function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class AddProjectModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            cardAnimaton: "cardHidden",
            open: false,
            place: 'tr',
            notification_message: ''
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

    handleCreateProject(event) {
        const {title, description, project_deadline, budget} = this.state;
        this.props.tryCreateProject(title, description, project_deadline, parseFloat(budget));
        event.preventDefault();
    }

    componentDidUpdate(prevProps, prevState) {
        const {createProjectInProgress, createProjectHasError, createProjectCompleted, response} = this.props.project;
        if (!createProjectInProgress && !createProjectHasError && createProjectCompleted) {
            if (response) {
                this.setState({
                    open: true,
                    color: 'success',
                    notification_message: 'Your Project is successfully created!'
                });
                setTimeout(function () {
                    this.setState({open: false});
                }.bind(this), 6000);
            } else {
                this.setState({
                    open: true,
                    color: 'danger',
                    notification_message: 'Your Project is not created!'
                });
                setTimeout(function () {
                    this.setState({open: false});
                }.bind(this), 6000);
            }
            this.handleClose("modal");
            this.props.createProjectReset();
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Button
                    color="primary"
                    justIcon
                    round
                    onClick={() => this.handleClickOpen("modal")}><Add style={{color: "#FFFFFF"}}/>
                </Button>
                <Dialog
                    classes={{
                        root: classes.center,
                        paper: classes.modal
                    }}
                    open={this.state.modal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => this.handleClose("modal")}
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
                            onClick={() => this.handleClose("modal")}>
                            <Close className={classes.modalClose}/>
                        </IconButton>
                        <h4 className={classes.modalTitle}>Add Project</h4>
                    </DialogTitle>
                    <DialogContent
                        id="modal-slide-description"
                        className={classes.modalBody}>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput
                                            labelText="Title"
                                            id="title"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: "text",
                                                onChange: event => this.setState({title: event.target.value})
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput
                                            labelText="Description"
                                            id="description"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                multiline: true,
                                                rows: 3,
                                                onChange: event => this.setState({description: event.target.value})
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <DateTimePicker
                                            onChange={event => this.setState({project_deadline: event.format("YYYY-MM-DD")})}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="Budget"
                                            id="budget"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: 'number',
                                                onChange: event => this.setState({budget: event.target.value})
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </DialogContent>
                    <DialogActions
                        className={classes.modalFooter + " " + classes.modalFooterCenter}>
                        <Button
                            onClick={event => this.handleCreateProject(event)}
                            color={'primary'}
                        >
                            Add Project
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    place={this.state.place}
                    icon={AddAlert}
                    color={this.state.color}
                    message={this.state.notification_message}
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
        tryCreateProject: (title, description, project_deadline, budget) => dispatch(tryCreateProject(title, description, project_deadline, budget)),
        createProjectReset: () => dispatch(createProjectReset())
    };
}

const mapStateToProps = state => ({
    project: state.project
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(modalStyle)(AddProjectModal));