import React, { useEffect, useState } from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

// components
import PageTitle from "../../components/PageTitle";
import Widget from "../../components/Widget";
import Table from "./components/DeviceTable";

// Context
import {
  getDevices,
  useDeviceDispatch,
  useDeviceState,
} from "../../context/DeviceContext";


// styles
import useStyles from "./style";

export default function Devices(props) {
  // Global
  const  dispatch  = useDeviceDispatch();
  var { devices } = useDeviceState();

  // Local
  var classes = useStyles();
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [newClient, setClient] = useState(false);
  useEffect(() => {
    if (devices === undefined) {
      getDevices(dispatch, props.history, setIsLoading, setError);
    }
  });

  return (
    <>
      <PageTitle title="Devices" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {isLoading ? (
            <Grid container alignItems="center">
              <CircularProgress />
            </Grid>
          ) : (
            <MUIDataTable
              title="Lista de Dispositivos"
              data={devices}
              columns={[
                "nameDevice",
                "id",
                "clientId",
                "state",
                "localeDevice",
                "lastSendData",
              ]}
              options={{
                filterType: "checkbox",
              }}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
