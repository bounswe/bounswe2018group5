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
import { Close } from '@material-ui/icons';
import combineStyles from "services/combineStyles";

import dropdownStyle from "material-dashboard-react/dist/assets/jss/material-dashboard-react/dropdownStyle";
import modalStyle from "material-kit-react/assets/jss/material-kit-react/modalStyle";

import connect from "react-redux/es/connect/connect";

import { tryAcceptBid, acceptBidReset, tryDiscardBid, discardBidReset } from "redux/project/Actions.js";


function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class BidDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            discardModal: false,
            acceptModal: false,
            cardAnimaton: "cardHidden",
            alertOpen: false,
            place: 'tr',
            notificationMessage: '',
            description: ''
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

  handleAcceptBid(event) {
    this.props.tryAcceptBid(this.props.bid_info.bid_id);
    this.setState({ bid_id: this.props.bid_info.bid_id });
    event.preventDefault();
  }

  handleDiscardBid(event) {
    this.props.tryDiscardBid(this.props.bid_info.bid_id);
    this.setState({ bid_id: this.props.bid_info.bid_id});
    event.preventDefault();
  }

  componentDidUpdate(prevProps, prevState) {
    const { discardBidInProgress, discardBidHasError, discardBidCompleted, response } = this.props.project;
    if (!discardBidInProgress && !discardBidHasError && discardBidCompleted && this.state.bid_id === this.props.bid_info.bid_id) {
      if (response) {
        this.setState({
          alertOpen: true,
          color: 'success',
          notificationMessage: 'Bid is successfully discarded!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      } else {
        this.setState({
          alertOpen: true,
          color: 'danger',
          notificationMessage: 'Bid is not discarded!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      }
      this.handleModalClose("discardModal");
      this.setState({ bid_id: null });
      this.props.discardBidReset();
    }

    const { acceptBidInProgress, acceptBidHasError, acceptBidCompleted } = this.props.project;
    if (!acceptBidInProgress && !acceptBidHasError && acceptBidCompleted && this.state.bid_id === this.props.bid_info.bid_id) {
      if (response) {
        this.setState({
          alertOpen: true,
          color: 'success',
          notificationMessage: 'Bid is successfully accepted!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      } else {
        this.setState({
          alertOpen: true,
          color: 'danger',
          notificationMessage: 'Bid is not accepted!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      }
      this.handleModalClose("acceptModal");
      this.setState({ bid_id: null });
      this.props.acceptBidReset();
    }
  }

  render() {
    const { classes, bid_info } = this.props;
    const { open } = this.state;
    return (
      <div className={classes.manager}>
        <Button
          buttonRef={node => {
            this.anchorEl = node;
          }}
          color="github" simple
          justIcon
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
                      onClick={() => this.handleClickOpen("acceptModal")}
                      className={classes.dropdownItem}
                    >
                      Accept
                    </MenuItem>
                    <MenuItem
                      onClick={() => this.handleClickOpen("discardModal")}
                        className={classes.dropdownItem}
                    >
                      Discard
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
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
                <h4 className={classes.modalTitle}>Discard Bid</h4>
            </DialogTitle>
            <DialogContent
                id="modal-slide-description"
                className={classes.modalBody}>
            <h5>Are you sure you want to discard bid from "{bid_info.freelancer.full_name}"?</h5>
            </DialogContent>
            <DialogActions
                className={classes.modalFooter + " " + classes.modalFooterCenter}>
                <Button
                    onClick={() => this.handleModalClose("discardModal")}
                >
                    No
        </Button>
                <Button
                    onClick={event => this.handleDiscardBid(event)}
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
          open={this.state.acceptModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleModalClose("acceptModal")}
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
              onClick={() => this.handleModalClose("acceptModal")}>
              <Close className={classes.modalClose} />
            </IconButton>
            <h4 className={classes.modalTitle}>Accept Bid</h4>
          </DialogTitle>
          <DialogContent
            id="modal-slide-description"
            className={classes.modalBody}>
            <h5>Are you sure you want to accept bid from "{bid_info.freelancer.full_name}"?</h5>
          </DialogContent>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}>
            <Button
              onClick={() => this.handleModalClose("acceptModal")}
            >
              No
        </Button>
            <Button
              onClick={event => this.handleAcceptBid(event)}
              color="danger">
              Yes
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
    tryAcceptBid: (bid_id) => dispatch(tryAcceptBid(bid_id)),
    acceptBidReset: () => dispatch(acceptBidReset()),
    tryDiscardBid: (bid_id) => dispatch(tryDiscardBid(bid_id)),
    discardBidReset: () => dispatch(discardBidReset())
  };
}

const mapStateToProps = state => ({
  project: state.project
});

export default connect(
  mapStateToProps,
  bindAction
)(withStyles(combinedStyles)(BidDropdown));