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

import SaveIcon from '@material-ui/icons/Save';
import classNames from "classnames";

const style = {
  ...imagesStyles,
};
class CreateBid extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      open: false,
      note: "",
      budget: 0,
    };
  }


  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });

  };


  render() {
    const { classes, note, budget } = this.props;
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Bid on Project</Button>
        <Dialog
          open={this.state.open}
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
                onChange: event => this.setState({ budget: event.target.value })
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
            <Button onClick={this.handleClose} variant="contained" size="small" className={classes.button}>
              <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
              Place Bid
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(style)(CreateBid);