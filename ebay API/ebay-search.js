// ebay-search.js
import fetch from "node-fetch";

// Replace with your eBay App credentials
const CLIENT_ID = "";
const CLIENT_SECRET = "";

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
async function searchEbay(query, limit = 5) {
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
    const price = item.price?.value + " " + item.price?.currency;
    const url = item.itemWebUrl;
    console.log(`- ${title}\n  💲 ${price}\n  🔗 ${url}\n`);
  });
}

// Example usage: search for "vintage camera"
searchEbay("vintage camera", 5).catch(console.error);
