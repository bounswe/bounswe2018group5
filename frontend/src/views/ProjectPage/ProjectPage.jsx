import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Chip from "@material-ui/core/Chip/Chip.js"

import Helmet from 'react-helmet';
import Badge from 'components/Badge/Badge';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Divider from '@material-ui/core/Divider';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import CallMade from "@material-ui/icons/CallMade";
import Card from "material-dashboard-react/dist/components/Card/Card";
import CardFooter from "material-dashboard-react/dist/components/Card/CardFooter";
import Button from "material-kit-react/components/CustomButtons/Button";

import BidDropdown from "components/DropDown/BidDropdown"
import combineStyles from "services/combineStyles";

import CardAvatar from "material-dashboard-react/dist/components/Card/CardAvatar";
import CardBody from "material-dashboard-react/dist/components/Card/CardBody";
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import CreateBidModal from "components/Modal/CreateBidModal";
import MessageCard from "components/Card/MessageCard";
import { getCookie, LOGGEDIN_USERID_COOKIE, TOKEN_COOKIE } from "services/cookies";

import tooltipStyle from "material-kit-react/assets/jss/material-kit-react/tooltipsStyle";

import Paper from '@material-ui/core/Paper';
import { Link } from "react-router-dom";

import {
    tryGetProject,
    getProjectReset
} from "redux/project/Actions.js";

import connect from "react-redux/es/connect/connect";
import default_image from "assets/img/faces/default_image.png";

// Import React FilePond
import { FilePond, registerPlugin, File } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';


// We register the plugins required to do 
// image previews, cropping, resizing, etc.
registerPlugin(
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
);

const styles = {
    
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    }
};

class ProjectPage extends Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            expanded: false,
            cardAnimaton: "cardHidden",
            project: {
                owner: {},
                bids: [],
                attachments: [],
                freelancer: {},
                tags: []
            },
        };
    }
    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    componentDidMount() {
        const { project_id } = this.props.match.params;
        this.props.tryGetProject(project_id);
    }

    componentDidUpdate(prevProps, prevState) {
        const { getProjectInProgress, getProjectHasError, getProjectCompleted, project } = this.props.project;

        if (!getProjectInProgress && !getProjectHasError && getProjectCompleted) {
            const bids = project.bids.sort(function(a, b) {
                return parseFloat(a.status) - parseFloat(b.status);
            });
            const freelancer = project.freelancer || {};
            const attachments = project.attachments || [];
            const tags = project.tags || [];
            var current_project = { ...project, bids: bids, freelancer: freelancer, attachments: attachments, tags: tags };
            this.setState({ project: current_project });

            this.props.getProjectReset();
        }
    }

    render() {
        const { classes } = this.props;
        const user_id = getCookie(LOGGEDIN_USERID_COOKIE);

        let createBid, sendMessage;
        if (user_id === this.state.project.owner.id) {
            createBid = sendMessage = '';
        } else {
            createBid = <CreateBidModal project_id={this.state.project.project_id}></CreateBidModal>;
            sendMessage = <MessageCard projectOwner="Mete Kocaman"></MessageCard>;
        }

        let userBox, attachmentBox;

        if (this.state.project.owner.id === user_id) {
            userBox = <GridItem xs={12} sm={12} md={12}>
                <h2 className={classes.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: "black" }}>Project Freelancer</h2>
                <br />
                <Card profile>
                    <CardAvatar profile>
                        <img src={process.env.REACT_APP_API_STATIC_URL + "profile_images/" + this.state.project.freelancer.profile_image}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = default_image
                            }} alt="..." />
                    </CardAvatar>
                    <CardBody profile>
                        <h4>{this.state.project.freelancer.full_name}</h4>
                        <h6 className={classes.title}>{this.state.project.freelancer.bio}</h6>
                    </CardBody>
                    <CardFooter>
                        {sendMessage}
                    </CardFooter>
                </Card>
            </GridItem>;
            attachmentBox = <GridItem xs={12} sm={12} md={12}>
                <h2 className={classes.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: "black" }}>Project Attachments</h2>
                <FilePond
                    className="filepond"
                    name={"attachments"}
                    instantUpload={false}
                    allowMultiple={true}
                    maxFiles={5} 
                    maxFileSize={"10MB"} 
                    server={{
                        url: process.env.REACT_APP_API_URL,
                        process: {
                            url: './api/attachment/?id=' + this.state.project.project_id,
                            method: 'POST',
                            headers: {
                                Authorization: getCookie(TOKEN_COOKIE)
                            },
                            timeout: 7000,
                            onload: null,
                            onerror: null
                        },
                        restore: {
                            url: "./media/attachments/" + this.state.project.project_id + "/"
                        },
                        revert: {
                            url: './api/attachment/?id=' + this.state.project.project_id,
                            headers: {
                                Authorization: getCookie(TOKEN_COOKIE)
                            },
                        }
                    }}

                    labelIdle={`Drag & Drop your attachments or <span class="filepond--label-action">Browse</span> max 5 files`}
                    acceptedFileTypes={"image/png, image/jpeg, application/pdf, application/x-gzip, application/x-compressed, application/zip, application/x-zip-compressed, multipart/x-zip"}
                >
                    {this.state.project.attachments.map(file => (
                        <File key={file} id={file} src={file} origin="limbo" />
                    ))}
                </FilePond>
            </GridItem>;
        } else {
            attachmentBox = <GridItem xs={12} sm={12} md={12}>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '80%' }}>Attachhment Name</TableCell>
                                <TableCell style={{ width: '20%' }}>Attachment Link</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.project.attachments.map(file => (
                                <TableRow key={file}>
                                    <TableCell>{file}</TableCell>
                                    <TableCell>
                                        <Button
                                            color="github" simple
                                            justIcon
                                            href={process.env.REACT_APP_API_URL + "media/attachments/" + this.state.project.project_id + "/" + file}
                                            target="_blank"
                                            className={classes.buttonLink}
                                        >
                                            <CallMade />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </GridItem>;
            userBox = <GridItem xs={12} sm={12} md={12}>
                <h2 className={classes.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: "black" }}>Project Owner</h2>
                <br />
                <Card profile>
                    <CardAvatar profile>
                        <img src={process.env.REACT_APP_API_STATIC_URL + "profile_images/" + this.state.project.owner.profile_image}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = default_image
                            }} alt="..." />
                    </CardAvatar>
                    <CardBody profile>
                        <h4>{this.state.project.owner.full_name}</h4>
                        <h6 className={classes.title}>{this.state.project.owner.bio}</h6>
                    </CardBody>
                    <CardFooter>
                        {sendMessage}
                    </CardFooter>
                </Card>
            </GridItem>;
        }

        let tableCol1, tableCol2, tableCol3, tableCol4;
        if (user_id === this.state.project.owner.id) {
            tableCol1 = <TableCell>Note</TableCell>;
            tableCol2 = <TableCell>Actions</TableCell>;
            tableCol3 = <TableCell>Status</TableCell>;
            tableCol4 = <TableCell>Go Profile</TableCell>;
        } else {
            tableCol1 = "";
            tableCol2 = "";
            tableCol3 = "";
            tableCol4 = "";
        }

        var bids = (
            <TableBody>
                {this.state.project.bids.map((prop, key) => {
                    let cell1, cell2, cell3, color, tooltip, accepted, cell4;
                    accepted = false;
                    if (user_id === this.state.project.owner.id) {
                        cell1 = <TableCell>{prop.note}</TableCell>;
                        cell2 = <TableCell><BidDropdown bid_info={prop} /></TableCell>;
                        if (prop.status === -1) {
                            color = "#d9534f";
                            tooltip = "Bid Discarded!";
                        } else if (prop.status === 0) {
                            color = "#5bc0de";
                            tooltip = "Bid Period!";
                        } else if (prop.status === 1) {
                            color = "#5cb85c";
                            tooltip = "Bid Accepted!";
                            accepted = true;
                        } else if (prop.status === 2) {
                            color = "#f0ad4e";
                            tooltip = "Bid do not Accepted!";
                        }

                        cell3 = <TableCell>
                            <Tooltip
                                id="tooltip-top"
                                title={tooltip}
                                placement="top"
                                classes={{ tooltip: classes.tooltip }}
                            >
                                <FiberManualRecord style={{ color: color }} />
                            </Tooltip>
                        </TableCell>;
                        cell4 = <TableCell>
                            <Button
                                color="github" simple
                                justIcon
                                component={Link} to={"/home/users/" + prop.freelancer.id + "/"}
                                className={classes.buttonLink}
                            >
                                <CallMade />
                            </Button>
                        </TableCell>;
                    } else {
                        cell1 = "";
                        cell2 = "";
                        cell3 = "";
                        cell4 = "";
                    }

                    return (
                        <TableRow key={key} selected={accepted}>
                            <TableCell component="th" scope="row" numeric>
                                {prop.offer}$
                                </TableCell>
                            <TableCell>{prop.freelancer.full_name}</TableCell>
                            <TableCell numeric>{prop.freelancer.avg_rating}</TableCell>
                            {cell1}
                            {cell3}
                            {cell2}
                            {cell4}
                        </TableRow>
                    );
                })}
            </TableBody>
        );

        let milestoneBidContainer;

        if (this.state.project.status >= 1) {
            if (this.state.project.owner.id === user_id) {
                milestoneBidContainer = <GridItem xs={12} sm={12} md={12}>
                    <h2 className={classes.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: "black" }}>Milestones</h2>
                    <Paper className={classes.root} style={{padding: "32px"}}>
                        {this.state.project.milestones.map((prop, key) => {
                            return (
                                <div>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={8}><h3>{prop.name}</h3></GridItem>
                                        <GridItem xs={12} sm={12} md={4}><h3 style={{textAlign: "right"}}>{prop.deadline}</h3></GridItem>
                                    </GridContainer>
                                    
                                    <h5>{prop.detail}</h5>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ width: '80%' }}>Attachhment Name</TableCell>
                                                <TableCell style={{ width: '20%' }}>Attachment Link</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {prop.attachments.map(file => (
                                                <TableRow key={file}>
                                                    <TableCell>{file}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            color="github" simple
                                                            justIcon
                                                            href={process.env.REACT_APP_API_URL + "media/attachments/" + this.state.project.project_id + "/" + file}
                                                            target="_blank"
                                                            className={classes.buttonLink}
                                                        >
                                                            <CallMade />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <br />
                                    <Divider />
                                </div>
                            )
                        })}
                    </Paper>
                </GridItem>;
            } else if (this.state.project.freelancer.id === user_id) {
                milestoneBidContainer = <GridItem xs={12} sm={12} md={12}>
                    <h2 className={classes.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: "black" }}>Milestones</h2>
                    <Paper className={classes.root} style={{ padding: "32px" }}>
                        {this.state.project.milestones.map((prop, key) => {
                            return (
                                <div>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={8}><h3>{prop.name}</h3></GridItem>
                                        <GridItem xs={12} sm={12} md={4}><h3 style={{ textAlign: "right" }}>{prop.deadline}</h3></GridItem>
                                    </GridContainer>

                                    <h5>{prop.detail}</h5>
                                    <FilePond
                                        className="filepond"
                                        name={"attachments"}
                                        instantUpload={false}
                                        allowMultiple={false}
                                        maxFileSize={"20MB"}
                                        server={{
                                            url: process.env.REACT_APP_API_URL,
                                            process: {
                                                url: './api/attachment/?id=' + prop.id,
                                                method: 'POST',
                                                headers: {
                                                    Authorization: getCookie(TOKEN_COOKIE)
                                                },
                                                timeout: 7000,
                                                onload: null,
                                                onerror: null
                                            },
                                            restore: {
                                                url: "./media/attachments/" + prop.id + "/"
                                            },
                                            revert: {
                                                url: './api/attachment/?id=' + prop.id,
                                                headers: {
                                                    Authorization: getCookie(TOKEN_COOKIE)
                                                },
                                            }
                                        }}

                                        labelIdle={`Drag & Drop your attachment or <span class="filepond--label-action">Browse</span>`}
                                        acceptedFileTypes={"application/x-gzip, application/x-compressed, application/zip, application/x-zip-compressed, multipart/x-zip"}
                                    >
                                        {prop.attachments.map(file => (
                                            <File key={file} id={file} src={file} origin="limbo" />
                                        ))}
                                    </FilePond>
                                    <br />
                                    <Divider />
                                </div>
                            )
                        })}
                    </Paper>
                </GridItem>;
            }
        } else {
            milestoneBidContainer = <GridItem xs={12} sm={12} md={12}>
                <h2 className={classes.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: "black" }}>Bids</h2>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Suggested Price</TableCell>
                                <TableCell>Bid Owner</TableCell>
                                <TableCell numeric>Bid Owner's Rate</TableCell>
                                {tableCol1}
                                {tableCol3}
                                {tableCol2}
                                {tableCol4}
                            </TableRow>
                        </TableHead>
                        {bids}
                    </Table>
                    <br />
                    {createBid}
                </Paper>
            </GridItem>;
        }

        let tagsList;

        tagsList = this.state.project.tags.map((prop, key) => {
            return (
                <Badge fontSize={"12px"} color="success">{prop.label}</Badge>
            );
        });

        return (
            <div>
                <div>
                    <Helmet
                        title='Project Page'
                        meta={[
                            { property: 'og:title', content: 'Project Page' },
                        ]} />
                </div>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <h1 className={classes.title}>{this.state.project.title}</h1>
                                <Paper className={classes.root} style={{ padding: "32px" }}>
                                    {tagsList}
                                    <h4>
                                        {this.state.project.description}
                                    </h4>
                                    <br />
                                    <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%' }}>
                                        <Chip label={"Budget: $" + this.state.project.budget} className={classes.chip} />
                                        <Chip label={"Deadline: " + this.state.project.deadline} className={classes.chip} />
                                    </div>
                                </Paper>
                            </GridItem>
                            {milestoneBidContainer}
                        </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <GridContainer>
                                    {userBox}
                                </GridContainer>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                                <GridContainer>
                                    {attachmentBox}
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

const combinedStyles = combineStyles(tooltipStyle, styles);

function bindAction(dispatch) {
    return {
        tryGetProject: (project_id) => dispatch(tryGetProject(project_id)),
        getProjectReset: () => dispatch(getProjectReset()),
    };
}

const mapStateToProps = state => ({
    project: state.project
});

export default connect(
    mapStateToProps,
    bindAction
)(withStyles(combinedStyles)(ProjectPage));
