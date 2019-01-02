import React from "react";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
// core components
import Card from "material-kit-react/components/Card/Card";
import CardBody from "material-kit-react/components/Card/CardBody";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardFooter from "material-kit-react/components/Card/CardFooter";
import ProjectDropdown from "components/DropDown/ProjectDropdown"
import Badge from 'components/Badge/Badge';
import Tooltip from "@material-ui/core/Tooltip";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "material-dashboard-react/dist/components/Snackbar/Snackbar";

import default_image from "assets/img/faces/default_image.png";
import {Link} from "react-router-dom";

import imagesStyles from "material-kit-react/assets/jss/material-kit-react/imagesStyles";

import {cardTitle} from "material-kit-react/assets/jss/material-kit-react";

import Button from "material-kit-react/components/CustomButtons/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import GridContainer from "material-dashboard-react/dist/components/Grid/GridContainer";
import GridItem from "material-dashboard-react/dist/components/Grid/GridItem";
import CustomInput from "components/CustomInput/CustomInput";
import { Close } from '@material-ui/icons';
import combineStyles from "services/combineStyles";

import modalStyle from "material-kit-react/assets/jss/material-kit-react/modalStyle";

import connect from "react-redux/es/connect/connect";

import { tryRateProject, rateProjectReset } from "redux/project/Actions.js";


const style = {
    ...imagesStyles,
    cardTitle,
    textMuted: {
        color: "#6c757d"
    },
};

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class ProjectCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            rateModal: false,
            cardAnimaton: "cardHidden",
            alertOpen: false,
            place: 'tr',
            notificationMessage: '',
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

    handleRateProject(event) {
        const { comment, value } = this.state;
        this.props.tryRateProject(this.props.project_id, comment, parseFloat(value));
        this.setState({ project_id: this.props.project_id });
        event.preventDefault();
    }

    handleToUpdate(project, type) {
        this.props.handleToUpdate(project, type);
    }

    componentDidUpdate(prevProps, prevState) {
        const { rateProjectInProgress, rateProjectHasError, rateProjectCompleted, response } = this.props.project;
        if (!rateProjectInProgress && !rateProjectHasError && rateProjectCompleted && this.state.project_id === this.props.project_id) {
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
    }

    render() {
        const { classes, project_id, title, description, project_deadline, budget, created_at, owner, is_freelancer, owned, status, milestones, tags, link } = this.props;
        const project = {
            project_id,
            title,
            description,
            project_deadline,
            budget,
            created_at,
            status,
            owner,
            milestones
        };
        let descriptionText = description;
        if (descriptionText.length > 25) {
            descriptionText = descriptionText.substring(0, 200) + "...";
        }
        let tagsList;
        
        tagsList = tags.map((prop, key) => {
            return (
                <Tooltip
                    title={prop.description}
                    placement="top"
                    classes={{ tooltip: classes.tooltip }}
                >
                    <Button fontSize={"16px"} color="success">{prop.label}</Button>
                </Tooltip>
            );
        });
        let cardHeader, badgesStatus;;
        if (owned === true) {
            if (status === -1) {
                badgesStatus = <Badge fontSize={"12px"} color="danger">discarded</Badge>;
            } else if (status === 0) {
                badgesStatus = <Badge fontSize={"12px"} color="warning">bidding</Badge>;
            } else if (status === 1) {
                badgesStatus = <Badge fontSize={"12px"} color="rose">bid accepted</Badge>;
            } else if (status === 2) {
                badgesStatus = <Badge fontSize={"12px"} color="success">completed</Badge>;
            }
            cardHeader = <Grid container>
                <Grid item xs={6} style={{ paddingTop: "3%"}}>
                    {badgesStatus}
                </Grid>
                <Grid item xs={6} style= {{textAlign: "right"}}>
                    <ProjectDropdown project_info={project} handleToUpdate={this.handleToUpdate.bind(this)}/>
                </Grid>
            </Grid>;
        } else if (is_freelancer === true) {
            let finished = '';
            if (status === -1) {
                badgesStatus = <Badge fontSize={"12px"} color="danger">discarded</Badge>;
            } else if (status === 0) {
                badgesStatus = <Badge fontSize={"12px"} color="warning">bidding</Badge>;
            } else if (status === 1) {
                badgesStatus = <Badge fontSize={"12px"} color="rose">bid accepted</Badge>;
            } else if (status === 2) {
                finished = <Grid item xs={6} style={{ textAlign: "right" }}>
                    <Button variant="fab" mini color="success" aria-label="Add"
                        onClick={() => this.handleClickOpen("rateModal")}>
                        Rate
                    </Button>
                </Grid>;
                badgesStatus = <Badge fontSize={"12px"} color="success">completed</Badge>;
            }
            cardHeader = <Grid container>
                <Grid item xs={6} style={{ paddingTop: "3%" }}>
                    {badgesStatus}
                </Grid>
                {finished}
            </Grid>;
        } else {
            cardHeader = <Link to={"/home/users/" + owner.id + "/"} style={{ color: "white" }}>
                <div style={{
                    display: 'flex',
                }}>
                    <Avatar style={{ marginRight: 10 }}
                        src={process.env.REACT_APP_API_STATIC_URL + "profile_images/" + owner.profile_image}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = default_image
                        }} alt="..." />
                    <h5><b>{owner.full_name}</b></h5>
                </div>
            </Link>;
        }
        return (
            <div>
                <Card style={{width: "100%"}}>
                    <CardHeader color={"info"}>
                        {cardHeader}
                    </CardHeader>
                    <CardBody>
                        <Link to={link || "/home/projects/"+ project_id +"/"} style={{color: "black"}}>
                            <h4 className={classes.cardTitle}>{title}</h4>
                            <p>{descriptionText}</p>
                            <p align="right">
                                <b>Budget: </b> {budget}$<br/>
                                <b>Deadline: </b> {project_deadline}<br/>
                                <b>Created At:</b> {created_at}
                            </p>
                        </Link>
                    </CardBody>
                    <CardFooter className={classes.textMuted} style={{flexWrap: "wrap"}}>{tagsList}</CardFooter>
                </Card>
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
const combinedStyles = combineStyles(style, modalStyle);


function bindAction(dispatch) {
    return {
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
)(withStyles(combinedStyles)(ProjectCard));