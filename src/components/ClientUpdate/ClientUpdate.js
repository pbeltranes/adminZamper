import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogTitle,
  Fab,
  Dialog,
  TextField,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import { Add as AddIcon, Person as PersonIcon, Edit} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
// styles
import useStyles from "../ClientRegister/styles";

import { createClient, useClientDispatch } from "../../context/ClientContext";
import {
  getOrganizations,
  useOrganizationState,
  useOrganizationDispatch,
} from "../../context/OrganizationContext";
function SimpleDialog(props) {
  var Dispatch = useClientDispatch();
  var organizationDispatch = useOrganizationDispatch();
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  const handleClose = () => {
    onClose(selectedValue);
  };

  var { organizations } = useOrganizationState();
  const [form, setValues] = useState({
    firstName: props.name_usuario,
    lastName: "",
    organization: "",
    apiKey: "",
    secretKey: "",
    phone: "",
  });

  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  );
  const handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    setValues({ ...form, [name]: value });
  };

  const saveForm = () => {
    const { firstName, email, phone } = form;
    if (!firstName || !email || !phone) return;
    createClient(Dispatch, form, "/clients", setIsLoading, setError);
    handleClose();
  };

  const [openOrg, setOpenOrg] = React.useState(false);

  const handleCloseOrg = () => {
    setOpenOrg(false);
  };

  const handleOpenOrg = () => {
    setOpenOrg(true);
  };
  const Organizations =
   (typeof organizations !== "undefined" ) ? (
        organizations.map((organization, id) => (
          <MenuItem value={organization.id} >{organization.name}</MenuItem>
        ))
    ) : (
      ""
    );
  useEffect(() => {
    async function fetchData() {
      // You can await here
      if (typeof organizations === "undefined") {
        await getOrganizations(
          organizationDispatch,
          props.history,
          setIsLoading,
          setError,
        );
      }
    }
    fetchData();
  }, [
    "id",
    "id_comp",
    "name_usuario",
    "invoice_phone",
    "invoice_email",
    "tokenKey",
  ]); // [] define que si una variable cambia, debería ejecutarse el useEffect
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Ingreso</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Porfavor Ingrese los campos necesarios para completar el formulario.
        </DialogContentText>
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="center"
        >
          <TextField
            //error={form.errors.firstName.length === 0 ? false : true}
            autoFocus
            margin="normal"
            name="firstName"
            label="Nombre"
            type="text"
            required
            //helperText={form.errors.firstName}
            value={form.firstName}
            onChange={handleChange}
          />

          <FormControl className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label">
              Organización
            </InputLabel>
            <Select
              name="organization"
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={openOrg}
              onClose={handleCloseOrg}
              onOpen={handleOpenOrg}
              value={form.organizacion}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Organizations}
            </Select>
          </FormControl>

          <TextField
            //error={form.errors.email.length === 0 ? false : true}
            autoFocus
            margin="normal"
            name="email"
            label="Email"
            type="email"
            required
            //helperText={form.errors.email}
            value={form.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="center"
        >
          <TextField
            //error={form.errors.phone.length === 0 ? false : true}
            autoFocus
            margin="normal"
            name="phone"
            label="Telefono"
            type="tel"
            //helperText={form.errors.phone}
            value={form.phone}
            onChange={handleChange}
          />
          <TextField
            //error={form.errors.apiKey.length === 0 ? false : true}
            autoFocus
            margin="normal"
            name="apiKey"
            label="Api Key"
            type="text"
            //helperText={form.errors.apiKey}
            value={form.apiKey}
            onChange={handleChange}
          />

          <TextField
            //error={form.errors.secretKey.length === 0 ? false : true}
            autoFocus
            margin="normal"
            name="secretKey"
            label="Secret Key"
            type="text"
            //helperText={form.errors.secretKey}
            value={form.secretKey}
            onChange={handleChange}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={saveForm} color="primary">
          Suscribir
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function ClientUpdate(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <>
  
        <Edit onClick={handleClickOpen} />
      <SimpleDialog 
        props =  {props}
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </>
  );
}
