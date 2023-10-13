"use client";
// src/components/CompanyDataContainer.js
import React, { useContext } from "react";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import CompanyDataDisplay from "./CompanyDataDisplay";

const CompanyDataContainer = () => {
  const { state } = useContext(GlobalStateContext);

  console.log("state.searchresults in companycontainer", state.searchResults);

  return (
    <div>
      {state.searchResults.length > 0 && (
        <CompanyDataDisplay searchResults={state.searchResults} />
      )}
    </div>
  );
};

export default CompanyDataContainer;
