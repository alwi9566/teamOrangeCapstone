# RAVEN Chrome Extension

A Chrome extension to track and find marketplace listings across Craigslist and Ebay.

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The RAVEN extension icon should appear in your toolbar

## Structure

\`\`\`
/
├── manifest.json        # Extension configuration
├── popup.html          # Main popup interface
├── popup.css           # Styles for the popup
├── popup.js            # JavaScript functionality
├── icons/              # Extension icons (16x16, 48x48, 128x128)
└── images/             # Product images for listings
\`\`\`

## Adding Images

Create an `images` folder and add your product images:
- nike-matcha-1.jpg
- nike-matcha-2.jpg
- nike-matcha-3.jpg

Or update the image paths in `popup.js` to match your image locations.

## Creating Icons

Create an `icons` folder with three icon sizes:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)
- icon128.png (128x128 pixels)

You can use the RAVEN logo design with the yellow text on a dark background.

## Usage

Click the RAVEN extension icon to open the popup and browse listings filtered by platform (All, Craigslist, Ebay).
\`\`\`

```tsx file="app/page.tsx" isDeleted="true"
...deleted...
