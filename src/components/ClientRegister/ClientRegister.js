import React, { useState, useEffect } from "react";
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
} from "@material-ui/core";
import { Add as AddIcon, Person as PersonIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
// styles
import useStyles from "./styles";

import { createClient, useClientDispatch } from "../../context/ClientContext";

function SimpleDialog(props) {
  var clientDispatch = useClientDispatch();
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  const handleClose = () => {
    onClose(selectedValue);
  };

  const [form, setValues] = useState({
    errors: {
      firstName: "",
      lastName: "",
      email: "",
      apiKey: "",
      secretKey: "",
      phone: "",
    },
  });

  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  );
  const validateForm = form => {
    let valid = true;
    Object.values(form.errors).forEach(
      val => val.length > 0 && (valid = false),
    );

    console.log(valid);
    return valid;
  };

  const handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let errors = form.errors;

    switch (name) {
      case "firstName":
        errors.firstName = value.length < 5 ? "Mínimo 5 letras!" : "";
        break;
      case "lastName":
        errors.lastName = value.length < 5 ? "Mínimo 5 letras!" : "";
        break;
      case "email":
        errors.email = validEmailRegex.test(value)
          ? ""
          : "Ingrese un mail valido!";
        break;
      case "phone":
        errors.phone =
          value.length < 8 ? "Phone must be 8 characters long!" : "";
        break;

      default:
        break;
    }
    setValues({ errors, [name]: value });
  };

  const handleBlur = _ => {};

  const printValues = async e => {
    e.preventDefault();
    if (validateForm(form)) {
      console.log(e, form);
      await createClient(clientDispatch, form, "/client", setIsLoading, setError);
      
      handleClose();
    } else {
      console.error("Invalid Form");
    }
  };

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
            error={form.errors.firstName.length === 0 ? false : true}
            autoFocus
            margin="normal"
            name="firstName"
            label="Nombre"
            type="text"
            required
            helperText={form.errors.firstName}
            value={form.firstName}
            onChange={handleChange}
          />
          <TextField
            error={form.errors.lastName.length === 0 ? false : true}
            autoFocus
            margin="normal"
            name="lastName"
            label="Apellido"
            type="text"
            required
            helperText={form.errors.lastName}
            value={form.lastName}
            onChange={handleChange}
          />
          <TextField
            error={form.errors.email.length === 0 ? false : true}
            autoFocus
            margin="normal"
            name="email"
            label="Email"
            type="email"
            required
            helperText={form.errors.email}
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
            error={form.errors.phone.length === 0 ? false : true}
            autoFocus
            margin="normal"
            name="phone"
            label="Telefono"
            type="tel"
            helperText={form.errors.phone}
            value={form.phone}
            onChange={handleChange}
          />
          <TextField
            error={form.errors.apiKey.length === 0 ? false : true}
            autoFocus
            margin="normal"
            name="apiKey"
            label="Api Key"
            type="text"
            helperText={form.errors.apiKey}
            value={form.apiKey}
            onChange={handleChange}
          />

          <TextField
            error={form.errors.secretKey.length === 0 ? false : true}
            autoFocus
            margin="normal"
            name="secretKey"
            label="Secret Key"
            type="text"
            helperText={form.errors.secretKey}
            value={form.secretKey}
            onChange={handleChange}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={printValues} color="primary">
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

export default function ClientRegister() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
      <SimpleDialog
        
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </>
  );
}
