// Your actual backend URL
const BACKEND_URL = 'https://lingering-wind-f441.orangecaptstone.workers.dev';

const EXTRACTION_PROFILES = {
  "Craigslist": {
    "blacklistKeywords": "craigslist,posted",
    "imageYStart": 17,
    "imageYEnd": 68,
    "imageXStart": 19,
    "imageXEnd": 55
  },
  "eBay": {
    "blacklistKeywords": "ebay,cart",
    "imageYStart": 26,
    "imageYEnd": 92,
    "imageXStart": 10,
    "imageXEnd": 62
  },
  "Facebook": {
    "blacklistKeywords": "facebook,marketplace",
    "imageYStart": 4,
    "imageYEnd": 98,
    "imageXStart": 15,
    "imageXEnd": 69
  }
};

function detectProfileFromURL(url) {
    if (url.includes('craigslist.org')) return 'Craigslist';
    if (url.includes('ebay.com')) return 'eBay';
    if (url.includes('facebook.com/marketplace')) return 'Facebook';
    return null;
}

function cropRegion(canvas, yStart, yEnd, xStart, xEnd) {
    const y1 = Math.floor((yStart / 100) * canvas.height);
    const y2 = Math.floor((yEnd / 100) * canvas.height);
    const x1 = Math.floor((xStart / 100) * canvas.width);
    const x2 = Math.floor((xEnd / 100) * canvas.width);
    
    const cropped = document.createElement('canvas');
    cropped.width = x2 - x1;
    cropped.height = y2 - y1;
    cropped.getContext('2d').drawImage(canvas, x1, y1, cropped.width, cropped.height, 0, 0, cropped.width, cropped.height);
    
    return cropped;
}

async function extractProductData(screenshotDataURL, profile) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve, reject) => {
        img.onload = async () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                
                console.log('Sending full screenshot to AI for smart extraction...');
                
                // Just crop the product photo for display
                const photoCanvas = cropRegion(canvas, profile.imageYStart, profile.imageYEnd, profile.imageXStart, profile.imageXEnd);
                
                // Send ONLY the full image to backend - AI will detect everything!
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullImage: canvas.toDataURL('image/png'),
                        profile: profile
                    })
                });
                
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Backend error:', errorText);
                    throw new Error(`Backend error: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Received data from backend:', data);
                
                if (!data.success) {
                    throw new Error(data.error || 'Backend processing failed');
                }
                
                resolve({
                    title: data.title || 'Not found',
                    price: data.price || 'Not found',
                    description: data.description || 'Not found',
                    photoDataURL: photoCanvas.toDataURL('image/png')
                });
                
            } catch (error) {
                console.error('Extraction error:', error);
                reject(error);
            }
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = screenshotDataURL;
    });
}