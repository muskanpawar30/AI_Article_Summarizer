const fetch = require("node-fetch");

// API route to fetch a summary from the RapidAPI service
module.exports = async (req, res) => {
  try {
    // Extract the URL from the request body or query parameters
    const urlToSummarize = req.query.url || req.body.url; // Adjust this based on how you're sending the URL

    if (!urlToSummarize) {
      return res.status(400).send("Missing URL to summarize.");
    }

    const response = await fetch(
      `https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${encodeURIComponent(urlToSummarize)}&length=3`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "article-extractor-and-summarizer.p.rapidapi.com",
          "x-rapidapi-key": process.env.VITE_RAPID_API_ARTICLE_KEY, // Use environment variable for the key
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
};
