import React, { useState, useEffect, forwardRef } from "react";
import { Grid, CircularProgress, Modal } from "@material-ui/core";

import { Add as AddIcon } from "@material-ui/icons";
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
// components
import PageTitle from "../../components/PageTitle";
// Context
import {
  getOrganizations,
  useOrganizationDispatch,
  useOrganizationState,
} from "../../context/OrganizationContext";

import {
  createDevice,
  getDevices,
  deleteDevice,
  updateDevice,
  useDeviceDispatch,
  useDeviceState,
} from "../../context/DeviceContext";
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
  var dispatchOrganization = useOrganizationDispatch();
  var dispatchDevice = useDeviceDispatch();
  var { organizations } = useOrganizationState();
  var { devices } = useDeviceState();
  // local
  var rObj = {};
  var classes = useStyles();
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);

  async function fetchData() {
    // You can await here
    if (
      typeof devices === "undefined" &&
      typeof organizations === "undefined"
    ) {
      await getDevices(dispatchDevice, props.history, setIsLoading, setError);
      await getOrganizations(
        dispatchOrganization,
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
    "device_name",
    "run_task",
    "device_autor",
    "device_type",
    "device_chip_imei",
    "device_chip_iddi",
  ]); // [] define que si una variable cambia, debería ejecutarse el useEffect
  console.log(rObj);
  const columns = [
    { title: "id", field: "id" },
    { title: "Nombre Dispositivo", field: "device_name" },
    { title: "Cliente", field: "id_comp", lookup: rObj[0] },
    { title: "Cliente", field: "id_brok" },
    { title: "Autor", field: "device_autor" },
    { title: "Tipo Dispositivo", field: "device_type" },
    { title: "Version Hardware", field: "device_model" },
    { title: "IMEI", field: "device_chip_imei" },
    { title: "Chip Iddi", field: "device_chip_iddi" },
  ];

  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <PageTitle title="Devices" />
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {isLoading ? (
            <Grid container alignItems="center">
              <CircularProgress />
            </Grid>
          ) : (
            <MaterialTable
              title="Lista de Devices"
              icons={tableIcons}
              data={devices}
              columns={columns}
              editable={{
                onRowAdd: async newData => {
                  console.log("NEW TADA", newData);
                  await createDevice(
                    dispatchDevice,
                    newData,
                    "/Device",
                    setIsLoading,
                    setError,
                  )
                    .then(() => {
                      console.log("funco");
                    })
                    .catch(error => {
                      console.log(error);
                    });
                },
                onRowUpdate: async (newData, oldData) => {
                  console.log("new data?", newData);
                  await updateDevice(
                    dispatchDevice,
                    newData,
                    "/Device",
                    setIsLoading,
                    setError,
                  )
                    .then(() => {
                      console.log("funco");
                    })
                    .catch(error => {
                      console.log(error);
                    });
                },
                onRowDelete: async oldData => {
                  await deleteDevice(
                    dispatchDevice,
                    oldData,
                    "/Device",
                    setIsLoading,
                    setError,
                  )
                    .then(() => {
                      console.log("funco");
                    })
                    .catch(error => {
                      console.log(error);
                    });
                },
              }}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
