# RAVEN Chrome Extension

A Chrome extension for aggregating marketplace listings from eBay, Craigslist, and other platforms.

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Loading in Chrome

1. Build the extension: `npm run build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist` folder

## Project Structure

```
├── src/
│   ├── components/       # React components
│   ├── styles/          # CSS files
│   ├── types/           # TypeScript types
│   └── popup.tsx        # Entry point
├── manifest.json        # Chrome extension manifest
├── background.js        # Service worker
├── popup.html          # Popup HTML
└── vite.config.ts      # Vite configuration
```

## Features

- Dark mode UI matching Figma design
- Platform filtering (All, Ebay, Craigslist)
- Statistics display (Listings Found, Average Price)
- Listing cards with images and prices
- Responsive popup layout

