import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Chip from "@material-ui/core/Chip/Chip.js"

import Helmet from 'react-helmet';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import Card from "material-dashboard-react/dist/components/Card/Card";
import CardFooter from "material-dashboard-react/dist/components/Card/CardFooter";

import BidDropdown from "components/DropDown/BidDropdown"

import CardAvatar from "material-dashboard-react/dist/components/Card/CardAvatar";
import CardBody from "material-dashboard-react/dist/components/Card/CardBody";
import GridContainer from "material-kit-react/components/Grid/GridContainer";
import GridItem from "material-kit-react/components/Grid/GridItem";
import CreateBidModal from "components/Modal/CreateBidModal";
import MessageCard from "components/Card/MessageCard";
import { getCookie, LOGGEDIN_USERID_COOKIE, TOKEN_COOKIE } from "services/cookies";

import Paper from '@material-ui/core/Paper';

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
                bids: []
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
            this.setState({ project });
            this.props.getProjectReset();
        }
    }

    render() {
        const { classes } = this.props;
        const user_id = getCookie(LOGGEDIN_USERID_COOKIE);

        let userOrAttachementBox;

        if (this.state.project.owner.id === user_id) {
            userOrAttachementBox = <GridItem xs={12} sm={12} md={12}>
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
            userOrAttachementBox = <GridItem xs={12} sm={12} md={12}>
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
                        <MessageCard projectOwner="Mete Kocaman"></MessageCard>
                    </CardFooter>
                </Card>
            </GridItem>;
        }

        let tableCol1, tableCol2, tableCol3;
        if (user_id === this.state.project.owner.id) {
            tableCol1 = <TableCell>Note</TableCell>;
            tableCol2 = <TableCell>Actions</TableCell>;
            tableCol3 = <TableCell>Status</TableCell>;
        } else {
            tableCol1 = "";
            tableCol2 = "";
            tableCol3 = "";
        }

        var bids = (
            <TableBody>
                {this.state.project.bids.map((prop, key) => {
                    let cell1, cell2, cell3, color;
                    if (user_id === this.state.project.owner.id) {
                        cell1 = <TableCell>{prop.note}</TableCell>;
                        cell2 = <TableCell><BidDropdown bid_info={prop} /></TableCell>;
                        if (prop.status === -1) {
                            color = "#d9534f";
                        } else if (prop.status === 0) {
                            color = "#5bc0de";
                        } else if (prop.status === 1) {
                            color = "#5cb85c";
                        } else if (prop.status === 2) {
                            color = "#f0ad4e";
                        }

                        cell3 = <TableCell><FiberManualRecord style={{color: color}}/></TableCell>;
                    } else {
                        cell1 = "";
                        cell2 = "";
                        cell3 = "";
                    }
                    return (
                        <TableRow key={key}>
                            <TableCell component="th" scope="row" numeric>
                                {prop.offer}$
                            </TableCell>
                            <TableCell>{prop.freelancer.full_name}</TableCell>
                            <TableCell numeric>{prop.rate}</TableCell>
                            {cell1}
                            {cell3}
                            {cell2}
                        </TableRow>
                    );
                })}
            </TableBody>
        );

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
                    <GridItem xs={12} sm={12} md={7}>
                        <GridContainer xs={12} sm={12} md={12}>
                            <GridItem xs={12} sm={12} md={12}>
                                <h1 className={classes.title}>{this.state.project.title}</h1>
                                <Paper className={classes.root} style={{ padding: "32px" }}>
                                    <Chip label="python" clickable className={classes.chip} color="primary" />
                                    <Chip label="backend" clickable className={classes.chip} color="secondary" />
                                    <Chip label="tornado" clickable className={classes.chip} color="primary" />
                                    <Chip label="api" clickable className={classes.chip} color="secondary" />

                                    <h4>
                                        {this.state.project.description}
                                    </h4>
                                    <br />
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                        <Chip label={"Budget: $" + this.state.project.budget} className={classes.chip} />
                                        <Chip label={"Deadline: " + this.state.project.deadline} className={classes.chip} />
                                    </div>
                                </Paper>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={12}>
                                <h2 className={classes.title} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: "black" }}>Bids</h2>
                                <Paper className={classes.root}>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell numeric>Suggested Price</TableCell>
                                                <TableCell>Bid Owner</TableCell>
                                                <TableCell numeric>Bid Owner's Rate</TableCell>
                                                {tableCol1}
                                                {tableCol3}
                                                {tableCol2}
                                            </TableRow>
                                        </TableHead>
                                        {bids}
                                    </Table>
                                    <br />
                                    <CreateBidModal project_id={this.state.project.project_id}></CreateBidModal>
                                </Paper>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={5}>
                        <GridContainer>
                            {userOrAttachementBox}
                        </GridContainer>                       
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}


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
)(withStyles(styles)(ProjectPage));
