"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { scrapePage } from "../scrapeData";

export async function scrapeTelehaku(company) {
  console.log("in telehakuscraper", company);
  if (!company) return;

  const formattedCompany = company.split(" ").join("+");
  const url = `https://telehaku.fi/${formattedCompany}`;

  console.log("url in telehakuscraper", url);

  try {
    //getting cheeriodata from common scraper
    const $ = await scrapePage(url);
    if (!$) {
      return {
        dataNotFound: true,
        message: "Company data not found on telehaku.fi",
      };
    }

    //extracting data:
    const companyName =
      ($("#yrityskortti h1").length && $("#yrityskortti h1").text().trim()) ||
      "N/A";
    const yTunnus =
      ($("#yrityskortti .row .col-xs-9.text-left").length &&
        $("#yrityskortti .row .col-xs-9.text-left").first().text().trim()) ||
      "N/A";
    const address =
      ($("#yrityskortti .row .col-xs-9.text-left").eq(1).length &&
        $("#yrityskortti .row .col-xs-9.text-left")
          .eq(1)
          .text()
          .trim()
          .replace(/\s+/g, " ")) ||
      "N/A";
    const puhelin =
      ($("#yrityskortti .row .col-xs-9.text-left").eq(2).length &&
        $("#yrityskortti .row .col-xs-9.text-left").eq(2).text().trim()) ||
      "N/A";
    const sectors = ($("#yrityskortti .toimialat li a").length &&
      $("#yrityskortti .toimialat li a")
        .map((i, el) => $(el).text().trim())
        .get()) || ["N/A"];
    const description =
      ($("#yrityskortti #description").length &&
        $("#yrityskortti #description").html().trim()) ||
      "N/A";
    const descriptionElement = $("#yrityskortti #description");
    const descriptionText =
      (descriptionElement.length && descriptionElement.text()) || "N/A";
    const descriptionHtml =
      (descriptionElement.length && descriptionElement.html().trim()) || "N/A";

    let contactPerson = "";
    let operatingArea = "";

    const descriptionParagraphs = descriptionText
      .trim()
      .split("\n")
      .map((line) => line.trim());
    for (const paragraph of descriptionParagraphs) {
      if (paragraph.startsWith("Yhteyshenkilö:")) {
        contactPerson = paragraph.split(": ")[1];
      } else if (paragraph.startsWith("Toimialue:")) {
        operatingArea = paragraph.split(": ")[1];
      }
    }

    const data = {
      companyName,
      yTunnus,
      address,
      puhelin,
      sectors,
      contactPerson,
      operatingArea,
      url,
      siteName: "Telehaku",
    };

    return data;
  } catch (error) {
    throw new Error(`failed to scrape data in telehaku: ${error.message}`);
  }
}
