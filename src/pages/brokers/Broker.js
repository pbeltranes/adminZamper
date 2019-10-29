import React, { useState, useEffect } from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import MUIDataTable from "mui-datatables";



// components
import PageTitle from "../../components/PageTitle";
import {
  getBrokers,
  useBrokerDispatch,
  useBrokerState,
} from "../../context/BrokerContext";

// data

export default function Broker(props) {
  // global
  var dispatch = useBrokerDispatch();
  const { brokers } = useBrokerState();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  useEffect(() => {
    if (brokers === undefined) {
      console.log("entra aqui");
      getBrokers(dispatch, props.history, setIsLoading, setError);
    }
  });

  return (
    <>
      <PageTitle title="Broker" />
     
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title="Lista de Brokers"
            data={brokers}
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
