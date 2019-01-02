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
import { Close } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
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
import { tryCreateProject, createProjectReset, tryGetTag, getTagReset } from "redux/project/Actions.js";

import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

import Select from 'react-select';

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
            milestones: [{ name: "", detail: "", deadline: "" }],
            tags: [],
            options: [],
            options_tags: [],
        };

        this.handleTagsChange = this.handleTagsChange.bind(this);
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
        const { title, description, project_deadline, budget, milestones, options_tags } = this.state;
        let options = [];
        options_tags.map((prop, key) => {
            options.push(prop.value);
            return null;
        });     
        this.props.tryCreateProject(title, description, project_deadline, parseFloat(budget), milestones, options);
        event.preventDefault();
    }
    componentDidUpdate(prevProps, prevState) {
        const { createProjectInProgress, createProjectHasError, createProjectCompleted, response, project } = this.props.project;
        if (!createProjectInProgress && !createProjectHasError && createProjectCompleted) {
            if (response) {
                this.props.handleToUpdate(project);
                this.setState({
                    open: true,
                    color: 'success',
                    notificationMessage: 'Your Project is successfully created!'
                });
                setTimeout(function () {
                    this.setState({ open: false });
                }.bind(this), 6000);
            } else {
                this.setState({
                    open: true,
                    color: 'danger',
                    notificationMessage: 'Your Project is not created!'
                });
                setTimeout(function () {
                    this.setState({ open: false });
                }.bind(this), 6000);
            }
            this.handleClose("modal");
            this.props.createProjectReset();
        }

        const { getTagInProgress, getTagHasError, getTagCompleted, search } = this.props.project;
        if (!getTagInProgress && !getTagHasError && getTagCompleted) {
            if (response) {
                let options = [];
                Object.keys(search).forEach(function (key) {
                    search[key].map((prop, key) => {
                        options.push({
                            label: prop.label + ": " + prop.description,
                            value: prop.wikidata_id
                        });
                        return null;
                    });
                });                
                this.setState({options});
            }
            this.props.getTagReset();
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
            milestones: [...prevState.milestones, { name: "", deadline: "", detail: "" }],
        }));
    }
    handleRemove = (idx) => () => {
        this.setState({
            milestones: this.state.milestones.filter((s, sidx) => idx !== sidx)
        });
    }
    handleMilestoneChange = (value, idx, type) => {
        let milestones = [...this.state.milestones]
        milestones[idx][type] = value;
        this.setState({ milestones })
        
    }

    handleTagsChange(tags) {
        this.setState({ tags })
    }

    searchTags = (e) => {
        const { tags } = this.state;
        this.props.tryGetTag(tags.join(','));
    }

    render() {       
        const { classes } = this.props;
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
                            <Close className={classes.modalClose} />
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
                                                onChange: event => this.setState({ title: event.target.value })
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
                                                onChange: event => this.setState({ description: event.target.value })
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <DateTimePicker
                                            placeholder={"Project Deadline"}
                                            onChange={event => this.setState({ project_deadline: event.format("YYYY-MM-DD") })}
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
                                                onChange: event => this.setState({ budget: event.target.value })
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={10}>
                                        <TagsInput inputProps={{placeholder: "Search a tag"}} value={this.state.tags} onChange={this.handleTagsChange}/>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={2}>
                                        <Button variant="contained" color="primary" onClick={this.searchTags}>
                                            <SearchIcon className={classes.rightIcon} />
                                        </Button>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <Select
                                            isMulti
                                            name="tags"
                                            options={this.state.options}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            onChange={(val) => { this.setState({options_tags: val}) }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <Divider style={{ margin: "16px" }} />
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
                                                                    onChange: event => this.handleMilestoneChange(event.target.value, idx, 'name')
                                                                }}
                                                            />
                                                        </GridItem>
                                                        <GridItem xs={12} sm={12} md={5}>
                                                            <DateTimePicker
                                                                placeholder={"Date"}
                                                                onChange={event => this.handleMilestoneChange(event.format("YYYY-MM-DD"), idx, 'deadline')}
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
                                                                    onChange: event => this.handleMilestoneChange(event.target.value, idx, 'detail')
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
                    closeNotification={() => this.setState({ open: false })}
                    close
                />
            </div>
        );
    }
}
function bindAction(dispatch) {
    return {
        tryCreateProject: (title, description, project_deadline, budget, milestones, tags) => dispatch(tryCreateProject(title, description, project_deadline, budget, milestones, tags)),
        createProjectReset: () => dispatch(createProjectReset()),
        tryGetTag: (tags) => dispatch(tryGetTag(tags)),
        getTagReset: () => dispatch(getTagReset())
    };
}
const mapStateToProps = state => ({
    project: state.project
});
export default connect(
    mapStateToProps,
    bindAction
)(withStyles(modalStyle)(AddProjectModal));