const puppeteer = require("puppeteer");

export async function scrapeSuomen118(company) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Log any console messages from the page
  page.on("console", (message) => {
    console.log(`Page log: ${message.text()}`);
  });

  // Log any page errors
  page.on("pageerror", (err) => {
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
      const links = Array.from(
        document.querySelectorAll(
          ".mod-search-results-row-3 a, .mod-search-results-row-2 a, .mod-search-results-row-1 a"
        )
      );
      const companyLink = links.find(
        (link) => link.textContent.trim() === company
      );
      return companyLink ? companyLink.href : null;
    }, company);

    if (companyURL) {
      console.log(`Navigating to company URL: ${companyURL}`);
      await page.goto(companyURL, { timeout: 60000 }); // 60 seconds timeout

      console.log("Scraping company information...");

      const elementHandle = await page.$(".ccard-infotable");
      const boundingBox = await elementHandle.boundingBox();

      // Take a screenshot of the element
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

      const companyInfo = await page.evaluate(() => {
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
          companyName,
          address,
          yTunnus,
          toimiala,
          productsAndServices,
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
