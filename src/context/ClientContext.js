import React from "react";
import Axios from "../axios";

var ClientStateContext = React.createContext();
var ClientDispatchContext = React.createContext();

const initialState = {
  clients: [],
  error: [],
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_CLIENTS_SUCCESS":
      return {
        ...state,
        clients: action.clients,
      };
    case "GET_CLIENTS_FAILURE":
      return {
        ...state,
        error: action.error,
      };
    case "CREATE_CLIENT_SUCCESS":
      return {
        clients: [...state.clients, action.newClient],
      };
    case "CREATE_CLIENT_FAILURE":
      return {
        ...state,
        clients: action.clients,
      };
    case "UPDATE_CLIENT_SUCCESS":
      return {
        clients: state.clients.map(client => {
          if (client.id !== action.updateClient.id) {
            return client;
          }
          return {
            ...action.updateClient,
          };
        }),
      };
    case "UPDATE_CLIENT_FAILURE":
    return {
      clients: [...state.clients],
      error: action.error,
    }
    case "DELETE_CLIENT_FAILURE":
      return {
        clients: [...state.clients],
        error: action.error,
      };
    case "DELETE_CLIENT_SUCCESS":
      return {
        clients: state.clients.filter(
          client => client.id !== action.deleteClient.id,
        ),
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
    error: children.error,
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
  createClient,
  updateClient,
  deleteClient,
};

// ###########################################################

function getClients(dispatch, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  //const response = await axios.post('matrix_local/create_local', {login, password})
  Axios.get("/api/usuarioapi")
    .then(clients => {
      dispatch({ type: "GET_CLIENTS_SUCCESS", clients: clients.data });
      setError(false);
      setIsLoading(false);
    })
    .catch(e => {
      dispatch({ type: "GET_CLIENTS_FAILURE" });
      setError(true);
      setIsLoading(false);
    });
}

async function createClient(dispatch, form, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  console.log("el form", form);
  await Axios.post("/api/usuarioapi", {
    name_usuario: form.name_usuario,
    id_comp: form.id_comp,
    invoice_email: form.invoice_phone,
    invoice_phone: form.invoice_email,
    keys_json: form.tokenKey,
    estado_api: true,
  })
    .then(client => {
      dispatch({ type: "CREATE_CLIENT_SUCCESS", newClient: client.data });
      setError(false);
      setIsLoading(false);
      return "success";
    })
    .catch(error => {
      dispatch({ type: "CREATE_CLIENT_FAILURE", error: error });
      setError(true);
      setIsLoading(false);
      return error;
    });
}
async function updateClient(dispatch, form, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  console.log("el form", form);
  await Axios.put("/api/usuarioapi/" + form.id, {
    name_usuario: form.name_usuario,
    id_comp: form.id_comp,
    invoice_email: form.invoice_phone,
    invoice_phone: form.invoice_email,
    keys_json: form.tokenKey,
    estado_api: true,
  })
    .then(client => {
      dispatch({ type: "UPDATE_CLIENT_SUCCESS", updateClient: client.data });
      setError(false);
      setIsLoading(false);
      return "success";
    })
    .catch(error => {
      dispatch({ type: "UPDATE_CLIENT_FAILURE", error: error });
      setError(true);
      setIsLoading(false);
      return error;
    });
}
async function deleteClient(dispatch, form, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  await Axios.delete("/api/usuarioapi/" + form.id)
    .then(client => {
      dispatch({ type: "DELETE_CLIENT_SUCCESS", deleteClient: client.data });
      setError(false);
      setIsLoading(false);
      return "success";
    })
    .catch(error => {
      dispatch({ type: "DELETE_CLIENT_FAILURE", error: error });
      setError(true);
      setIsLoading(false);
      return error;
    });
}
