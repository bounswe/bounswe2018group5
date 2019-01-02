import React, { Component} from "react";
import {Route, Redirect} from "react-router-dom";
import { getCookie, setCookie, removeCookie, LOGGEDIN_COOKIE, TOKEN_COOKIE, LOGGEDIN_USERID_COOKIE } from "services/cookies";
import connect from "react-redux/es/connect/connect";
import { tryGetProfile, profileReset } from "redux/user/Actions.js";
import { logout } from "redux/auth/Actions.js";

class PrivateRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: false
        };
    }

    componentDidMount() {
        this.props.tryGetProfile();
    }

    componentDidUpdate(prevProps, prevState) {
        const { history } = this.props;
        const { getProfileInProgress, getProfileHasError, getProfileCompleted, response, user} = this.props.user;

        if (!getProfileInProgress && !getProfileHasError && getProfileCompleted) {
            if(!response) {
                removeCookie(TOKEN_COOKIE);
                removeCookie(LOGGEDIN_COOKIE);
                removeCookie(LOGGEDIN_USERID_COOKIE);
                this.props.logout();
                history.push("/login");
            } else {
                setCookie(LOGGEDIN_USERID_COOKIE, user.id, { path: "/" });
                this.setState({ response: true });
            }
            this.props.profileReset();
        }
    }

    render() {
        const loggedIn = getCookie(LOGGEDIN_COOKIE);
        if (!loggedIn) {
            return <Redirect to={'/login'} />
        } else {
            return (
                <Route
                    exact={this.props.exact}
                    path={this.props.path}
                    component={this.props.component}
                />
            );
        }
    }
}

function bindAction(dispatch) {
    return {
        tryGetProfile: () => dispatch(tryGetProfile()),
        profileReset: () => dispatch(profileReset()),
        logout: () => dispatch(logout()),
    };
}

const mapStateToProps = state => ({
    user: state.user,
    auth: state.auth
});


export default connect(
    mapStateToProps,
    bindAction
)(PrivateRoute);