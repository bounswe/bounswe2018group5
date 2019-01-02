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
import SearchIcon from '@material-ui/icons/Search';
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

import { tryGetTag, getTagReset } from "redux/project/Actions.js";

import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.

import Select from 'react-select';


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
            titleError: false,
            selectHidden: true,
            description: '', 
            date: '', 
            project_id: null,
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
        this.props.handleToLinkedIn();
    }

    handleCreatePortfolio(event) {
        const { title, description, date, project_id, options_tags } = this.state;
        if (title === ''){
            this.setState({
                titleError: true,
            });
        } else {
            let options = [];
            options_tags.map((prop, key) => {
                options.push(prop.value);
                return null;
            });
            this.props.tryPostPortfolio(title, description, date, project_id, options);
        }
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
                this.setState({ options, selectHidden: false, });
            }
            this.props.getTagReset();
        }

        let currentPosition = this.props.currentPosition;

        if (currentPosition) {
            this.setState({
                title: currentPosition.title + ' at ' + currentPosition.company.name,
                description: currentPosition.company.industry + '; ' + currentPosition.location.name + '; since ' + currentPosition.startDate.month + ', ' + currentPosition.startDate.year,
                modal: true
            });
            this.props.handleToLinkedIn();
        }
    }

    handleTagsChange(tags) {
        this.setState({ tags })
    }

    searchTags = (e) => {
        const { tags } = this.state;
        if (tags.length > 0) {
            this.props.tryGetTag(tags.join(','));
            this.setState({
                selectHidden: true,
            });
        }
    }

    render() {
        const { classes } = this.props;
        
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
                                                error: this.state.titleError,
                                                value: this.state.title,
                                                onFocus: event => this.setState({ titleError: false }),
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
                                                value: this.state.description,
                                                onChange: event => this.setState({description: event.target.value})
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12}>
                                        Portfolio Finish Date
                                        <DateTimePicker
                                            before={true}
                                            onChange={event => this.setState({date: event})}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12} style={{marginTop: "16px", marginBottom: "16px"}}>
                                        Search Semantic Tags
                                    </GridItem >
                                    <GridItem xs={12} sm={12} md={10} >
                                        <TagsInput inputProps={{ placeholder: "Search tags" }} value={this.state.tags} onChange={this.handleTagsChange} />
                                        Hint: Press enter or tab to add a tag
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={2}>
                                        <Button variant="contained" color="primary" onClick={this.searchTags} disabled={this.state.tags.length === 0}>
                                            <SearchIcon className={classes.rightIcon} />
                                        </Button>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={12} hidden={this.state.selectHidden} style={{ marginTop: "16px", marginBottom: "16px" }}>
                                        Result Semantic Tags
                                    </GridItem >
                                    <GridItem xs={12} sm={12} md={12} hidden={this.state.selectHidden}>
                                        <Select
                                            isMulti
                                            name="tags"
                                            options={this.state.options}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            onChange={(val) => { this.setState({ options_tags: val }) }}
                                        />
                                    </GridItem>
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
        tryPostPortfolio: (title, description, date, project_id, tags) => dispatch(tryPostPortfolio(title, description, date, project_id, tags)),
        postPortfolioReset: () => dispatch(postPortfolioReset()),
        tryGetTag: (tags) => dispatch(tryGetTag(tags)),
        getTagReset: () => dispatch(getTagReset())
    };
}

const mapStateToProps = state => ({
    user: state.user,
    project: state.project
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(modalStyle)(AddPortfolioModal));