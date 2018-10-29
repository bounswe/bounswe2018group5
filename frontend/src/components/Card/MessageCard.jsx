import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from "@material-ui/core/styles/withStyles";

import imagesStyles from "material-kit-react/assets/jss/material-kit-react/imagesStyles";


const style = {
  ...imagesStyles,

};
class MessageCard extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, projectOwner } = this.props;
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
              autoFocus
              margin="dense"
              id="standard-read-only-input"
              label="Send to:"
              defaultValue={projectOwner}
              className={classes.textField}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
            <br />
            <TextField
              autoFocus
              margin="dense"
              id="standard-read-only-input"
              label="Subject :"
              className={classes.textField}
              fullWidth
            />
            <br />

            <TextField
              id="standard-textarea"
              label=""
              placeholder="Type ..."
              multiline
              className={classes.textField}
              margin="normal"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.handleClose} variant="contained" size="small" className={classes.button}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(style)(MessageCard);