import React from "react";
import axios from "axios";
import { clients as clientsDefault } from "../databases/clients";

var ClientStateContext = React.createContext();
var ClientDispatchContext = React.createContext();

const initialState = {
  clients: null,
  error: null,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_CLIENTS_SUCCESS":
      return {
        ...state,
        error: null,
        clients: action.clients,
      };
    case "GET_CLIENTS_FAILURE":
      return {
        ...state,
        error: null,
        clients: action.clients,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function ClientProvider({ children }) {
  // Metodo que proveera el state, el disparados y los argumentos de accion, setea las forma de actuar el disparador
  var [state, dispatch] = React.useReducer(userReducer, {
    clients: children.clients,
  });

  return (
    <ClientStateContext.Provider value={state}>
      <ClientDispatchContext.Provider value={dispatch}>
        {children}
      </ClientDispatchContext.Provider>
    </ClientStateContext.Provider>
  );
}

function useClientState() {
  // Usado para obtener el contexto actual de este sistema
  var context = React.useContext(ClientStateContext);
  console.log("contexto actual", context);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useClientDispatch() {
  // Contiene el contexto actual que luego es usado para ser actualizado
  var context = React.useContext(ClientDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}
export {
  ClientProvider,
  useClientState,
  useClientDispatch,
  getClients,
  setClient,
};

// ###########################################################

async function getClients(dispatch, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  //const response = await axios.post('matrix_local/create_local', {login, password})
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users",
  );
  console.log(response)
  const clients = response.data
  try {
    setTimeout(() => {
      dispatch({ type: "GET_CLIENTS_SUCCESS", clients: clients });
      setError(false);
      setIsLoading(false);
    }, process.env.defaultTTL || 2000);
  } catch (e) {
    dispatch({ type: "GET_CLIENTS_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}
async function setClient(
  dispatch,
  login,
  password,
  history,
  setIsLoading,
  setError,
) {}
