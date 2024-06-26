import React from "react";

const CompanyDataDisplay = ({ searchResults }) => {
  if (!searchResults) {
    return null;
  }

  const renderFields = (result) => {
    return Object.keys(result).map((key, index) => {
      if (
        key !== "siteName" &&
        key !== "companyName" &&
        key !== "dataNotFound" &&
        key !== "message"
      ) {
        return (
          <div key={index} className="mb-4 flex items-start">
            <span className="font-bold text-left">
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </span>{" "}
            {result[key]}
          </div>
        );
      }
      return null;
    });
  };

  const freeResults = searchResults.filter(
    (result) =>
      (!result.puhelin || result.puhelin === "N/A") && !result.dataNotFound
  );

  const paidResults = searchResults.filter(
    (result) => result.puhelin && result.puhelin !== "N/A"
  );

  const notFoundResults = searchResults.filter((result) => result.dataNotFound);

  const renderCategory = (results, title) => (
    <div className="flex-1 p-4 border-l-2 border-t-2 border-gray-400 flex flex-col items-start rounded-lg my-30">
      <h1 className="text-lg text-left font-bold mb-4">{title}</h1>
      {results.map((result, index) => (
        <div key={index} className="mb-4 mt-2 pt-2 border-t-2 ">
          <h2 className="text-lg text-left font-bold mb-4">
            {result.siteName}
          </h2>
          {result.dataNotFound ? (
            <div className="text-red-500 font-bold">{result.message}</div>
          ) : (
            <>
              <h1 className="text-lg text-left font-bold mb-8">
                {result.companyName}
              </h1>
              {renderFields(result)}
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4 p-6 bg-white rounded-lg mt-10  shadow-lg">
      {renderCategory(freeResults, "Free")}
      {renderCategory(paidResults, "Paid")}
      {renderCategory(notFoundResults, "Not Found")}
    </div>
  );
};

export default CompanyDataDisplay;
