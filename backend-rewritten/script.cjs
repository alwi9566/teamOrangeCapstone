async function tesseract_extract(path){
    //import tesseract.js as worker
    const {createWorker} = require('tesseract.js');

    //initialize worker, passing english as detection language
    const worker = await createWorker('eng');

    (async () => {

    const {data:{text}} = await worker.recognize(path);

    //for debugging purposes
    //console.log(text);

    //terminate worker
    await worker.terminate();

    //extract title using text before first dollar sign
    const facebook_title = text.match(/^[^$]*/)[0].trim();
    //extract price using digits immediately following first dollar sign
    const facebook_price = text.match(/\$\d+\.?\d*/g)[0];
    
    const facebook_condition = text.split(/Condition\s*(\S+)/)[1];
    //debugging 
    //console.log(facebook_title);
    //console.log(facebook_price);
    //console.log(facebook_condition);

    //cleaned and isolated elements of the facebook listing
    return {
        facebook_title,
        facebook_price,
        facebook_condition
    }

})();
}

//call OCR text detection function
//tesseract_extract('screenshot.png');

//credentials associated with eBay developer account
const client_id = 'ElyCariv-Capstone-PRD-e0ddfec83-ca98af90';
const client_secret = 'PRD-0ddfec83f99c-91e5-417c-9e0c-1e5d';

async function generateToken (id, secret){
    const credentials = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

    const oauth_url = 'https://api.ebay.com/identity/v1/oauth2/token';

    const token_response = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
        method: "POST", 
        headers:{"Content-Type": "application/x-www-form-urlencoded", "Authorization": `Basic ${credentials}`},
        body:'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
    });

    //console.log(token_response);

    const token = await token_response.json();

    //for debugging purposes
    //console.log(token.access_token);

    //pass token to ebaySearch();
    return token.access_token;
};


//call token generation for debugging
//generateToken();

async function ebaySearch(title, price, condition, limit){

    //call token generation function, store token
    const token = await generateToken();

    //build API url using title, price, condition, and response limit
    const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(title)}&filter=price:[${price}..${price}],conditions:${condition}&limit=${limit}`;

    //fetch API response, passing token and storing as variable "response"
    const response = await fetch (url, {headers: { Authorization: `Bearer ${token}`}});

    const data = response.json;
    console.log(JSON.stringify(data));

    //for debugging 
    //console.log(response);
}

//call ebay search for debugging
ebaySearch('Apple iPad Pro', '$200', 'New', 10);

//main function
async function main(){

    //define screenshot patch
    const image_path = './screenshot.png';

    //define eBay query limit
    const limit = 10;

    //for debugging
    console.log('Extracting text form image...');

    //call tesseract_extract and store responses as title, price, and condition
    const {title, price, condition} = await tesseract_extract(image_path);
    console.log(title);
    console.log(price);
    console.log(condition);

    //for debugging
    console.log('Searching eBay...');

    //run eBay search using title, price, condition information from facebook, and query limit defined in main();
    await ebaySearch(title, price, condition, limit);
}

//call main (final debugging step)
//main();