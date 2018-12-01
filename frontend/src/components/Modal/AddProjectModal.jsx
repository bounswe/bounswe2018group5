import React from 'react';
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import Divider from '@material-ui/core/Divider';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import {Close} from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
// core components
import Button from '@material-ui/core/Button';
import OtherButton from "material-kit-react/components/CustomButtons/Button";

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
            notificationMessage: '',
            milestones: [{ name: "", date: "" , descr: ""}],
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
        const {createProjectInProgress, createProjectHasError, createProjectCompleted, response, project} = this.props.project;
        if (!createProjectInProgress && !createProjectHasError && createProjectCompleted) {
            if (response) {
                this.props.handleToUpdate(project);
                this.setState({
                    open: true,
                    color: 'success',
                    notificationMessage: 'Your Project is successfully created!'
                });
                setTimeout(function () {
                    this.setState({open: false});
                }.bind(this), 6000);
            } else {
                this.setState({
                    open: true,
                    color: 'danger',
                    notificationMessage: 'Your Project is not created!'
                });
                setTimeout(function () {
                    this.setState({open: false});
                }.bind(this), 6000);
            }
            this.handleClose("modal");
            this.props.createProjectReset();
        }
    }

    handleChange = (e) => {
        if (["name", "date", "descr"].includes(e.target.className)) {
            let milestones = [...this.state.milestones]
            milestones[e.target.dataset.id][e.target.className] = e.target.value.toUpperCase()
            this.setState({ milestones }, () => console.log(this.state.milestones))
        } else {
            this.setState({ [e.target.name]: e.target.value.toUpperCase() })
        }
    }
    
    addMilestones = (e) => {
        this.setState((prevState) => ({
            milestones: [...prevState.milestones, { name: "", date: "" , descr: ""}],
        }));
    }

    handleRemove = (idx) => () => {
        this.setState({
          milestones: this.state.milestones.filter((s, sidx) => idx !== sidx)
        });
    }

    render() {
        const {classes} = this.props;
        const { milestones } = this.state;
        return (
            <div>
                <Button variant="fab" color="secondary" aria-label="Add"
                        onClick={() => this.handleClickOpen("modal")}>
                    <AddIcon />
                </Button>
                <Dialog
                    scroll="body"
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
                                            placeholder={"Project Deadline"}
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
                                    <GridItem xs={12} sm={12} md={12}>
                                    <Divider style={{margin: "16px"}}/>
                                    <Button variant="contained" color="primary" onClick={this.addMilestones}>
                                        Add new milestone
                                        <AddIcon className={classes.rightIcon} />
                                    </Button>
                                    {
                                        milestones.map((val, idx) => {
                                            return (
                                                <GridContainer key={idx}>
                                                    <GridItem xs={12} sm={12} md={5}>
                                                        <CustomInput
                                                            labelText={`Milestone #${idx + 1}`}
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                type: 'text',
                                                            }}
                                                        />
                                                    </GridItem>
                                                    <GridItem xs={12} sm={12} md={5}>
                                                        <DateTimePicker
                                                            placeholder={"Date"}
                                                        />
                                                    </GridItem>
                                                    <GridItem xs={12} sm={12} md={2}>
                                                    <Button variant="contained" color="primary" onClick={this.handleRemove(idx)} className="small">
                                                        <Close />
                                                    </Button>
                                                    </GridItem>
                                                    <GridItem xs={12} sm={12} md={12}>
                                                        <CustomInput
                                                            labelText="Milestone Description"
                                                            id="descr"
                                                            formControlProps={{
                                                                fullWidth: true
                                                            }}
                                                            inputProps={{
                                                                multiline: true,
                                                                rows: 3,
                                                                onChange: event => this.setState({descr: event.target.value})
                                                            }}
                                                        />
                                                    </GridItem>
                                                </GridContainer>
                                            )
                                        })
                                    }
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </DialogContent>
                    <DialogActions
                        className={classes.modalFooter + " " + classes.modalFooterCenter}>
                        <OtherButton
                            onClick={event => this.handleCreateProject(event)}
                            color={'primary'}
                        >
                            Add Project
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