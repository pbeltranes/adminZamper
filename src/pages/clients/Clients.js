import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Modal } from "@material-ui/core";
import MUIDataTable from "mui-datatables";

import { Add as AddIcon } from "@material-ui/icons";

// components
import PageTitle from "../../components/PageTitle";
import ClientRegister from "../../components/ClientRegister";
// Context
import {
  getClients,
  useClientDispatch,
  useClientState,
} from "../../context/ClientContext";

// data

// styles
import useStyles from "./style";

export default function Clients(props) {
  // global
  var clientDispatch = useClientDispatch();
  const { clients } = useClientState();

  // local

  var classes = useStyles();
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);

  useEffect(() => {
    if (clients === undefined) {
      console.log("entra aqui");
      getClients(clientDispatch, props.history, setIsLoading, setError);
    }
  });

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <PageTitle title="Clientes" />

        <ClientRegister />
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {isLoading ? (
            <Grid container alignItems="center">
              <CircularProgress />
            </Grid>
          ) : (
            <MUIDataTable
              title="Lista de Clientes"
              data={clients}
              columns={[
                "name",
                "email",
                "isActive",
                "phone",
                "apiKey",
                "tokenKey",
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
