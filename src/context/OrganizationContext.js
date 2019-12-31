import React from "react";
import Axios from "../axios";

var OrganizationStateContext = React.createContext();
var OrganizationDispatchContext = React.createContext();

const initialState = {
  organizations: [],
  error: [],
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_ORGANIZATIONS_SUCCESS":
      return {
        ...state,
        organizations: action.organizations,
      };
    case "GET_ORGANIZATIONS_FAILURE":
      console.log(action);
      return {
        ...state,
        error: null,
        organizations: action.organizations,
      };
    case "CREATE_ORGANIZATION_SUCCESS":
      console.log("Actuion actual",action)
      return {
         organizations: [ ...state.organizations , action.newOrganization ]
      };
    case "CREATE_ORGANIZATION_FAILURE":
      return {
        ...state,
        error: null,
        organizations: action.organizations,
      };
      case "UPDATE_ORGANIZATION_SUCCESS":
        return {
          organizations: state.organizations.map(organization => {
            if (organization.id !== action.updateOrganization.id) {
              return organization;
            }
            return {
              ...action.updateOrganization,
            };
          }),
        };
      case "UPDATE_ORGANIZATION_FAILURE":
      return {
        organizations: [...state.organizations],
        error: action.error,
      }
      case "DELETE_ORGANIZATION_FAILURE":
        return {
          organizations: [...state.organizations],
          error: action.error,
        };
      case "DELETE_ORGANIZATION_SUCCESS":
        return {
          organizations: state.organizations.filter(
            organization => organization.id !== action.deleteOrganization.id,
          ),
        };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function OrganizationProvider({ children }) {
  // Metodo que proveera el state, el disparados y los argumentos de accion, setea las forma de actuar el disparador
  var [state, dispatch] = React.useReducer(userReducer, {
    organizations: children.organizations,
    error: children.error,
  });

  return (
    <OrganizationStateContext.Provider value={state}>
      <OrganizationDispatchContext.Provider value={dispatch}>
        {children}
      </OrganizationDispatchContext.Provider>
    </OrganizationStateContext.Provider>
  );
}

function useOrganizationState() {
  // Usado para obtener el contexto actual de este sistema
  var context = React.useContext(OrganizationStateContext);
  console.log("contexto actual", context);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useOrganizationDispatch() {
  // Contiene el contexto actual que luego es usado para ser actualizado
  var context = React.useContext(OrganizationDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}
export {
  OrganizationProvider,
  useOrganizationState,
  useOrganizationDispatch,
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization
};

// ###########################################################

function getOrganizations(dispatch, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  //const response = await axios.post('matrix_local/create_local', {login, password})
  Axios.get("/api/compania")
    .then(organizations => {
      dispatch({ type: "GET_ORGANIZATIONS_SUCCESS", organizations: organizations.data });
      setError(false);
      setIsLoading(false);
    })
    .catch(e => {
      dispatch({ type: "GET_ORGANIZATIONS_FAILURE" });
      setError(true); 
      console.log(e);
      setIsLoading(false);
    });
}

async function createOrganization(dispatch, form, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  console.log("forms",form)
  await Axios.post("/api/compania", {
    rut_empresa: form.rut_empresa,
    name: form.name,
    nombre_representante: form.nombre_representante,
    invoice_address: form.invoice_address,
    invoice_email: form.invoice_email,
    invoice_phone: form.invoice_phone,
  })
    .then(organization => {
      console.log(organization)
      dispatch({ type: "CREATE_ORGANIZATION_SUCCESS", newOrganization: organization.data });
      setError(false);
      setIsLoading(false);
    })
    .catch(error => {
      dispatch({ type: "CREATE_ORGANIZATION_FAILURE", error: error });
      setError(error);
      setIsLoading(false);
    });
}
async function updateOrganization(dispatch, form, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  console.log("el form", form);
  await Axios.put("/api/compania/" + form.id, {
    rut_empresa: form.rut_empresa,
    name: form.name,
    nombre_representante: form.nombre_representante,
    invoice_address: form.invoice_address,
    invoice_email: form.invoice_email,
    invoice_phone: form.invoice_phone,
  })
    .then(organization => {
      dispatch({ type: "UPDATE_ORGANIZATION_SUCCESS", updateOrganization: organization.data });
      setError(false);
      setIsLoading(false);
      return "success";
    })
    .catch(error => {
      dispatch({ type: "UPDATE_ORGANIZATION_FAILURE", error: error });
      setError(true);
      setIsLoading(false);
      return error;
    });
}
async function deleteOrganization(dispatch, form, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  await Axios.delete("/api/compania/" + form.id)
    .then(organization => {
      dispatch({ type: "DELETE_ORGANIZATION_SUCCESS", deleteOrganization: organization.data });
      setError(false);
      setIsLoading(false);
      return "success";
    })
    .catch(error => {
      dispatch({ type: "DELETE_ORGANIZATION_FAILURE", error: error });
      setError(true);
      setIsLoading(false);
      return error;
    });
}
