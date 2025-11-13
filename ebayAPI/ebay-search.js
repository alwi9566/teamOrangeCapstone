import fetch from "node-fetch";

// store eBay dev account credentials
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
async function searchEbay(fbTtitle, limit = 20) {
  const token = await getAccessToken();
  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(fbTitle)}&limit=${limit}`;
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

searchEbay("vintage camera", 5).catch(console.error);