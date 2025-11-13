const Tesseract = require('tesseract.js');

// Use native fetch if available (Node 18+), otherwise require node-fetch
const fetch = globalThis.fetch || require('node-fetch');

// eBay API credentials
const CLIENT_ID = "ElyCariv-Capstone-PRD-e0ddfec83-ca98af90";
const CLIENT_SECRET = "PRD-0ddfec83f99c-91e5-417c-9e0c-1e5d";

// Clean and normalize the OCR output
function cleanText(text) {
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/[\[\]{}()]/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
    .trim();
}

// Extract text from image using Tesseract
async function extractTextFromImage(imagePath, options = {}) {
  const language = options.language || "eng";
  const cleanOutput = options.cleanOutput !== false;

  try {
    const result = await Tesseract.recognize(imagePath, language);
    const text = cleanOutput ? cleanText(result.data.text) : result.data.text;

    // Extract relevant information
    const fbTitle = text.match(/^[^$]*/)[0].trim();
    const fbTemp = text.match(/\$\d+\.?\d*/g);
    const fbPrice = fbTemp[0];
    const fbCondition = text.split(/Condition\s*(\S+)/)[1];
    //console.log("Cleaned price: " + typeof(fbPrice[0]));

    return {
      text,
      fbTitle,
      fbPrice,
      fbCondition,
      confidence: result.data.confidence,
      raw: result.data.text
    };
  } catch (error) {
    console.error('Error during OCR:', error);
    throw error;
  }
}

// Get OAuth token from eBay
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

// Search eBay using extracted data
async function searchEbay(fbTitle, fbPrice, fbCondition, limit = 20) {
  const token = await getAccessToken();
  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(fbTitle)}&limit=${limit}`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`}
  });

  if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
  const data = await res.json();

  if (!data.itemSummaries) {
    console.log("No results found.");
    return [];
  }

  console.log(`\n=== Search results for "${fbTitle}" ===`);
  console.log(`Extracted Price: ${fbPrice || 'N/A'}`);
  console.log(`Extracted Condition: ${fbCondition || 'N/A'}\n`);

  data.itemSummaries.forEach((item, index) => {
    const title = item.title;
    const brand = item.brand || 'N/A';
    const price = item.price?.value + " " + item.price?.currency;
    const url = item.itemWebUrl;
    const imageUrl = item.image;
    const condition = item.condition || 'N/A';
    
    console.log(`${index + 1}. ${title}`);
    console.log(`Brand: ${brand}`);
    console.log(`Price: $${price}`);
    console.log(`Condition: ${condition}`);
    console.log(`URL: ${url}`);
    console.log(imageUrl);
  });
  return data.itemSummaries;
  
}

// Main execution function
async function main() {
  const imagePath = './screenshot.png';

  try {
    console.log('Extracting text from image...');
    const { fbTitle, fbPrice, fbCondition, confidence } = await extractTextFromImage(
      imagePath, 
      { language: 'eng', cleanOutput: true }
    );

    //console.log(`OCR Confidence: ${confidence.toFixed(1)}%`);
    console.log('Extracted Title: ' + fbTitle);
    console.log('Extracted Price: ' + fbPrice);
    
    console.log('Searching eBay...');
    await searchEbay(fbTitle, fbPrice, fbCondition, 10);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the combined script
main();