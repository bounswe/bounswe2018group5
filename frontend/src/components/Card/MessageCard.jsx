import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from "@material-ui/core/styles/withStyles";

import imagesStyles from "material-kit-react/assets/jss/material-kit-react/imagesStyles";

import connect from "react-redux/es/connect/connect";

import { trySendMessage, sendMessageReset } from "redux/user/Actions.js";



const style = {
  ...imagesStyles,

};
class MessageCard extends React.Component {
  constructor(props) {    
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      open: false,
      message: ""
    };

    this.onClick = this.onClick.bind(this);
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onClick() {
    this.props.trySendMessage(this.props.projectOwner, this.state.message);
  }

  componentDidUpdate(prevProps, prevState) {
    const { sendMessageInProgress, sendMessageHasError, sendMessageCompleted, response } = this.props.user;

    if (!sendMessageInProgress && !sendMessageHasError && sendMessageCompleted) {
      if (response) {
        this.handleClose();
        this.props.sendMessageReset();
      }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Send Message</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Send Message</DialogTitle>
          <DialogContent>

            <TextField
              id="standard-textarea"
              label=""
              placeholder="Type ..."
              multiline
              className={classes.textField}
              margin="normal"
              fullWidth
              onChange={event => this.setState({ message: event.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.onClick} variant="contained" size="small" className={classes.button}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

function bindAction(dispatch) {
  return {
    trySendMessage: (user_id, message) => dispatch(trySendMessage(user_id, message)),
    sendMessageReset: () => dispatch(sendMessageReset()),
  };
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  bindAction
)(withStyles(style)(MessageCard));