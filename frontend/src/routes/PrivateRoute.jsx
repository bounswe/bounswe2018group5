import React, { Component} from "react";
import {Route, Redirect} from "react-router-dom";
import {getCookie, removeCookie, LOGGEDIN_COOKIE, TOKEN_COOKIE} from "services/cookies";
import connect from "react-redux/es/connect/connect";
import { tryGetProfile } from "redux/user/Actions.js";
import { logout } from "redux/auth/Actions.js";

class PrivateRoute extends Component {
    componentDidMount() {
        this.props.tryGetProfile();
    }

    componentDidUpdate(prevProps, prevState) {
        const { history } = this.props;
        const { getProfileInProgress, getProfileHasError, getProfileCompleted, response } = this.props.user;

        if (!getProfileInProgress && !getProfileHasError && getProfileCompleted && !response) {
            removeCookie(TOKEN_COOKIE, { path: "/" });
            removeCookie(LOGGEDIN_COOKIE, { path: "/" });
            this.props.logout();
            history.push("/");
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