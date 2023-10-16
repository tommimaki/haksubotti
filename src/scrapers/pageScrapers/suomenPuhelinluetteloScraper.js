"use server";
const puppeteer = require("puppeteer");
export async function scrapeSuomenPuhelinluettelot(company) {
  // const browser = await puppeteer.launch({ headless: false });
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
    console.log("Navigating to suomenpuhelinluettelot.fi...");
    await page.goto("https://suomenpuhelinluettelot.fi/");
    console.log("Page loaded.");

    // Wait for the input box to be available
    await page.waitForSelector("#txtpalveluhaku");

    // Check if the "deny all" button is present
    const denyAllButton = await page.$("#c-s-bn");
    if (denyAllButton) {
      console.log("Clicking 'deny all' on cookie notice...");
      await denyAllButton.click();
      await page.waitForTimeout(2000); // wait for 2 seconds to ensure the modal disappears
    }

    console.log("Typing company name...");
    await page.type("#txtpalveluhaku", company);

    console.log("hitting searchbutton...");
    page.click(".haesubmit"), console.log("Submitting form...");

    console.log("Form submitted and navigation complete.");
  } catch (error) {
    console.error("Navigation error:", error.toString());
    await browser.close();
    return null;
  }

  try {
    console.log("Searching for company link...");
    await page.waitForTimeout(2000);

    const { companyURL, companyTexts } = await page.evaluate((company) => {
      console.log("Inside page.evaluate...");

      // Selecting all the h5 elements inside the search results
      const companyNames = Array.from(
        document.querySelectorAll("#searchResults h5 a.linkli")
      );

      // Extracting the text content from each link
      const companyTexts = companyNames.map((link) => link.textContent.trim());

      // Finding the one that matches the provided company name
      const matchingCompany = companyNames.find(
        (link) => link.textContent.trim() === company
      );

      if (matchingCompany) {
        console.log(
          "Matching company found:",
          matchingCompany.textContent.trim()
        );
        return { companyURL: matchingCompany.href, companyTexts };
      } else {
        console.log("No matching company found.");
        return { companyURL: null, companyTexts };
      }
    }, company);

    console.log("Found company names:", companyTexts);
    console.log("Found company URL:", companyURL);

    if (!companyURL) {
      return {
        dataNotFound: true,
        message: "Company data not found on SuomenPuhelinluettelot.fi site",
      };
    }

    if (companyURL) {
      companyURL;
      console.log(`Navigating to company URL: ${companyURL}`);
      await page.goto(companyURL, { timeout: 60000 }); // 60 seconds timeout

      console.log("Scraping company information...");

      // Extract the relevant company information from the company's page
      // Update the selectors and logic to match the structure of the new website
      const companyInfo = await page.evaluate(() => {
        let yTunnus = document
          .querySelector("#companyData p:first-child")
          ?.innerText.split(": ")[1];
        let streetAddress = document.querySelector(
          '#companyData [itemprop="streetAddress"]'
        )?.innerText;
        let postalCode = document.querySelector(
          '#companyData [itemprop="postalCode"]'
        )?.innerText;
        let addressLocality = document.querySelector(
          '#companyData [itemprop="addressLocality"]'
        )?.innerText;
        let email = document.querySelector(
          '#companyData span.kaannetty[itemprop="email"]'
        )?.innerText;
        let phoneNumberElement = document.querySelector(
          '#companyData .phonenumbers a[href^="tel:"]'
        );
        let puhelin = phoneNumberElement
          ? phoneNumberElement.href.split(":")[1]
          : null;

        return {
          siteName: "https://suomenpuhelinluettelot.fi/",
          companyName: document.querySelector("#companyData h5 a.linkli")
            ?.innerText,
          yTunnus: yTunnus,
          address: `${streetAddress}, ${postalCode} ${addressLocality}`,
          puhelin: puhelin,
          url: window.location.href,
        };
      });

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
