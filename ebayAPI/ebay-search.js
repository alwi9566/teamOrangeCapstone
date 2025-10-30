// First, install tesseract.js:
// npm install tesseract.js

// Note: Add "type": "module" to your package.json to use ES6 imports
import Tesseract from 'tesseract.js';

// Clean and normalize the OCR output
function cleanText(text) {
  return text
    // Remove excessive whitespace
    .replace(/[ \t]+/g, ' ')
    // Remove excessive newlines (more than 2)
    .replace(/\n{3,}/g, '\n\n')
    // Remove spaces before punctuation
    .replace(/\s+([.,!?;:])/g, '$1')
    // Remove leading/trailing whitespace from each line
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
    // Final trim
    .trim();
}

// Extract and clean text from image
async function extractTextFromImage(imagePath, options = {}) {
  const {
    language = 'eng',
    cleanOutput = true,
    showProgress = false
  } = options;
  
  try {
    const result = await Tesseract.recognize(
      imagePath,
      language,
      {
        logger: info => {
          if (showProgress && info.status === 'recognizing text') {
            process.stdout.write(`\rProgress: ${Math.round(info.progress * 100)}%`);
          }
        }
      }
    );

    if (showProgress) console.log('\n');

    const text = cleanOutput ? cleanText(result.data.text) : result.data.text;

    return {
      text,
      confidence: result.data.confidence,
      raw: result.data.text
    };
  } catch (error) {
    console.error('Error during OCR:', error);
    throw error;
  }
  
}

// Example usage
const imagePath = './screenshot.png';

extractTextFromImage(imagePath, {language: 'eng', cleanOutput: true, showProgress: true})
  .then(({ text, confidence }) => {
    console.log(typeof text);
    console.log(`\n[Confidence: ${confidence.toFixed(1)}%]`);
  })
  .catch(error => {
    //console.error('Failed to process image:', error);
  });

// ebay-search.js
import fetch from "node-fetch";

// Replace with your eBay App credentials
const CLIENT_ID = "ElyCariv-Capstone-PRD-e0ddfec83-ca98af90";
const CLIENT_SECRET = "PRD-0ddfec83f99c-91e5-417c-9e0c-1e5d";

// Get an OAuth token from eBay
async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${auth}`
    },
    body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope"
  });

  if (!res.ok) throw new Error(`Token request failed: ${res.statusText}`);
  const data = await res.json();
  return data.access_token;
}

// Search for items using the eBay Browse API
async function searchEbay(query, limit = 20) {
  const token = await getAccessToken();

  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
  const data = await res.json();

  if (!data.itemSummaries) {
    console.log("No results found.");
    return;
  }

  console.log(`Search results for "${query}":\n`);
  data.itemSummaries.forEach(item => {
    const title = item.title;
    const brand = item.brand;
    const price = item.price?.value + " " + item.price?.currency;
    const url = item.itemWebUrl;
    const condition = item.condition;
    const description = item.description;
    console.log(`Title: ${title}\n  Brand: ${brand}\n Price: ${price}\n  URL: ${url}\n Condition: ${condition}\n Description: ${description}`);
  });
}

// Example usage: search for "vintage camera"
searchEbay("vintage camera", 5).catch(console.error);
