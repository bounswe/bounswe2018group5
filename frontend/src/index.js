import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store, history } from "redux/configureStore.js";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

import LandingPage from "views/LandingPage/LandingPage.jsx";
import HomeLayout from "layouts/Home/Home.jsx";
import RegisterPage from "views/RegisterPage/RegisterPage.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";
import GuestProjectsPage from "views/ProjectsPage/GuestProjectsPage.jsx";
import GuestProjectPage from "views/ProjectPage/GuestProjectPage.jsx";
import GuestSearchProjectsPage from "views/ProjectsPage/GuestSearchProjectsPage.jsx";

import "material-kit-react/material-kit-react.css";
import PrivateRoute from "routes/PrivateRoute";

class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/' exact component={LandingPage} />;
                <Route path='/register' exact component={RegisterPage} />;
                <Route path='/login' exact component={LoginPage} />;
                <Route path='/browse' exact component={GuestProjectsPage} />;

                <Route path='/browse/:project_id' exact component={GuestProjectPage} />;

                <Route path='/browse/search/:query' exact component={GuestSearchProjectsPage} />;

                <PrivateRoute history={history} path='/home' component={HomeLayout} />
            </Switch>
        );
    }
}

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root")
);