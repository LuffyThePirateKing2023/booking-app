import React, { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user_register")) || null,
  loading: false,
  error: null,
};

export const RegContext = createContext(INITIAL_STATE);

const AuthRegReducer = (state, action) => {
  switch (action.type) {
    case "REGISTRATION_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "REGISTRATION_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "REGISTRATION_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const RegContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthRegReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <RegContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </RegContext.Provider>
  );
};
