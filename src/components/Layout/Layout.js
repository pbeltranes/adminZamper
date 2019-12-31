import React from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Devices from "../../pages/devices/Devices";
import Clients from "../../pages/clients/Clients";
import Organizations from "../../pages/organizations/Organizations";
import Broker from "../../pages/brokers/Broker";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";

// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {
  var classes = useStyles();

  // global
  var layoutState = useLayoutState();

  return (
    <div className={classes.root}>
        <>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            <Route path="/broker" component={Broker}/>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/typography" component={Typography} />
            <Route path="/clients" component={Clients} />
            <Route path="/organizations" component={Organizations} />
            <Route path="/devices" component={Devices} />
            <Route path="/notifications" component={Notifications} />
            <Route exact path="/ui" render={() => <Redirect to="/ui/icons" />} />
            <Route path="/ui/maps" component={Maps} />
            <Route path="/ui/icons" component={Icons} />
            <Route path="/ui/charts" component={Charts} />
            <Route component={Error} />
              <Route
                exact
                path="/app/ui"
                render={() => <Redirect to="/app/ui/icons" />}
              />
              <Route path="/app/ui/maps" component={Maps} />
              <Route path="/app/ui/icons" component={Icons} />
              <Route path="/app/ui/charts" component={Charts} />
            </Switch>
          </div>
        </>
    </div>
  );
}

export default withRouter(Layout);
