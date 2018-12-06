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
import {tryPostPortfolio, postPortfolioReset} from "redux/user/Actions.js";


function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class AddPortfolioModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            cardAnimaton: "cardHidden",
            open: false,
            place: 'tr',
            notificationMessage: '',
            title: '', 
            description: '', 
            date: null, 
            project_id: null
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

    handleCreatePortfolio(event) {
        const {title, description, date, project_id} = this.state;
        this.props.tryPostPortfolio(title, description, date, project_id);
        event.preventDefault();
    }

    componentDidUpdate(prevProps, prevState) {
        const {postPortfolioInProgress, postPortfolioHasError, postPortfolioCompleted, response, portfolio} = this.props.user;
        if (!postPortfolioInProgress && !postPortfolioHasError && postPortfolioCompleted) {
            if (response) {
                this.props.handleToUpdate(portfolio);
                this.setState({
                    open: true,
                    color: 'success',
                    notificationMessage: 'Your Portfolio is successfully created!'
                });
                setTimeout(function () {
                    this.setState({open: false});
                }.bind(this), 6000);
            } else {
                this.setState({
                    open: true,
                    color: 'danger',
                    notificationMessage: 'Your Portfolio is not created!'
                });
                setTimeout(function () {
                    this.setState({open: false});
                }.bind(this), 6000);
            }
            this.handleClose("modal");
            this.props.postPortfolioReset();
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Button variant="fab" mini color="default" aria-label="Add"
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
                        <h4 className={classes.modalTitle}>Add Portfolio</h4>
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
                                            before={true}
                                            placeholder={"Portfolio Finish Date"}
                                            onChange={event => this.setState({date: event.format("YYYY-MM-DD")})}
                                        />
                                    </GridItem>
                                    {/* <GridItem xs={12} sm={12} md={6}>
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
                                    </GridItem> */}
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </DialogContent>
                    <DialogActions
                        className={classes.modalFooter + " " + classes.modalFooterCenter}>
                        <OtherButton
                            onClick={event => this.handleCreatePortfolio(event)}
                            color={'primary'}
                        >
                            Add Portfolio
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
        tryPostPortfolio: (title, description, date, project_id) => dispatch(tryPostPortfolio(title, description, date, project_id)),
        postPortfolioReset: () => dispatch(postPortfolioReset())
    };
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(modalStyle)(AddPortfolioModal));