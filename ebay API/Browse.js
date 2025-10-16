//get credentials
import fetch from "node-fetch";

const clientId = "YOUR_CLIENT_ID";
const clientSecret = "YOUR_CLIENT_SECRET";

async function getAccessToken() {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`
        },
        body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope"
    });

    const data = await response.json();
    return data.access_token;
}

// Usage
getAccessToken().then(token => console.log("Access token:", token));

//call API
async function searchItems(query) {
    const token = await getAccessToken();

    const response = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&limit=5`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();
    return data.itemSummaries;
}

// Example usage:
searchItems("laptop").then(items => console.log(items));
