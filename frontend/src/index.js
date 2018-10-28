import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store, history } from "redux/configureStore.js";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";

import LandingPage from "views/LandingPage/LandingPage.jsx";
import HomePage from "layouts/Home/Home.jsx";
import RegisterPage from "views/RegisterPage/RegisterPage.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";

import "material-kit-react/material-kit-react.css";
import PrivateRoute from "routes/PrivateRoute";

class App extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/' exact component={LandingPage} />;
                <Route path='/register' exact component={RegisterPage} />;
                <Route path='/login' exact component={LoginPage} />;


                <PrivateRoute path='/home' exact component={HomePage} />;
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