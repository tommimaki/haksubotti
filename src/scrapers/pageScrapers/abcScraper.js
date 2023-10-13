"use server";

import { scrapePage } from "../scrapeData";

export async function scrapeABC(company) {
  const formattedCompany = company.split(" ").join("+");
  const url = `https://abc.fi/${formattedCompany}`;

  console.log("url in abc", url);

  try {
    //fetching the html and setting it to cheerio const
    const $ = await scrapePage(url);
    //if page not found
    if (!$) {
      return {
        dataNotFound: true,
        message: "Company data not found on Abc.fi site",
      };
    }

    //data extraction from html elements
    const companyName = $("h2.redBorderBottomWider")?.text()?.trim() ?? "N/A";
    const area =
      $('div.form-group:contains("Alue:") p.form-control-static')
        ?.text()
        ?.trim() ?? "N/A";
    const businessID =
      $('div.form-group:contains("Y-tunnus:") p.form-control-static')
        ?.text()
        ?.trim() ?? "N/A";
    const address =
      $('div.form-group:contains("Lähiosoite:") p.form-control-static')
        ?.text()
        ?.trim() ?? "N/A";
    const phone =
      $('div.form-group:contains("Puhelin:") p.form-control-static')
        ?.text()
        ?.trim() ?? "N/A";
    const emailReversed =
      $('div.form-group:contains("Sähköposti:") p.form-control-static')
        ?.text()
        ?.trim() ?? "N/A";
    const email = emailReversed
      ? emailReversed.split("").reverse().join("")
      : "N/A";
    const website =
      $('div.form-group:contains("Kotisivu:") a')?.attr("href")?.trim() ??
      "N/A";

    const data = {
      companyName: companyName ?? "N/A",
      businessID: businessID ?? "N/A",
      address: address ?? "N/A",
      phone: phone ?? "N/A",
      area: area ?? "N/A",
      email: email ?? "N/A",
      customerWebsite: website ?? "N/A",
      url: url,
      siteName: "Abc.fi",
    };

    console.log(data);
    return data;
  } catch (error) {
    throw new Error(`failed to scrape data in ABC: ${error.message}`);
  }
}
