"use client";

import React from "react";
import FormPage from "../components/form";
import CompanyDataContainer from "../components/CompanyDataContainer";

const Homepage = () => {
  return (
    <div className="max-w-5xl  w-full text-center">
      <h1 className="text-2xl font-bold  mb-20"> Registry Check</h1>
      <FormPage />
      <CompanyDataContainer />
    </div>
  );
};

export default Homepage;
