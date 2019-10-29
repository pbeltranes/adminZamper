import React from "react";
import axios from "axios";

var DeviceStateContext = React.createContext();
var DeviceDispatchContext = React.createContext();

const initialState = {
  devices: null,
  error: null,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_DEVICES_SUCCESS":
      return {
        ...state,
        error: null,
        devices: action.devices,
      };
    case "GET_DEVICES_FAILURE":
      return {
        ...state,
        error: null,
        devices: action.devices,
      };
    case "CREATE_DEVICE_SUCCESS":
      return {
        ...state,
        error: null,
        device: action.devices,
      };
    case "CREATE_DEVICE_FAILURE":
      return {
        ...state,
        error: null,
        devices: action.devices,
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
};

// ###########################################################

async function getDevices(dispatch, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  //const response = await axios.post('matrix_local/create_local', {login, password})
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users",
  );
  console.log(response);
  const devices = response.data;
  try {
    setTimeout(() => {
      dispatch({ type: "GET_DEVICES_SUCCESS", devices: devices });
      setError(false);
      setIsLoading(false);
    }, process.env.defaultTTL || 2000);
  } catch (e) {
    dispatch({ type: "GET_DEVICES_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

async function createDevice(dispatch, device, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  //const response = await axios.post()
  setTimeout(() => {
    dispatch({ type: "CREATE_DEVICE_SUCCESS", device: device });
    setError(false);
    setIsLoading(false);
  }, process.env.defaultTTL || 2000);
}
