import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";

// components
import Layout from "./Layout";

// pages
import Error from "../pages/error";
import Login from "../pages/login";

// context
import { useUserState } from "../context/UserContext";

//axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.defaults.baseURL = "locahost:3000";
export default function App() {
  // global
  var { isAuthenticated } = useUserState();
  console.log("Hola mundo");
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/" component={Layout} />
        <PublicRoute path="/login" component={Login} />
        <Route component={Error} />
      </Switch>
    </HashRouter>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
