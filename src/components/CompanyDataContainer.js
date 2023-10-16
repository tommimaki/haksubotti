"use client";
// src/components/CompanyDataContainer.js
import React, { useContext } from "react";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import CompanyDataDisplay from "./CompanyDataDisplay";
import EmailSection from "./emailSection";

const CompanyDataContainer = () => {
  const { state } = useContext(GlobalStateContext);

  const freeResults = state.searchResults.filter(
    (result) =>
      (!result.puhelin || result.puhelin === "N/A") && !result.dataNotFound
  );

  const paidResults = state.searchResults.filter(
    (result) => result.puhelin && result.puhelin !== "N/A"
  );

  return (
    <div>
      {state.searchResults.length > 0 && (
        <CompanyDataDisplay searchResults={state.searchResults} />
      )}
      <EmailSection freeResults={freeResults} paidResults={paidResults} />
    </div>
  );
};

export default CompanyDataContainer;
