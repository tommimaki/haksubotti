// src/components/EmailSection.js

import React, { useState, useContext } from "react";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import { templates } from "@/constants/emailTemplates";

const EmailSection = ({ freeResults, paidResults }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const { state } = useContext(GlobalStateContext);
  const companyData = state.searchResults;

  console.log("free results", freeResults);
  console.log("paid results", paidResults);

  const businessID = state.searchResults.find(
    (result) => result.yTunnus
  )?.yTunnus;
  console.log("state.searchresults in emailsection", state.company);
  const handleTemplateChange = (e) => {
    const templateValue = e.target.value;
    setSelectedTemplate(templateValue);

    const freeListingUrls = freeResults.map((result) => result.url).join("\n");
    const paidListingUrl = paidResults.map((result) => result.url).join("\n");

    const populatedTemplate = templateValue
      .replace("${companyName}", state.company) // Update to use companyData
      .replace("${registrationNumber}", businessID || "N/A")
      .replace("${freeListingUrls}", freeListingUrls)
      .replace("${paidListingUrl}", paidListingUrl);

    setEmailContent(populatedTemplate);
  };

  const handleSendEmail = () => {
    // Logic to send email goes here
    console.log("Sending email:", emailContent);
  };

  return (
    <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl mb-4">Send Email</h2>
      <select className="border mb-4 p-2" onChange={handleTemplateChange}>
        <option value="">Select a template</option>
        {templates.map((template, index) => (
          <option key={index} value={template.value}>
            {template.label}
          </option>
        ))}
      </select>
      <textarea
        className="w-full h-40 border p-2 mb-4"
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
      ></textarea>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSendEmail}
      >
        Send Email
      </button>
    </div>
  );
};

export default EmailSection;
