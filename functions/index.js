const { onRequest } = require("firebase-functions/v2/https");
const fetch = require("node-fetch");

// Cloud function to fetch a summary from the RapidAPI service
exports.fetchSummary = onRequest(async (req, res) => {
  try {
    const urlToSummarize = req.query.url; // Extract URL parameter from the request
    const response = await fetch(`https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${encodeURIComponent(urlToSummarize)}&length=3`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "article-extractor-and-summarizer.p.rapidapi.com",
        "x-rapidapi-key": "YOUR_RAPIDAPI_KEY_HERE" // Replace with your actual RapidAPI key
      }
    });

    const data = await response.json();
    res.status(200).send(data);
  } catch (error) {
    console.error("Error fetching summary:", error); // Log the error
    res.status(500).send("Error fetching data: " + error.message);
  }
});
