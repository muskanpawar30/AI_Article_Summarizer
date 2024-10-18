/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



const functions = require('firebase-functions');
const fetch = require('node-fetch');

// Cloud function to fetch a summary from the RapidAPI service
exports.fetchSummary = functions.https.onRequest(async (req, res) => {
  try {
    const urlToSummarize = req.query.url; // Extract URL parameter from the request
    const response = await fetch(`https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${urlToSummarize}&length=3`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'article-extractor-and-summarizer.p.rapidapi.com',
        'x-rapidapi-key': 'VITE_RAPID_API_ARTICLE_KEY' // Replace with your actual RapidAPI key
      }
    });

    const data = await response.json();
    res.status(200).send(data);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).send('Error fetching data: ' + error.message);
  }
});
