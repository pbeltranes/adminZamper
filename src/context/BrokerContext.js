import React from "react";
import axios from "axios";

var BrokerStateContext = React.createContext();
var BrokerDispatchContext = React.createContext();

const initialState = {
  brokers: null,
  error: null,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_BROKERS_SUCCESS":
      return {
        ...state,
        error: null,
        brokers: action.brokers,
      };
    case "GET_BROKERS_FAILURE":
      return {
        ...state,
        error: null,
        brokers: action.brokers,
      };
    case "CREATE_BROKER_SUCCESS":
      return {
        ...state,
        error: null,
        broker: action.broker,
      };
    case "CREATE_BROKER_FAILURE":
      return {
        ...state,
        error: null,
        brokers: action.brokers,
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
};

// ###########################################################

async function getBrokers(dispatch, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  //const response = await axios.post('matrix_local/create_local', {login, password})
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users",
  );
  console.log(response);
  const brokers = response.data;
  try {
    setTimeout(() => {
      dispatch({ type: "GET_BROKERS_SUCCESS", brokers: brokers });
      setError(false);
      setIsLoading(false);
    }, process.env.defaultTTL || 2000);
  } catch (e) {
    dispatch({ type: "GET_BROKERS_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

async function createBroker(dispatch, broker, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  //const response = await axios.post()
  setTimeout(() => {
    dispatch({ type: "CREATE_BROKER_SUCCESS", broker: broker });
    setError(false);
    setIsLoading(false);
  }, process.env.defaultTTL || 2000);
}
