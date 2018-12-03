import React from "react";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Slide from "@material-ui/core/Slide";
import Divider from '@material-ui/core/Divider';

// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
//core components
import Button from "material-kit-react/components/CustomButtons/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "material-dashboard-react/dist/components/Snackbar/Snackbar";
import GridContainer from "material-dashboard-react/dist/components/Grid/GridContainer";
import GridItem from "material-dashboard-react/dist/components/Grid/GridItem";
import CustomInput from "components/CustomInput/CustomInput";
import DateTimePicker from "components/DateTimePicker/DateTimePicker";
import { Close } from '@material-ui/icons';
import combineStyles from "services/combineStyles";

import dropdownStyle from "material-dashboard-react/dist/assets/jss/material-dashboard-react/dropdownStyle";
import modalStyle from "material-kit-react/assets/jss/material-kit-react/modalStyle";

import connect from "react-redux/es/connect/connect";

import { tryEditProject, editProjectReset, tryDiscardProject, discardProjectReset, tryDeleteProject, deleteProjectReset, tryFinishProject, finishProjectReset, tryRateProject, rateProjectReset } from "redux/project/Actions.js";


function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class ProjectDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            discardModal: false,
            deleteModal: false,
            editModal: false,
            finishModal: false,
            rateModal: false,
            cardAnimaton: "cardHidden",
            alertOpen: false,
            place: 'tr',
            notificationMessage: '',
            description: '',
            milestones: [],
        };
    }

    handleClickOpen(modal) {
        var x = [];
        x[modal] = true;
        this.setState(x);
    }

    handleModalClose(modal) {
        var x = [];
        x[modal] = false;
        this.setState(x);
    }

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  handleEditProject(event) {
    const { description, milestones} = this.state;
    this.props.tryEditProject(this.props.project_info.project_id, description, milestones);
    this.setState({ project_id: this.props.project_info.project_id });
    event.preventDefault();
  }

  componentDidMount() {
    this.setState({milestones: this.props.project_info.milestones})
}

  handleDeleteProject(event) {
    this.props.tryDeleteProject(this.props.project_info.project_id);
    this.setState({ project_id: this.props.project_info.project_id });
    event.preventDefault();
  }

  handleDiscardProject(event) {
    this.props.tryDiscardProject(this.props.project_info.project_id);
    this.setState({ project_id: this.props.project_info.project_id});
    event.preventDefault();
  }

  handleFinishProject(event) {
    this.props.tryFinishProject(this.props.project_info.project_id);
    this.setState({ project_id: this.props.project_info.project_id});
    event.preventDefault();
  }

  handleRateProject(event) {
    const { comment, value } = this.state;
    this.props.tryRateProject(this.props.project_info.project_id, comment, parseFloat(value));
    this.setState({ project_id: this.props.project_info.project_id });
    event.preventDefault();
  }

  handleRemove = (idx) => () => {
    this.setState({
        milestones: this.state.milestones.filter((s, sidx) => idx !== sidx)
    });
}

  handleMilestoneChange = (value, idx, type) => {
    let milestones = [...this.state.milestones]
    console.log(milestones)
    milestones[idx][type] = value;
    this.setState({ milestones })
  
}

  componentDidUpdate(prevProps, prevState) {
    const { editProjectInProgress, editProjectHasError, editProjectCompleted, response, project } = this.props.project;
    if (!editProjectInProgress && !editProjectHasError && editProjectCompleted && this.state.project_id === this.props.project_info.project_id) {
      if (response) {
        this.props.handleToUpdate(project, 'edit');
        this.setState({
          alertOpen: true,
          color: 'success',
          notificationMessage: 'Your Project is successfully edited!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      } else {
        this.setState({
          alertOpen: true,
          color: 'danger',
          notificationMessage: 'Your Project is not edited!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      }
      this.handleModalClose("editModal");
      this.setState({ project_id: null });
      this.props.editProjectReset();
    }

    const { discardProjectInProgress, discardProjectHasError, discardProjectCompleted } = this.props.project;
    if (!discardProjectInProgress && !discardProjectHasError && discardProjectCompleted && this.state.project_id === this.props.project_info.project_id) {
      if (response) {
        this.props.handleToUpdate(project, 'edit');
        this.setState({
          alertOpen: true,
          color: 'success',
          notificationMessage: 'Your Project is successfully discarded!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      } else {
        this.setState({
          alertOpen: true,
          color: 'danger',
          notificationMessage: 'Your Project is not discarded!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      }
      this.handleModalClose("discardModal");
      this.setState({ project_id: null });
      this.props.discardProjectReset();
    }

    const { finishProjectInProgress, finishProjectHasError, finishProjectCompleted } = this.props.project;
    if (!finishProjectInProgress && !finishProjectHasError && finishProjectCompleted && this.state.project_id === this.props.project_info.project_id) {
      if (response) {
        this.props.handleToUpdate(project, 'edit');
        this.setState({
          alertOpen: true,
          color: 'success',
          notificationMessage: 'Your Project is successfully finished!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      } else {
        this.setState({
          alertOpen: true,
          color: 'danger',
          notificationMessage: 'Your Project is not finished!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      }
      this.handleModalClose("finishModal");
      this.setState({ project_id: null });
      this.props.finishProjectReset();
    }

    const { rateProjectInProgress, rateProjectHasError, rateProjectCompleted } = this.props.project;
    if (!rateProjectInProgress && !rateProjectHasError && rateProjectCompleted && this.state.project_id === this.props.project_info.project_id) {
      if (response) {
        this.setState({
          alertOpen: true,
          color: 'success',
          notificationMessage: 'Your Project is successfully rated!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      } else {
        this.setState({
          alertOpen: true,
          color: 'danger',
          notificationMessage: 'Your Project is not rated!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      }
      this.handleModalClose("rateModal");
      this.setState({ project_id: null, value: 0, comment: "" });
      this.props.rateProjectReset();
    }

    const { deleteProjectInProgress, deleteProjectHasError, deleteProjectCompleted } = this.props.project;
    if (!deleteProjectInProgress && !deleteProjectHasError && deleteProjectCompleted && this.state.project_id === this.props.project_info.project_id) {
      if (response) {
        this.props.handleToUpdate(this.props.project_info, 'delete');
        this.setState({
          alertOpen: true,
          color: 'success',
          notificationMessage: 'Your Project is successfully deleted!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      } else {
        this.setState({
          alertOpen: true,
          color: 'danger',
          notificationMessage: 'Your Project is not deleted!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      }
      this.handleModalClose("deleteModal");
      this.setState({ project_id: null });
      this.props.deleteProjectReset();
    }
  }

  render() {
    const { classes, project_info } = this.props;
    const { open } = this.state;
    let finishOrRate;

    if ( project_info.status === 2 ) {
      finishOrRate = 
        <MenuItem
        onClick={() => this.handleClickOpen("rateModal")}
        className={classes.dropdownItem}
        >
        Rate
        </MenuItem> 
    }
    else {
      finishOrRate = 
        <MenuItem
          onClick={() => this.handleClickOpen("finishModal")}
          className={classes.dropdownItem}
        >
          Finish
        </MenuItem>
    }
    return (
      <div className={classes.manager}>
        <Button
          buttonRef={node => {
            this.anchorEl = node;
          }}
          color={"white"}
          justIcon
          simple
          aria-owns={open ? "menu-list-grow" : null}
          aria-haspopup="true"
          onClick={this.handleToggle}
          className={classes.buttonLink}
        >
          <Menu className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p onClick={this.handleClick} className={classes.linkText}>
              Actions
            </p>
          </Hidden>
        </Button>
        <Poppers
          open={open}
          anchorEl={this.anchorEl}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !open }) +
            " " +
            classes.pooperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={() => this.handleClickOpen("editModal")}
                        className={classes.dropdownItem}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => this.handleClickOpen("discardModal")}
                        className={classes.dropdownItem}
                    >
                      Discard
                    </MenuItem>
                    <MenuItem
                      onClick={() => this.handleClickOpen("deleteModal")}
                      className={classes.dropdownItem}
                    >
                      Delete
                    </MenuItem>
                    {finishOrRate}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
        <Dialog
          scroll="body"
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={this.state.editModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleModalClose("editModal")}
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
              onClick={() => this.handleModalClose("editModal")}>
              <Close className={classes.modalClose} />
            </IconButton>
            <h4 className={classes.modalTitle}>Edit Project</h4>
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
                        value: project_info.title,
                        disabled: true,
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
                        defaultValue: project_info.description,
                        onChange: event => this.setState({ description: event.target.value }),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <DateTimePicker
                      placeholder={"Project Deadline"}
                      value={project_info.project_deadline}
                      onChange={event => this.setState({ project_deadline: event.format("YYYY-MM-DD") })}
                      disabled={true}
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
                        disabled: true,
                        value: project_info.budget,
                        onChange: event => this.setState({ budget: event.target.value })
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                      <Divider style={{ margin: "16px" }} />
                      {/*<Button variant="contained" color="primary" onClick={this.addMilestones}>
                          Add new milestone
                      <AddIcon className={classes.rightIcon} />
                    </Button>*/}
                      {
                          this.state.milestones.map((val, idx) => {
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
                                                  defaultValue: val.name,
                                                  onChange: event => this.handleMilestoneChange(event.target.value, idx, 'name')
                                              }}
                                          />
                                      </GridItem>
                                      <GridItem xs={12} sm={12} md={5}>
                                          <DateTimePicker
                                              placeholder={"Date"}
                                              value={val.deadline}
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
                                                  defaultValue: val.detail,
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
            <Button
              onClick={event => this.handleEditProject(event)}
              color={'primary'}
            >
              Edit Project
                        </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={this.state.finishModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleModalClose("finishModal")}
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
              onClick={() => this.handleModalClose("finishModal")}>
              <Close className={classes.modalClose} />
            </IconButton>
            <h4 className={classes.modalTitle}>Finish Project</h4>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={classes.modalBody}>
            <h5>Are you sure you want to finish "{project_info.title}"?</h5>
          </DialogContent>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}>
            <Button
              onClick={() => this.handleModalClose("finishModal")}
            >
              No
        </Button>
            <Button
              onClick={event => this.handleFinishProject(event)}
              color="danger">
              Yes
        </Button>
          </DialogActions>
        </Dialog>

        <Dialog
            classes={{
                root: classes.center,
                paper: classes.modal
            }}
            open={this.state.discardModal}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => this.handleModalClose("discardModal")}
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
                    onClick={() => this.handleModalClose("discardModal")}>
                    <Close className={classes.modalClose} />
                </IconButton>
                <h4 className={classes.modalTitle}>Discard Project</h4>
            </DialogTitle>
            <DialogContent
                id="modal-slide-description"
                className={classes.modalBody}>
            <h5>Are you sure you want to discard "{project_info.title}"?</h5>
            </DialogContent>
            <DialogActions
                className={classes.modalFooter + " " + classes.modalFooterCenter}>
                <Button
                    onClick={() => this.handleModalClose("discardModal")}
                >
                    No
        </Button>
                <Button
                    onClick={event => this.handleDiscardProject(event)}
                    color="danger">
                    Yes
        </Button>
            </DialogActions>
        </Dialog>
        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={this.state.deleteModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleModalClose("deleteModal")}
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
              onClick={() => this.handleModalClose("deleteModal")}>
              <Close className={classes.modalClose} />
            </IconButton>
            <h4 className={classes.modalTitle}>Delete Project</h4>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={classes.modalBody}>
            <h5>Are you sure you want to delete "{project_info.title}"?</h5>
          </DialogContent>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}>
            <Button
              onClick={() => this.handleModalClose("deleteModal")}
            >
              No
        </Button>
            <Button
              onClick={event => this.handleDeleteProject(event)}
              color="danger">
              Yes
        </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={this.state.rateModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleModalClose("rateModal")}
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
              onClick={() => this.handleModalClose("rateModal")}>
              <Close className={classes.modalClose} />
            </IconButton>
            <h4 className={classes.modalTitle}>Rate Project</h4>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={classes.modalBody}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                  labelText="Rate"
                  id="rate"
                 
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: 'number',
                    onChange: event => this.setState({ value: event.target.value })
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                  labelText="Comment"
                  id="comment"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    multiline: true,
                    rows: 3,
                    onChange: event => this.setState({ comment: event.target.value })
                  }}
                />
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}>
            <Button
              onClick={event => this.handleRateProject(event)}
              >
              Rate
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
            place={this.state.place}
            icon={AddAlert}
            color={this.state.color}
            message={this.state.notificationMessage}
            open={this.state.alertOpen}
            closeNotification={() => this.setState({ alertOpen: false })}
            close
        />
      </div>
    );
  }
}

// Use our util to create a compatible function for `withStyles`:
const combinedStyles = combineStyles(dropdownStyle, modalStyle);

function bindAction(dispatch) {
  return {
    tryEditProject: (project_id, description, milestones) => dispatch(tryEditProject(project_id, description, milestones)),
    editProjectReset: () => dispatch(editProjectReset()),
    tryDiscardProject: (project_id) => dispatch(tryDiscardProject(project_id)),
    discardProjectReset: () => dispatch(discardProjectReset()),
    tryDeleteProject: (project_id) => dispatch(tryDeleteProject(project_id)),
    deleteProjectReset: () => dispatch(deleteProjectReset()),
    tryFinishProject: (project_id) => dispatch(tryFinishProject(project_id)),
    finishProjectReset: () => dispatch(finishProjectReset()),
    tryRateProject: (project_id, comment, value) => dispatch(tryRateProject(project_id, comment, value)),
    rateProjectReset: () => dispatch(rateProjectReset()),
  };
}

const mapStateToProps = state => ({
  project: state.project
});

export default connect(
  mapStateToProps,
  bindAction
)(withStyles(combinedStyles)(ProjectDropdown));