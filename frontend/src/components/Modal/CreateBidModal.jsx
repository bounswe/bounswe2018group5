import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from "@material-ui/core/styles/withStyles";
import CustomInput from "components/CustomInput/CustomInput";

import imagesStyles from "material-kit-react/assets/jss/material-kit-react/imagesStyles";
import OtherButton from "material-kit-react/components/CustomButtons/Button";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "material-dashboard-react/dist/components/Snackbar/Snackbar";

import { getCookie, LOGGEDIN_USERID_COOKIE } from "services/cookies";

import connect from "react-redux/es/connect/connect";
import { tryCreateBid, createBidReset } from "redux/project/Actions.js";

const style = {
  ...imagesStyles,
};
class CreateBidModal extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      modal: false,
      note: "",
      offer: 0,
      open: false,
      place: 'tr',
      notificationMessage: ''
    };
  }


  handleClickOpen = () => {
    this.setState({ modal: true });
  };

  handleClose = () => {
    this.setState({ modal: false });
  };

  handleCreateBid(event) {
    const { offer, note } = this.state;
    const { project_id } = this.props;
    const freelancer_id = getCookie(LOGGEDIN_USERID_COOKIE);
    this.props.tryCreateBid(project_id, freelancer_id, parseFloat(offer), note);
    event.preventDefault();
  }

  componentDidUpdate(prevProps, prevState) {
    const { createBidInProgress, createBidHasError, createBidCompleted, response } = this.props.project;
    if (!createBidInProgress && !createBidHasError && createBidCompleted) {
      if (response) {
        this.setState({
          open: true,
          color: 'success',
          notificationMessage: 'Your Bid is successfully added!'
        });
        setTimeout(function () {
          this.setState({ open: false });
        }.bind(this), 6000);
      } else {
        this.setState({
          open: true,
          color: 'danger',
          notificationMessage: 'Your Bid is not added!'
        });
        setTimeout(function () {
          this.setState({ open: false });
        }.bind(this), 6000);
      }
      this.handleClose();
      this.props.createBidReset();
    }
  }


  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Bid on Project</Button>
        <Dialog
          open={this.state.modal}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Bid on Project</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To bid on this project, please enter price and if any your notes here.
            </DialogContentText>
            <CustomInput
              labelText="Budget:"
              id="budget"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "number",
                onChange: event => this.setState({ offer: event.target.value })
              }}
            />
            <br />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Note:"
              type="text"
              inputProps={{ onChange: event => this.setState({ note: event.target.value }) }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            className={classes.modalFooter + " " + classes.modalFooterCenter}>
            <OtherButton
              onClick={event => this.handleCreateBid(event)}
              color={'primary'}
            >
              Add Bid
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
    tryCreateBid: (project_id, freelancer_id, offer, note) => dispatch(tryCreateBid(project_id, freelancer_id, offer, note)),
    createBidReset: () => dispatch(createBidReset())
  };
}

const mapStateToProps = state => ({
  project: state.project
});

export default connect(
  mapStateToProps,
  bindAction
)(withStyles(style)(CreateBidModal));