import React, { useState, useEffect } from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import MUIDataTable from "mui-datatables";



// components
import PageTitle from "../../components/PageTitle";
import {
  getClients,
  useClientDispatch,
  useClientState,
} from "../../context/ClientContext";

// data

export default function Clients(props) {
  // global
  var clientDispatch = useClientDispatch();
  const { clients } = useClientState();

  // local
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
      <PageTitle title="Clientes" />
     
      <Grid container spacing={4}>
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </>
  );
}
