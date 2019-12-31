import React from "react";
import Axios from "../axios";

var DeviceStateContext = React.createContext();
var DeviceDispatchContext = React.createContext();

const initialState = {
  device: [],
  error: [],
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_DEVICES_SUCCESS":
      return {
        ...state,
        devices: action.devices,
      };
    case "GET_DEVICES_FAILURE":
      return {
        ...state,
        error: action.error,
      };
    case "CREATE_DEVICE_SUCCESS":
      return {
        devices: [...state.devices, action.newDevice],
      };
    case "CREATE_DEVICE_FAILURE":
      return {
        ...state,
        devices: action.devices,
      };
    case "UPDATE_DEVICE_SUCCESS":
      return {
        devices: state.devices.map(device => {
          if (device.id !== action.updateDevice.id) {
            return device;
          }
          return {
            ...action.updateDevice
          };
        }),
      };
    case "UPDATE_DEVICE_FAILURE":
    return {
      devices: [...state.devices],
      error: action.error,
    }
    case "DELETE_DEVICE_FAILURE":
      return {
        devices: [...state.devices],
        error: action.error,
      };
    case "DELETE_DEVICE_SUCCESS":
      return {
          devices: state.devices.filter(
          device => device.id !== action.deleteDevice.id,
        ),
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function DeviceProvider({ children }) {
  // Metodo que proveera el state, el disparados y los argumentos de accion, setea las forma de actuar el disparador
  var [state, dispatch] = React.useReducer(userReducer, {
    devices: children.devices,
    error: children.error,
  });

  return (
    <DeviceStateContext.Provider value={state}>
      <DeviceDispatchContext.Provider value={dispatch}>
        {children}
      </DeviceDispatchContext.Provider>
    </DeviceStateContext.Provider>
  );
}

function useDeviceState() {
  // Usado para obtener el contexto actual de este sistema
  var context = React.useContext(DeviceStateContext);
  console.log("contexto actual", context);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useDeviceDispatch() {
  // Contiene el contexto actual que luego es usado para ser actualizado
  var context = React.useContext(DeviceDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}
export {
  DeviceProvider,
  useDeviceState,
  useDeviceDispatch,
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice
};

// ###########################################################

async function getDevices(dispatch, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  await Axios.get("/api/devices")
    .then(devices => {
      dispatch({ type: "GET_DEVICES_SUCCESS",  devices: devices.data  });
      setError(false);
      setIsLoading(false);
      return 'success'
    })
    .catch(e => {
      dispatch({ type: "GET_DEVICES_FAILURE", error:e });
      setError(true);
      setIsLoading(false);
      return e
    });
}

async function createDevice(dispatch, form, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  console.log("el form", form);
  await Axios.post("/api/device", {
    device_name: form.device_name,
    id_comp: form.id_comp,
    device_autor: form.device_autor,
    device_type: form.device_type,
    device_chip_imei: form.device_chip_imei,
    device_chip_iddi: form.device_chip_iddi,
  })
    .then(device => {
      dispatch({ type: "CREATE_DEVICE_SUCCESS", newDevice: device.data });
      setError(false);
      setIsLoading(false);
      return "success";
    })
    .catch(error => {
      dispatch({ type: "CREATE_DEVICE_FAILURE", error: error });
      setError(true);
      setIsLoading(false);
      return error;
    });
}
async function updateDevice(dispatch, form, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  console.log("el form", form);
  await Axios.put("/api/device/" + form.id, {
    device_name: form.device_name,
    id_comp: form.id_comp,
    device_autor: form.device_autor,
    device_type: form.device_type,
    device_chip_imei: form.device_chip_imei,
    device_chip_iddi: form.device_chip_iddi,
  })
    .then(device => {
      dispatch({ type: "UPDATE_DEVICE_SUCCESS", updateDevice: device.data });
      setError(false);
      setIsLoading(false);
      return "success";
    })
    .catch(error => {
      dispatch({ type: "UPDATE_DEVICE_FAILURE", error: error });
      setError(true);
      setIsLoading(false);
      return error;
    });
}
async function deleteDevice(dispatch, form, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  await Axios.delete("/api/device/" + form.id)
    .then(device => {
      dispatch({ type: "DELETE_DEVICE_SUCCESS", deleteDevice: device.data });
      setError(false);
      setIsLoading(false);
      return "success";
    })
    .catch(error => {
      dispatch({ type: "DELETE_DEVICE_FAILURE", error: error });
      setError(true);
      setIsLoading(false);
      return error;
    });
}
