/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import {Link} from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';

// @material-ui/icons
import {Apps, CloudDownload} from "@material-ui/icons";
import SearchIcon from '@material-ui/icons/Search';

// core components
import CustomInput from "material-kit-react/components/CustomInput/CustomInput";
import Button from "material-kit-react/components/CustomButtons/Button";

import headerLinksStyle from "material-kit-react/assets/jss/material-kit-react/components/headerLinksStyle";

const newHeaderLinksStyle = theme => ({
    ...headerLinksStyle(theme),
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        marginTop: 8,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    }
});

function HeaderLinks({...props}) {
    const {classes} = props;
    return (
        <List className={classes.list}>
            <ListItem className={classes.listItem} alignSelf='center'>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div>
                    <InputBase
                        placeholder="Search Projects…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                    />
                </div>
            </ListItem>
            <ListItem className={classes.listItem} alignSelf='center'>
                <Link to="login" className={classes.link}>
                    <Button color="rose" size="small" round>
                        Login
                    </Button>
                </Link>
            </ListItem>
        </List>
    );
}

export default withStyles(newHeaderLinksStyle)(HeaderLinks);