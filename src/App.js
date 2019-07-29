import React from 'react';
import { Router, Route, Switch, Redirect } from "react-router-dom";
import history from "./history";

import './CSS/App.css';
import Login from './components/Login';
import ProtectedRoutes from "./components/ProtectedRoutes";

window.serverURL = `http://localhost`;

const isAuthed = _ => true;

const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) =>
        isAuthed()
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
    }
    />
)

function App() {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/login" component={Login} />
                <ProtectedRoute component={ProtectedRoutes} />
            </Switch>
        </Router>
    );
}

export default App;
