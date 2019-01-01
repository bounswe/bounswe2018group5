import React from "react";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from '@material-ui/core/Grid';
import Badge from 'components/Badge/Badge';
// core components
import Card from "material-kit-react/components/Card/Card";
import CardBody from "material-kit-react/components/Card/CardBody";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CallMade from "@material-ui/icons/CallMade";

import Paper from '@material-ui/core/Paper';
import Button from "material-kit-react/components/CustomButtons/Button";

import PortfolioDropdown from "components/DropDown/PortfolioDropdown"

import imagesStyles from "material-kit-react/assets/jss/material-kit-react/imagesStyles";

import {cardTitle} from "material-kit-react/assets/jss/material-kit-react";

import { getCookie, TOKEN_COOKIE } from "services/cookies";

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

const style = {
    ...imagesStyles,
    cardTitle,
    textMuted: {
        color: "#6c757d"
    },
};

class PortfolioCard extends React.Component {
    handleToUpdate(portfolio, type) {
        this.props.handleToUpdate(portfolio, type);
    }
    render() {
        const { classes, portfolio_id, title, description, date, project_id, attachments, owned, tags } = this.props;
        const portfolio = {
            portfolio_id,
            title,
            description,
            date,
            project_id,
            attachments
        };
        let tagsList;

        tagsList = tags.map((prop, key) => {
            return (
                <Badge fontSize={"12px"} color="success">{prop.label}</Badge>
            );
        });
        let cardHeader;
        if (owned === true) {
            cardHeader = <Grid item xs={3} style={{ textAlign: "right" }}>
                <PortfolioDropdown portfolio_info={portfolio} handleToUpdate={this.handleToUpdate.bind(this)} />
            </Grid>;
        } else {
            cardHeader = '';
        }
        let attachmentsBox;
        if (owned === true) {
            attachmentsBox = <Grid item xs={12}>
                <p><b>Attachments</b></p>
                <FilePond
                    className="filepond"
                    name={"attachments"}
                    instantUpload={false}
                    allowMultiple={false}
                    maxFileSize={"20MB"}
                    server={{
                        url: process.env.REACT_APP_API_URL,
                        process: {
                            url: './api/attachment/?id=' + portfolio_id,
                            method: 'POST',
                            headers: {
                                Authorization: getCookie(TOKEN_COOKIE)
                            },
                            timeout: 7000,
                            onload: null,
                            onerror: null
                        },
                        restore: {
                            url: "./media/attachments/" + portfolio_id + "/"
                        },
                        revert: {
                            url: './api/attachment/?id=' + portfolio_id,
                            headers: {
                                Authorization: getCookie(TOKEN_COOKIE)
                            },
                        }
                    }}

                    labelIdle={`Drag & Drop your attachment or <span class="filepond--label-action">Browse</span>`}
                    acceptedFileTypes={"application/x-gzip, application/x-compressed, application/zip, application/x-zip-compressed, multipart/x-zip"}
                >
                    {attachments.map(file => (
                        <File key={file} id={file} src={file} origin="limbo" />
                    ))}
                </FilePond>
            </Grid>;
        } else {
            attachmentsBox = <Grid item xs={12}>
                <p><b>Attachments</b></p>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '80%' }}>Attachhment Name</TableCell>
                                <TableCell style={{ width: '20%' }}>Attachment Link</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attachments.map(file => (
                                <TableRow key={file}>
                                    <TableCell>{file}</TableCell>
                                    <TableCell>
                                        <Button
                                            color="github" simple
                                            justIcon
                                            href={process.env.REACT_APP_API_URL + "media/attachments/" + portfolio_id + "/" + file}
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
            </Grid>
        }
        return (
            <Card style={{width: "100%"}}>
                <CardBody>
                    <Grid container>
                        <Grid item xs={9}>
                            <h4 className={classes.cardTitle}>{title}</h4>
                        </Grid>
                        {cardHeader}
                        <Grid item xs={12}>
                            {tagsList}
                            <p>{description}</p>
                        </Grid>
                        {attachmentsBox}
                    </Grid>
                </CardBody>
            </Card>
        );
    }
}

export default withStyles(style)(PortfolioCard);