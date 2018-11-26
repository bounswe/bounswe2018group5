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
import GridContainer from "material-dashboard-react/dist/components/Grid/GridContainer";
import GridItem from "material-dashboard-react/dist/components/Grid/GridItem";
import CustomInput from "components/CustomInput/CustomInput";
import DateTimePicker from "components/DateTimePicker/DateTimePicker";
import { Close } from '@material-ui/icons';
import combineStyles from "services/combineStyles";

import dropdownStyle from "material-dashboard-react/dist/assets/jss/material-dashboard-react/dropdownStyle";
import modalStyle from "material-kit-react/assets/jss/material-kit-react/modalStyle";

import connect from "react-redux/es/connect/connect";

import { tryPutPortfolio, postPortfolioReset, tryDeletePortfolio, deletePortfolioReset } from "redux/user/Actions.js";


function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class PortfolioDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            deleteModal: false,
            editModal: false,
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

  handleEditPortfolio(event) {
    const { title, description, date, project_id } = this.state;
    this.props.tryPutPortfolio(this.props.portfolio_info.portfolio_id, title, description, date, project_id);
    this.setState({ portfolio_id: this.props.portfolio_info.portfolio_id });
    event.preventDefault();
  }

  handleDeletePortfolio(event) {
    this.props.tryDeletePortfolio(this.props.portfolio_info.portfolio_id);
    this.setState({ portfolio_id: this.props.portfolio_info.portfolio_id });
    event.preventDefault();
  }

  componentDidUpdate(prevProps, prevState) {
    const { putPortfolioInProgress, putPortfolioHasError, putPortfolioCompleted, response, portfolio } = this.props.user;
    if (!putPortfolioInProgress && !putPortfolioHasError && putPortfolioCompleted && this.state.portfolio_id === this.props.portfolio_info.portfolio_id) {
      if (response) {
        const new_portfolio = { ...portfolio, id: this.props.portfolio_info.portfolio_id };
        this.props.handleToUpdate(new_portfolio, 'edit');
        this.setState({
          alertOpen: true,
          color: 'success',
          notificationMessage: 'Your Portfolio is successfully edited!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      } else {
        this.setState({
          alertOpen: true,
          color: 'danger',
          notificationMessage: 'Your Portfolio is not edited!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      }
      this.handleModalClose("editModal");
      this.setState({ portfolio_id: null });
      this.props.postPortfolioReset();
    }

    const { deletePortfolioInProgress, deletePortfolioHasError, deletePortfolioCompleted } = this.props.user;
    if (!deletePortfolioInProgress && !deletePortfolioHasError && deletePortfolioCompleted && this.state.portfolio_id === this.props.portfolio_info.portfolio_id) {
      if (response) {
        const portfolio = { ...this.props.portfolio_info, id: this.props.portfolio_info.portfolio_id};
        this.props.handleToUpdate(portfolio, 'delete');
        this.setState({
          alertOpen: true,
          color: 'success',
          notificationMessage: 'Your Portfolio is successfully deleted!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      } else {
        this.setState({
          alertOpen: true,
          color: 'danger',
          notificationMessage: 'Your Portfolio is not deleted!'
        });
        setTimeout(function () {
          this.setState({ alertOpen: false });
        }.bind(this), 6000);
      }
      this.handleModalClose("deleteModal");
      this.setState({ portfolio_id: null });
      this.props.deletePortfolioReset();
    }
  }

  render() {
    const { classes, portfolio_info } = this.props;
    const { open } = this.state;
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
                      onClick={() => this.handleClickOpen("deleteModal")}
                      className={classes.dropdownItem}
                    >
                      Delete
                    </MenuItem>
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
                        value: portfolio_info.title,
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
                        onChange: event => this.setState({ description: event.target.value }),
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <DateTimePicker
                      placeholder={"Project Deadline"}
                      value={portfolio_info.project_deadline}
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
                        value: portfolio_info.budget,
                        onChange: event => this.setState({ budget: event.target.value })
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
              onClick={event => this.handleEditPortfolio(event)}
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
            <h5>Are you sure you want to delete "{portfolio_info.title}"?</h5>
          </DialogContent>
          <DialogActions
            className={classes.modalFooter + " " + classes.modalFooterCenter}>
            <Button
              onClick={() => this.handleModalClose("deleteModal")}
            >
              No
        </Button>
            <Button
              onClick={event => this.handleDeletePortfolio(event)}
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
    tryPutPortfolio: (portfolio_id, title, description, date, project_id) => dispatch(tryPutPortfolio(portfolio_id, title, description, date, project_id)),
    postPortfolioReset: () => dispatch(postPortfolioReset()),
    tryDeletePortfolio: (portfolio_id) => dispatch(tryDeletePortfolio(portfolio_id)),
    deletePortfolioReset: () => dispatch(deletePortfolioReset())
  };
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  bindAction
)(withStyles(combinedStyles)(PortfolioDropdown));