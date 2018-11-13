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

import default_image from "assets/img/faces/default_image.png";
import {Link} from "react-router-dom";

import imagesStyles from "material-kit-react/assets/jss/material-kit-react/imagesStyles";

import {cardTitle} from "material-kit-react/assets/jss/material-kit-react";

const style = {
    ...imagesStyles,
    cardTitle,
    textMuted: {
        color: "#6c757d"
    },
};

class ProjectCard extends React.Component {
    render() {
        const {classes, project_id, title, description, project_deadline, budget, created_at, owner, owner_id, owned, status} = this.props;
        const project = {
            project_id,
            title,
            description,
            project_deadline,
            budget,
            created_at,
            status,
            owner
        };
        let cardHeader;
        let badgesStatus;
        if (status === -1) {
            badgesStatus = <Badge fontSize={"12px"} color="danger">discarded</Badge>;
        } else if (status === 0) {
            badgesStatus = <Badge fontSize={"12px"} color="warning">bidding</Badge>;
        } else if (status === 1) {
            badgesStatus = <Badge fontSize={"12px"} color="rose">bid accepted</Badge>;
        } else if (status === 2) {
            badgesStatus = <Badge fontSize={"12px"} color="success">completed</Badge>;
        }
        if (owned === true) {
            cardHeader = <Grid container>
                <Grid item xs={6} style={{ paddingTop: "3%"}}>
                    {badgesStatus}
                </Grid>
                <Grid item xs={6} style= {{textAlign: "right"}}>
                    <ProjectDropdown project={project} />
                </Grid>
            </Grid>;
        } else {
            cardHeader = <Link to={"/home/users/" + owner_id + "/"} style={{ color: "white" }}>
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
            <Card style={{width: "100%"}}>
                <CardHeader color={"info"}>
                    {cardHeader}
                </CardHeader>
                <CardBody>
                    <Link to={"/home/projects/"+ project_id +"/"} style={{color: "black"}}>
                        <h4 className={classes.cardTitle}>{title}</h4>
                        <p>{description}</p>
                        <p align="right">
                            <b>Budget: </b> {budget}$<br/>
                            <b>Deadline: </b> {project_deadline}<br/>
                            <b>Created At:</b> {created_at}
                        </p>
                    </Link>
                </CardBody>
                {/* <CardFooter className={classes.textMuted}>tags</CardFooter> */}
            </Card>
        );
    }
}

export default withStyles(style)(ProjectCard);