"use client";

// src/app/form/form.js
import React, { useContext, useState } from "react";
import { GlobalStateContext } from "../context/GlobalStateContext";
import { scrapeAllWebsites } from "@/pages/api/scrape";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="company"
          className="block text-sm font-medium text-gray-700"
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
          className="mt-1 block w-full border-2 border-gray-300 rounded-lg rounded-md"
        />
      </div>
      <div>
        <label
          htmlFor="companyId"
          className="block text-sm font-medium text-gray-700"
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
          className="mt-1 block w-full border-2 border-gray-300 rounded-md"
        />
      </div>
      <div>
        <button
          type="submit"
          className="px-4 py-4 bg-slate-500  text-white rounded-md hover:bg-blue-400"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default FormPage;
