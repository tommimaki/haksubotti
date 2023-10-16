// // ocrService.js
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

async function extractTextFromImage(imagePath) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");

    const response = await axios.post(
      "https://api.ocr.space/parse/image",
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          apikey: process.env.OCR_API_KEY,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    console.log("OCR Result:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in OCR service:", error);
    return null;
  }
}

module.exports = {
  extractTextFromImage,
};
