import React from "react";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import Avatar from '@material-ui/core/Avatar';
// core components
import Card from "material-kit-react/components/Card/Card";
import CardBody from "material-kit-react/components/Card/CardBody";
import CardHeader from "material-kit-react/components/Card/CardHeader";
import CardFooter from "material-kit-react/components/Card/CardFooter";

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
        const {classes, project_id, title, description, project_deadline, budget, created_at, owner, owner_id} = this.props;
        return (
            <Card style={{width: "100%"}}>
                <CardHeader color={"success"}>
                    <Link to={"/home/users/"+ owner_id +"/"} style={{color: "white"}}>
                        <div style={{
                            display: 'flex',
                        }}>
                            <Avatar style={{marginRight: 10}}
                                src={ process.env.REACT_APP_API_STATIC_URL + "profile_images/" + owner.profile_image }
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = default_image
                                }} alt="..."/>
                            <h5><b>{owner.full_name}</b></h5>
                        </div>
                    </Link>
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