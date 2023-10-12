"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { getBrightDataOptions } from "./brightDataConfig";

export async function scrapePage(url) {
  const options = getBrightDataOptions();
  try {
    const response = await axios.get(url, options);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const $ = cheerio.load(response.data);
    return $;
  } catch (error) {
    throw new Error(`failed to scrape page: ${error.message}`);
  }
}
