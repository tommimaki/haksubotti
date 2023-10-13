"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { getBrightDataOptions } from "./brightDataConfig";

export async function scrapePage(url) {
  const options = getBrightDataOptions();
  try {
    // const response = await axios.get(url, options);
    console.log(url);
    const response = await axios.get(url);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const $ = cheerio.load(response.data);
    return $;
  } catch (error) {
    // Check if the error response status is 404
    if (error.response && error.response.status === 404) {
      return null; // Return null for 404 errors
    }
    throw new Error(`failed to scrape page: ${error.message}`);
  }
}
