// src/constants/emailTemplates.js

export const templates = [
  {
    label: "Template 1",
    value: "Hello, ${companyName}. Welcome to our service!",
  },
  {
    label: "Template 2",
    value:
      "Dear ${companyName}, your registration number is ${registrationNumber}.",
  },
  {
    label: "Directory Review Template",
    value:
      "Hei,\n\n" +
      "Olemme suorittaneet kattavan hakemistotarkastuksen yritykselle ${companyName} ja y-tunnukselle ${registrationNumber} sekä toimittaneet irtisanomisvaateet ja hakemistonäkyvyyksien poistopyynnöt sivustoihin, joissa yrityksellänne on hakemistonäkyvyys:\n\n" +
      "${freeListingUrls}\n\n" +
      "Tilanne on muuttumaton hakemistonäkyvyyksien osalta johtuen paljolti maksullisesta telehaku näkyvyydestä. Toimitamme teille erillisellä viestillä ohjeet viestiin minkä pyydämme toimittamaan Telehaulle.\n\n" +
      "Listaus alla:\n\n" +
      "${paidListingUrl}\n\n" +
      "Suoramarkkinointikielto:\nLiitteestä näette listan hakemisto- ja numeropalveluista, joihin olemme päivittäneet yrityksenne osalta kohdennetun suoramarkkinointikiellon.\n\n" +
      "Seuraamme yrityksenne hakemistonäkyvyyksiä ja jos niitä ilmenee, toimitamme niihin irtisanomisilmoitukset.\n\n" +
      "Terveisin,\nAsiakaspalvelu Verkkoturvakeskus VTK",
  },
  // Add more templates as needed
];
