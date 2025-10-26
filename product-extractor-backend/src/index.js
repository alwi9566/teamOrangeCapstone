/**
 * Product Extractor Backend - Smart AI Detection
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    try {
      console.log('Received extraction request');
      
      const { fullImage, profile } = await request.json();
      
      if (!fullImage) {
        throw new Error('Missing image');
      }

      console.log('Processing with AI vision...');

      if (!env.AI) {
        throw new Error('Cloudflare AI not configured');
      }

      // Convert base64 to array buffer
      const imageData = base64ToArrayBuffer(fullImage.split(',')[1]);

      console.log('Asking AI to extract product info...');

      // Better prompt - be very specific
      const result = await env.AI.run('@cf/unum/uform-gen2-qwen-500m', {
        image: Array.from(new Uint8Array(imageData)),
        prompt: "You are looking at a product listing webpage. Read all visible text carefully. What is the product name/title? What is the price in dollars? What is the product description? List only what you actually see, not placeholders.",
        max_tokens: 512
      });

      console.log('AI raw response:', result.description);

      // Parse the AI's response more intelligently
      const extracted = parseAIResponse(result.description || '', profile);

      console.log('Final extracted data:', extracted);

      return new Response(JSON.stringify({
        success: true,
        title: extracted.title || 'Not found',
        price: extracted.price || 'Not found',
        description: extracted.description || 'Not found',
        raw: result.description // Include raw response for debugging
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      console.error('Error:', error.message);
      
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function parseAIResponse(text, profile) {
  console.log('Parsing AI text:', text);
  
  const result = {
    title: '',
    price: '',
    description: ''
  };

  // Remove placeholder brackets if AI returned them
  text = text.replace(/\[Product Title\]/gi, '')
              .replace(/\[Price Here\]/gi, '')
              .replace(/\[Description Here\]/gi, '');

  // Extract price first (most reliable pattern)
  const pricePattern = /\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g;
  const prices = text.match(pricePattern);
  if (prices && prices.length > 0) {
    result.price = prices[0];
    console.log('Found price:', result.price);
  }

  // Split into lines and clean
  const lines = text.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 3)
    .filter(l => !l.match(/^(title|price|description):/i)); // Remove label words

  console.log('Clean lines:', lines);

  // First substantial line is likely the title
  const blacklist = (profile?.blacklistKeywords || '').split(',').map(k => k.trim().toLowerCase());
  
  for (let line of lines) {
    if (!result.title) {
      // Skip lines that are just the price
      if (line.includes('$') && line.length < 20) continue;
      
      // Skip blacklisted words
      if (blacklist.some(k => line.toLowerCase().includes(k))) continue;
      
      // This is probably the title
      if (line.length > 10 && line.split(/\s+/).length > 2) {
        result.title = line;
        console.log('Found title:', result.title);
        continue;
      }
    } else if (!result.description) {
      // After title, collect description lines
      if (line !== result.title && !line.includes(result.price)) {
        result.description = line;
        console.log('Found description start:', result.description);
      }
    }
  }

  // Fallback: use raw text
  if (!result.title && lines.length > 0) {
    result.title = lines[0];
  }
  
  if (!result.description && lines.length > 1) {
    result.description = lines.slice(1, 4).join(' ');
  }

  return result;
}