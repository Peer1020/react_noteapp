import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import Editnote from "./edit/Editnote";
import Main from "./main/Main";
import Sidebar from "./sidebar/Sidebar";
import history from './history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" component={Main} />
                    <Route path="/" component={Sidebar} />
                    <Route path="/notes/:id" component={Editnote} />
                </Switch>
            </Router>
        )
    }
}