"use client";

// src/app/form/form.js
import React, { useContext, useState } from "react";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import { scrapeAllWebsites } from "@/pages/api/scrape";
import { BeatLoader } from "react-spinners";

const FormPage = () => {
  const { state, dispatch } = useContext(GlobalStateContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      console.log("fetching from form", state);
      const result = await scrapeAllWebsites(state.company);
      dispatch({ type: "SET_SEARCH_RESULTS", payload: result });
    } catch (error) {
      console.error(
        "An error occurred while fetching the scraped data in form.js:",
        error
      );
    } finally {
      setIsLoading(false);

      console.log(
        "state after function, should have the search results",
        state
      );
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white shadow-lg rounded-lg"
    >
      <div className="flex flex-col">
        <label
          htmlFor="company"
          className="mb-2 text-sm font-bold text-gray-700"
        >
          Company Name
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={state.company}
          onChange={(e) =>
            dispatch({ type: "SET_COMPANY", payload: e.target.value })
          }
          className="p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <div className="flex flex-col">
        <label
          htmlFor="companyId"
          className="mb-2 text-sm font-bold text-gray-700"
        >
          Company ID
        </label>
        <input
          type="text"
          id="companyId"
          name="companyId"
          value={state.companyId}
          onChange={(e) =>
            dispatch({ type: "SET_COMPANY_ID", payload: e.target.value })
          }
          className="p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <div>
        <button className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          Search
        </button>
        {isLoading && <BeatLoader className="mt-10" color="#3498db" />}
      </div>
    </form>
  );
};
export default FormPage;
