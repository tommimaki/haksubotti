// src/components/CompanyDataDisplay.js
import React from "react";

const CompanyDataDisplay = ({ searchResults }) => {
  console.log(searchResults);
  if (!searchResults) {
    return null;
  }

  const renderFields = (result) => {
    return Object.keys(result).map((key, index) => {
      if (key !== "siteName" && key !== "companyName") {
        return (
          <div key={index} className="mb-4">
            <span className="font-bold">
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </span>{" "}
            {result[key]}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="flex flex-wrap gap-4 p-6 bg-white rounded-lg mt-10 border-2 border-indigo-600 shadow-lg">
      {searchResults.map((result, index) => (
        <div key={index} className="flex-1 p-4 border rounded-lg">
          <h1 className="text-xl font-bold mb-4">{result.siteName}</h1>
          <h2 className="text-lg font-bold mb-4">{result.companyName}</h2>
          {renderFields(result)}
        </div>
      ))}
    </div>
  );
};

export default CompanyDataDisplay;
