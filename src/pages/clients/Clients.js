import React, { useState, useEffect, forwardRef } from "react";
import { Grid, CircularProgress, Modal } from "@material-ui/core";
// components
import PageTitle from "../../components/PageTitle";
import ClientRegister from "../../components/ClientRegister";
import ClientUpdate from "../../components/ClientUpdate";
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

import MaterialTable from "material-table";

// Context
import {
  getClients,
  useClientDispatch,
  useClientState,
  createClient,
  updateClient,
  deleteClient
} from "../../context/ClientContext";
import {
  getOrganizations,
  useOrganizationState,
  useOrganizationDispatch,
} from "../../context/OrganizationContext";
// data

// styles
import useStyles from "./style";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export default function Clients(props) {
  // global
  var dispatchClient = useClientDispatch();
  var dispatchOrganizations = useOrganizationDispatch();
  var { clients } = useClientState();
  var { organizations } = useOrganizationState();
  // local
  var classes = useStyles();
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [newClient, setState] = useState([]);
  var rObj = {};

  async function fetchData() {
    // You can await here
    if (
      typeof clients === "undefined" &&
      typeof organizations === "undefined"
    ) {
      await getClients(dispatchClient, props.history, setIsLoading, setError);
      const response = await getOrganizations(
        dispatchOrganizations,
        props.history,
        setIsLoading,
        setError,
      );
    }
  }

  if (typeof organizations !== "undefined") {
    rObj = organizations.map(obj => {
      rObj[obj.id] = obj.name;
      return rObj;
    });
  }
  useEffect(() => {
    fetchData();
  }, [
    "id",
    "id_comp",
    "name_usuario",
    "invoice_phone",
    "invoice_email",
    "tokenKey",
    "id_comp",
  ]); // [] define que si una variable cambia, debería ejecutarse el useEffect

  const columns = [
    { title: "id", field: "id" },
    { title: "company", field: "id_comp", lookup: rObj[0] },
    { title: "Nombre usuario", field: "name_usuario" },
    { title: "Telefono", field: "invoice_phone" },
    { title: "Email", field: "invoice_email" },
    { title: "Token ID", field: "tokenKey" },
  ];

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
            <MaterialTable
              title="Lista de Clientes"
              icons={tableIcons}
              data={clients}
              columns={columns}
              editable={{
                onRowAdd: async newData => {
                  console.log("NEW TADA", newData)
                  await createClient(
                    dispatchClient,
                    newData,
                    "/clients",
                    setIsLoading,
                    setError,
                  ).then(() => { console.log('funco') })
                  .catch(error => {
                    console.log(error);
                  })
                },
                onRowUpdate: async (newData, oldData) =>
                {
                  console.log("new data?", newData)
                  await updateClient(
                    dispatchClient,
                    newData,
                    "/clients",
                    setIsLoading,
                    setError,
                  ).then(() => { console.log('funco') })
                  .catch(error => {
                    console.log(error);
                  })
                }
                  ,
                onRowDelete: async oldData =>
                {
                await deleteClient(
                  dispatchClient,
                  oldData,
                  "/clients",
                  setIsLoading,
                  setError,
                ).then(() => { console.log('funco') })
                .catch(error => {
                  console.log(error);
                })
              }
              ,
              }}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
