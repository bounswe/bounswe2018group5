import React, { Component} from "react";
import {Route, Redirect} from "react-router-dom";
import {getCookie, LOGGEDIN_COOKIE} from "services/cookies";

class PrivateRoute extends Component {
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

export default PrivateRoute;