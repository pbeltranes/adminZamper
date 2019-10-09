import React from "react";
import axios from "axios";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

const initialState = {
  user: null,
  error: null,
  isAuthenticated: false,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action,
      };
    case "REGISTER_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "SIGN_OUT_SUCCESS":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  // Metodo que proveera el state, el disparados y los argumentos de accion, setea las forma de actuar el disparador
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
    login: children.login,
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  // Usado para obtener el contexto actual de este sistema
  var context = React.useContext(UserStateContext);

  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  // Contiene el contexto actual que luego es usado para ser actualizado
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}
export {
  UserProvider,
  useUserState,
  useUserDispatch,
  loginUser,
  signOut,
  registerUser,
};

// ###########################################################

async function loginUser(
  dispatch,
  login,
  password,
  history,
  setIsLoading,
  setError,
) {
  setError(false);
  setIsLoading(true);
  //const response = await axios.post('matrix_local/create_local', {login, password})
  var response;
  if (login === "u@u.cl") {
    console.log("Hola");
    response = {
      status: "200",
    };
  } else {
    response = {
      status: "404",
    };
  }
  if (response.status === "200") {
    setTimeout(() => {
      localStorage.setItem("id_token", "1");
      localStorage.setItem("login", login);
      dispatch({ type: "LOGIN_SUCCESS", login, password });
      setError(null);
      setIsLoading(false);

      history.push("/");
    }, process.env.defaultTTL || 2000);
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}
async function registerUser(
  dispatch,
  login,
  name,
  password,
  history,
  setIsLoading,
  setError,
) {
  setError(false);
  setIsLoading(true);
  var response;
  response = {
    status: "200",
  };
  if (response.status === "200") {
    setTimeout(() => {
      localStorage.setItem("id_token", "1");
      localStorage.setItem("login", login);
      dispatch({ type: "REGISTER_SUCCESS" });
      setError(null);
      setIsLoading(false);

      history.push("/");
    }, process.env.defaultTTL || 2000);
  } else {
    dispatch({ type: "REGISTER_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
