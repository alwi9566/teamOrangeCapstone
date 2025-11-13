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
    const fbTempTitle = text.match(/^[^$]*/)[0];

    const fbTitle = fbTempTitle.replace(/\r?\n/g, '');

    const fbPrice = text.match(/\$\d+(\.\d{2})?/g);

    const fbCondition = text.split(/Condition\s*(\S+)/)[1];

    // Push as a single row (array)
    data.push([
      fbTitle || '', 
      fbPrice ? fbPrice.join(', ') : '', // Join multiple prices or use empty string
      fbCondition || ''
    ]);
    
    return {text, fbTitle, fbPrice, fbCondition, confidence: result.data.confidence, raw: result.data.text, data};
  } 
  
  catch (error) {
    console.error('Error during OCR:', error);
    throw error;
  }
}

function writeToCSV(filename, data, headers) {
  // Create CSV content
  let csvContent = '';
  
  // Add headers if provided
  if (headers && headers.length > 0) {
    csvContent += headers.join(',') + '\n';
  }
  
  // Add data rows
  data.forEach(row => {
    // Escape values that contain commas or quotes
    const escapedRow = row.map(value => {
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvContent += escapedRow.join(',') + '\n';
  });
  
  // Write to file
  fs.writeFileSync(filename, csvContent, 'utf8');
  console.log(`CSV file '${filename}' created successfully!`);
}

// Example usage
const imagePath = './screenshot.png';
const headers = ['Title', 'Price', 'Condition'];

// Process image and THEN write CSV
extractTextFromImage(imagePath, {language: 'eng', cleanOutput: true}, "./database.csv")
  .then(({ text, confidence, fbTitle, fbPrice, fbCondition}) => {
    //console.log(text);
    //console.log(`\n[Confidence: ${confidence.toFixed(1)}%]`);
    // console.log(fbTitle);
    // console.log(fbPrice);
    // console.log(fbCondition);
    
    // Write CSV after data is collected
    writeToCSV('database.csv', data, headers);
  })
  .catch(error => {
    console.error('Failed to process image:', error);
  });