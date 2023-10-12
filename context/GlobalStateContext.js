// src/context/GlobalStateContext.js
import React, { createContext, useReducer } from "react";

// Initial state
const initialState = {
  company: "",
  companyId: "",
  searchResults: [],
  // ... any other global state values
};

// Create context
export const GlobalStateContext = createContext();

// Reducer function to update state
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_COMPANY":
      return { ...state, company: action.payload };
    case "SET_COMPANY_ID":
      return { ...state, companyId: action.payload };
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload };
    // ... other actions
    default:
      throw new Error("Unknown action type");
  }
};

// Provider component
export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
