// import Tesseract from 'tesseract.js';
const Tesseract = require('tesseract.js');
const fs = require('fs');

let data = [];

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
async function extractTextFromImage(imagePath, options = {}, filePath) {
  
  const language = "eng"

  const cleanOutput = true

  // init tesseract 
  try {
    const result = await Tesseract.recognize(imagePath, language);

    const text = cleanOutput ? cleanText(result.data.text) : result.data.text;

    // regex to isolate information to later be passed to ebay Browse API
    const fbTitle = text.match(/^[^$]*/)[0];

    const fbPrice = text.match(/\$\d+(\.\d{2})?/g);

    const fbCondition = text.split(/Condition\s*(\S+)/)[1];

    data.push(fbTitle);
    data.push(fbPrice);
    data.push(fbCondition);
    return {text, fbTitle, fbPrice, fbCondition, confidence: result.data.confidence, raw: result.data.text, data};
  } 
  
  catch (error) {
    console.error('Error during OCR:', error);
    throw error;
  }
}

// Example usage
const imagePath = './screenshot.png';

extractTextFromImage(imagePath, {language: 'eng', cleanOutput: true}, "./database.csv")
  .then(({ text, confidence, fbTitle, fbPrice, fbCondition}) => {
    //console.log(text);
    //console.log(`\n[Confidence: ${confidence.toFixed(1)}%]`);
    // console.log(fbTitle);
    // console.log(fbPrice);
    // console.log(fbCondition);
  })
  .catch(error => {
    //console.error('Failed to process image:', error);
  });

function writeToCSV(filename, data, headers) {
  // Create CSV content
  let csvContent = '';
  
  // Add headers if provided
  if (headers && headers.length > 0) {
    csvContent += headers.join(',') + '\n';
  }
  
  // Add data rows
  data.forEach(row => {
    csvContent += row.join(',') + '\n';
  });
  
  // Write to file
  fs.writeFileSync(filename, csvContent, 'utf8');
  console.log(`CSV file '${filename}' created successfully!`);
}

// Example usage for Node.js:
const headers = ['Title', 'Price', 'Condition'];
// data = [
//   ['John Doe', '30', 'New York'],
//   ['Jane Smith', '25', 'Los Angeles'],
//   ['Bob Johnson', '35', 'Chicago']
// ];

writeToCSV('database.csv', data, headers);