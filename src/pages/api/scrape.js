"use server";
// src/scrapers/index.js
import { scrapeTelehaku } from "@/scrapers/pageScrapers/telehakuScraper";
import { scrapeABC } from "@/scrapers/pageScrapers/abcScraper";
import { scrapeSuomen118 } from "@/scrapers/pageScrapers/118Scraper";
import { scrapeSuomenPuhelinluettelot } from "@/scrapers/pageScrapers/suomenPuhelinluetteloScraper";

// ... import other scraper modules

export async function scrapeAllWebsites(company) {
  "use server";
  console.log("company in scrape.js scrapeAllWebsites", company);

  if (!company) return;
  const results = await Promise.all([
    scrapeTelehaku(company),
    scrapeABC(company),
    scrapeSuomen118(company),
    scrapeSuomenPuhelinluettelot(company),
    // ... other scraper functions
  ]);
  return results;
}
