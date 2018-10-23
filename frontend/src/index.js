import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";


import LandingPage from "views/LandingPage/LandingPage.jsx";
import HomePage from "layouts/Home/Home.jsx";


import "material-kit-react/material-kit-react.css";

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route path='/' exact component={LandingPage} />;
            <Route path='/home' exact component={HomePage} />;
            <Route path='/register' exact component={HomePage} />;
        </Switch>
    </BrowserRouter>,
    document.getElementById("root")
);