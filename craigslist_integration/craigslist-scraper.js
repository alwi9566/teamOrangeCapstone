
const puppeteer = require('puppeteer');

class CraigslistScraper {
    constructor(location = 'sfbay') {
        this.baseUrl = `https://${location}.craigslist.org`;
        this.location = location;
    }

    /**
     * Search Craigslist for items
     * @param {Object} options - Search options
     * @param {string} options.query - Search term (item name)
     * @param {string} options.category - Category code (default: 'sss' for all for sale)
     * @param {number} options.minPrice - Minimum price
     * @param {number} options.maxPrice - Maximum price
     * @param {number} options.maxResults - Max number of results (default: 20)
     * @param {boolean} options.verbose - Print status messages (default: false)
     * @returns {Promise<Array>} Array of listing objects
     */
    async search(options = {}) {
        const {
            query,
            category = 'sss',
            minPrice = null,
            maxPrice = null,
            maxResults = 20,
            verbose = false
        } = options;

        if (!query) {
            throw new Error('Search query is required');
        }

        // Build search URL with parameters
        const params = new URLSearchParams({
            query: query,
            sort: 'rel'
        });

        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);

        const searchUrl = `${this.baseUrl}/search/${category}?${params.toString()}`;

        if (verbose) {
            console.log(`Searching for '${query}'...`);
            console.log(`URL: ${searchUrl}`);
        }

        let browser;
        try {
            // Launch headless browser
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            
            // Set user agent
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            
            // Navigate to search page
            await page.goto(searchUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait for results to load
            await page.waitForSelector('.cl-search-result, .cl-static-search-result, .gallery-card', {
                timeout: 10000
            }).catch(() => {
                if (verbose) console.log('No results container found - page might be empty');
            });

            // Extract listings from the page
            const results = await page.evaluate((maxResults) => {
                const listings = [];
                
                // Try different selectors (Craigslist uses various classes)
                const resultElements = document.querySelectorAll('.cl-search-result, .cl-static-search-result, .gallery-card, li.result-row');
                
                for (let i = 0; i < Math.min(resultElements.length, maxResults); i++) {
                    const element = resultElements[i];
                    const listing = {};

                    // Get title and URL
                    const titleLink = element.querySelector('a.main, a.titlestring, a.posting-title, .title a');
                    if (titleLink) {
                        listing.title = titleLink.textContent.trim();
                        listing.url = titleLink.href;
                    }

                    // Get price
                    const priceElement = element.querySelector('.priceinfo, .price, .result-price');
                    if (priceElement) {
                        const priceText = priceElement.textContent.trim();
                        const priceMatch = priceText.match(/\$?([\d,]+)/);
                        listing.price = priceMatch ? priceMatch[1].replace(/,/g, '') : 'N/A';
                    } else {
                        listing.price = 'N/A';
                    }

                    // Get location
                    const locationElement = element.querySelector('.location, .result-hood');
                    if (locationElement) {
                        listing.location = locationElement.textContent.trim().replace(/[()]/g, '');
                    } else {
                        listing.location = 'N/A';
                    }

                    // Get date
                    const dateElement = element.querySelector('.date, time, .result-date');
                    if (dateElement) {
                        listing.date = dateElement.textContent.trim();
                    } else {
                        listing.date = 'N/A';
                    }

                    if (listing.title) {
                        listings.push(listing);
                    }
                }

                return listings;
            }, maxResults);

            if (verbose) {
                console.log(`Found ${results.length} results`);
            }

            await browser.close();
            return results;

        } catch (error) {
            console.error('Error searching Craigslist:', error.message);
            if (browser) await browser.close();
            return [];
        }
    }
}

// ============================================================================
// USAGE EXAMPLE - Test this locally in Node.js
// ============================================================================

async function testScraper() {
    console.log('Testing Craigslist Scraper with Puppeteer...\n');

    // Create scraper instance
    const scraper = new CraigslistScraper('sfbay'); // Change to your location

    // Test search
    const results = await scraper.search({
        query: 'mountain bike',
        minPrice: 100,
        maxPrice: 500,
        maxResults: 10,
        verbose: true
    });

    // Display results
    console.log('\n' + '='.repeat(80));
    console.log('SEARCH RESULTS');
    console.log('='.repeat(80) + '\n');

    if (results.length > 0) {
        results.forEach((item, index) => {
            console.log(`${index + 1}. ${item.title}`);
            console.log(`   Price: $${item.price}`);
            console.log(`   Location: ${item.location}`);
            console.log(`   Date: ${item.date}`);
            console.log(`   URL: ${item.url}`);
            console.log();
        });
    } else {
        console.log('No results found.');
    }

    process.exit(0);
}

// Run test if this file is executed directly
if (require.main === module) {
    testScraper();
}

// Export for use in other files
module.exports = CraigslistScraper;