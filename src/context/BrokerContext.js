import React from "react";
import Axios from "../axios";

var BrokerStateContext = React.createContext();
var BrokerDispatchContext = React.createContext();

const initialState = {
  brokers: [],
  error: [],
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_BROKERS_SUCCESS":
      console.log(action.payload)
      return {
        ...state,
        brokers: action.payload ,
      };
    case "GET_BROKERS_FAILURE":
      return {
        ...state,
        error: action.error,
      };
    case "CREATE_BROKER_SUCCESS":
      return {
        brokers: [...state.brokers, action.newBroker],
      };
    case "CREATE_BROKER_FAILURE":
      return {
        ...state,
        brokers: action.brokers,
      };
    case "UPDATE_BROKER_SUCCESS":
      return {
        brokers: state.brokers.map(broker => {
          if (broker.id !== action.updateBroker.id) {
            return broker;
          }
          return {
            ...action.updatebroker,
          };
        }),
      };
    case "UPDATE_BROKER_FAILURE":
    return {
      brokers: [...state.brokers],
      error: action.error,
    }
    case "DELETE_BROKER_FAILURE":
      return {
        brokers: [...state.brokers],
        error: action.error,
      };
    case "DELETE_BROKER_SUCCESS":
      return {
        brokers: state.brokers.filter(
          broker => broker.id !== action.deleteBroker.id,
        ),
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function BrokerProvider({ children }) {
  // Metodo que proveera el state, el disparados y los argumentos de accion, setea las forma de actuar el disparador
  var [state, dispatch] = React.useReducer(userReducer, {
    brokers: children.brokers,
    error: children.error,
  });

  return (
    <BrokerStateContext.Provider value={state}>
      <BrokerDispatchContext.Provider value={dispatch}>
        {children}
      </BrokerDispatchContext.Provider>
    </BrokerStateContext.Provider>
  );
}

function useBrokerState() {
  // Usado para obtener el contexto actual de este sistema
  var context = React.useContext(BrokerStateContext);
  console.log("contexto actual", context);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useBrokerDispatch() {
  // Contiene el contexto actual que luego es usado para ser actualizado
  var context = React.useContext(BrokerDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}
export {
  BrokerProvider,
  useBrokerState,
  useBrokerDispatch,
  getBrokers,
  createBroker,
  updateBroker,
  deleteBroker
};

// ###########################################################

async function getBrokers(dispatch, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  await Axios.get("/api/brokers")
    .then( brokers => {
      console.log(brokers)
      debugger
      dispatch({ type: "GET_BROKERS_SUCCESS",  payload: brokers.data   });
      setError(false);
      setIsLoading(false);
      return 'success'
    })
    .catch(e => {
      dispatch({ type: "GET_BROKERS_FAILURE", error:e });
      setError(true);
      setIsLoading(false);
      return e
    });
}

async function createBroker(dispatch, form, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  console.log("el form", form);
  await Axios.post("/api/broker", {
    name_usuario: form.name_usuario,
    id_comp: form.id_comp,
    invoice_email: form.invoice_phone,
    invoice_phone: form.invoice_email,
    keys_json: form.tokenKey,
    estado_api: true,
  })
    .then(broker => {
      dispatch({ type: "CREATE_BROKER_SUCCESS", newBroker: broker.data });
      setError(false);
      setIsLoading(false);
      return "success";
    })
    .catch(error => {
      dispatch({ type: "CREATE_BROKER_FAILURE", error: error });
      setError(true);
      setIsLoading(false);
      return error;
    });
}
async function updateBroker(dispatch, form, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  console.log("el form", form);
  await Axios.put("/api/broker/" + form.id, {
    name_usuario: form.name_usuario,
    id_comp: form.id_comp,
    invoice_email: form.invoice_phone,
    invoice_phone: form.invoice_email,
    keys_json: form.tokenKey,
    estado_api: true,
  })
    .then(broker => {
      dispatch({ type: "UPDATE_BROKER_SUCCESS", updateBroker: broker.data });
      setError(false);
      setIsLoading(false);
      return "success";
    })
    .catch(error => {
      dispatch({ type: "UPDATE_BROKER_FAILURE", error: error });
      setError(true);
      setIsLoading(false);
      return error;
    });
}
async function deleteBroker(dispatch, form, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  await Axios.delete("/api/broker/" + form.id)
    .then(broker => {
      dispatch({ type: "DELETE_BROKER_SUCCESS", deleteBroker: broker.data });
      setError(false);
      setIsLoading(false);
      return "success";
    })
    .catch(error => {
      dispatch({ type: "DELETE_BROKER_FAILURE", error: error });
      setError(true);
      setIsLoading(false);
      return error;
    });
}
