const puppeteer = require("puppeteer");
const { extractTextFromImage } = require("../ocrService");
const path = require("path");
import fs from "fs/promises";

export async function scrapeSuomen118(company) {
  let ocrText;
  let url;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Log any console messages from the page
  page.on("console", (message) => {
    console.log(`Page log: ${message.text()}`);
  });

  // Log any page errors
  page.on("page error", (err) => {
    console.error("Page error:", err.toString());
  });

  try {
    console.log("Navigating to suomen118.fi...");
    await page.goto("https://suomen118.fi/yrityshaku/");
    console.log("Page loaded. Typing company name...");
    await page.type("#keywords", company);
    console.log("Submitting form...");
    await Promise.all([
      page.waitForNavigation(),
      page.click("input[type='submit']"),
    ]);
    console.log("Form submitted and navigation complete.");
  } catch (error) {
    console.error("Navigation error:", error.toString());
    await browser.close();
    return null;
  }

  try {
    console.log("Searching for company link...");
    const companyURL = await page.evaluate((company) => {
      // Fetch all links with the specific selector
      const links = Array.from(
        document.querySelectorAll(".mod-search-results-row-1-title a")
      );

      // Loop through each link and check its text content
      for (let linkElement of links) {
        if (linkElement.textContent.trim() === company) {
          // If the text matches the company name, return the href attribute
          return linkElement.href;
        }
      }
      // If no matching link is found, return null
      return null;
    }, company);

    console.log("Found company URL:", companyURL);

    if (!companyURL) {
      return {
        dataNotFound: true,
        message: "Company data not found on Suomen118.fi site",
      };
    }

    if (companyURL) {
      url = companyURL;
      console.log(`Navigating to company URL: ${companyURL}`);
      await page.goto(companyURL, { timeout: 60000 }); // 60 seconds timeout

      console.log("Scraping company information...");

      const elementHandle = await page.$(".ccard-infotable");
      // Take a screenshot of the element(number and email)
      if (elementHandle) {
        const boundingBox = await elementHandle.boundingBox();
        await elementHandle.screenshot({
          path: "screenshot.png",
          clip: {
            x: boundingBox.x,
            y: boundingBox.y,
            width: Math.min(
              boundingBox.width,
              page.viewport().width - boundingBox.x
            ),
            height: Math.min(
              boundingBox.height,
              page.viewport().height - boundingBox.y
            ),
          },
        });
      } else {
        console.error("Element not found");
      }

      //path for screenshot
      const screenshotPath = path.join(process.cwd(), "screenshot.png");
      //extracting the data from the image
      const ocrResult = await extractTextFromImage(screenshotPath);
      if (
        ocrResult.ParsedResults &&
        ocrResult.ParsedResults.length > 0 &&
        ocrResult.ParsedResults[0].ParsedText
      ) {
        // Assign the extracted text to ocrText
        ocrText = ocrResult.ParsedResults[0].ParsedText;
        console.log("OCR Text:", ocrText);
      } else {
        console.error("OCR Text not found");
      }

      try {
        await fs.unlink(screenshotPath);
        console.log("Screenshot deleted");
      } catch (error) {
        console.error("Error deleting screenshot:", error);
      }

      const companyInfo = await page.evaluate(
        (ocrText, url) => {
          const header = document.querySelector("header h1");
          const companyName = header ? header.textContent.trim() : null;

          const addressDiv = document.querySelector(".ccard-address");
          const streetAddress = addressDiv
            ? addressDiv
                .querySelector('[itemprop="streetAddress"]')
                .textContent.trim()
            : null;
          const addressLocality = addressDiv
            ? addressDiv
                .querySelector('[itemprop="addressLocality"]')
                .textContent.trim()
            : null;

          const yTunnusDiv = document.querySelector(
            ".ccard-panel-left .ccard-textbox:nth-child(2)"
          );
          const yTunnus = yTunnusDiv
            ? yTunnusDiv.querySelector('[itemprop="vatID"]').textContent.trim()
            : null;

          const toimialaDiv = document.querySelector(
            ".ccard-panel-left .ccard-textbox:nth-child(3)"
          );
          const toimiala = toimialaDiv ? toimialaDiv.textContent.trim() : null;

          const productsAndServicesDiv = document.querySelector(
            ".ccard-panel-left .ccard-textbox:nth-child(5)"
          );
          const productsAndServices = productsAndServicesDiv
            ? productsAndServicesDiv.textContent.trim()
            : null;

          const address =
            streetAddress && addressLocality
              ? `${streetAddress}, ${addressLocality}`
              : null;

          return {
            siteName: "https://suomen118.fi/",
            companyName,
            puhelin: ocrText,
            address,
            yTunnus,
            toimiala,
            url: url,
          };
        },
        ocrText,
        url
      );

      console.log("Company information scraped. Closing browser...");
      console.log(companyInfo);
      await browser.close();
      return companyInfo;
    } else {
      console.log(`No link found for company: ${company}`);
      await browser.close();
      return null;
    }
  } catch (error) {
    console.error("Error scraping company information:", error);
    await browser.close();
    return null;
  }
}
