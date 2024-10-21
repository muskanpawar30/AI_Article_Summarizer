const { onRequest } = require("firebase-functions/v2/https");
const functions = require("firebase-functions"); // Make sure to import functions
const fetch = require("node-fetch");

// Cloud function to fetch a summary from the RapidAPI service
exports.fetchSummary = onRequest(async (req, res) => {
  try {
    // Extract the URL from the request body or query parameters
    const urlToSummarize = req.query.url || req.body.url;

    if (!urlToSummarize) {
      return res.status(400).send("Missing URL to summarize.");
    }

    // Access the API key from Firebase config
    const apiKey = functions.config().rapidapi.key;

    const response = await fetch(
      `https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${encodeURIComponent(urlToSummarize)}&length=3`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "article-extractor-and-summarizer.p.rapidapi.com",
          "x-rapidapi-key": apiKey, // Use the API key from config
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      return res.status(response.status).send(errorText);
    }

    const data = await response.json();
    res.status(200).send(data);
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).send("Error fetching data: " + error.message);
  }
});
