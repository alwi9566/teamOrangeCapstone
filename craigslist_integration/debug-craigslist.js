/**
 * Craigslist Scraper DEBUG VERSION
 * This will show us what HTML Craigslist is actually using
 */

const puppeteer = require('puppeteer');

async function debugCraigslist() {
    console.log('Debugging Craigslist HTML structure...\n');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const searchUrl = 'https://sfbay.craigslist.org/search/sss?query=mountain+bike&sort=rel&min_price=100&max_price=500';
    
    console.log('Loading page:', searchUrl);
    await page.goto(searchUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
    });

    // Wait a bit for any dynamic content
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Take a screenshot to see what the page looks like
    await page.screenshot({ path: 'craigslist-debug.png' });
    console.log('Screenshot saved to: craigslist-debug.png\n');

    // Get all the HTML
    const html = await page.content();
    
    // Save full HTML for inspection
    const fs = require('fs');
    fs.writeFileSync('craigslist-debug.html', html);
    console.log('Full HTML saved to: craigslist-debug.html\n');

    // Try to find what elements exist
    const debug = await page.evaluate(() => {
        const info = {
            allClasses: [],
            listElements: [],
            linkElements: [],
            priceElements: []
        };

        // Find all unique classes on the page
        const allElements = document.querySelectorAll('*');
        const classSet = new Set();
        allElements.forEach(el => {
            if (el.className && typeof el.className === 'string') {
                el.className.split(' ').forEach(c => classSet.add(c));
            }
        });
        info.allClasses = Array.from(classSet).filter(c => 
            c.includes('result') || 
            c.includes('listing') || 
            c.includes('search') ||
            c.includes('item') ||
            c.includes('card') ||
            c.includes('gallery')
        ).slice(0, 30);

        // Find <li> elements
        document.querySelectorAll('li').forEach((li, idx) => {
            if (idx < 5) {
                info.listElements.push({
                    index: idx,
                    classes: li.className,
                    id: li.id,
                    innerHTML: li.innerHTML.substring(0, 200)
                });
            }
        });

        // Find links that might be listings
        document.querySelectorAll('a').forEach((a, idx) => {
            if (idx < 10 && a.href.includes('craigslist')) {
                info.linkElements.push({
                    text: a.textContent.trim().substring(0, 50),
                    href: a.href,
                    classes: a.className
                });
            }
        });

        // Find price elements
        document.querySelectorAll('*').forEach(el => {
            const text = el.textContent;
            if (text && text.match(/\$\d+/) && info.priceElements.length < 10) {
                info.priceElements.push({
                    tag: el.tagName,
                    classes: el.className,
                    text: text.substring(0, 50)
                });
            }
        });

        return info;
    });

    console.log('='.repeat(80));
    console.log('RELEVANT CLASSES FOUND:');
    console.log('='.repeat(80));
    console.log(debug.allClasses.join(', '));
    console.log();

    console.log('='.repeat(80));
    console.log('LIST ELEMENTS (<li>):');
    console.log('='.repeat(80));
    debug.listElements.forEach(li => {
        console.log(`\nIndex: ${li.index}`);
        console.log(`Classes: ${li.classes}`);
        console.log(`ID: ${li.id}`);
        console.log(`HTML preview: ${li.innerHTML}`);
    });
    console.log();

    console.log('='.repeat(80));
    console.log('LINK ELEMENTS:');
    console.log('='.repeat(80));
    debug.linkElements.forEach(link => {
        console.log(`\nText: ${link.text}`);
        console.log(`Classes: ${link.classes}`);
        console.log(`URL: ${link.href}`);
    });
    console.log();

    console.log('='.repeat(80));
    console.log('PRICE ELEMENTS:');
    console.log('='.repeat(80));
    debug.priceElements.forEach(price => {
        console.log(`\nTag: ${price.tag}`);
        console.log(`Classes: ${price.classes}`);
        console.log(`Text: ${price.text}`);
    });

    await browser.close();
    
    console.log('\n' + '='.repeat(80));
    console.log('Check the files created:');
    console.log('- craigslist-debug.png (screenshot)');
    console.log('- craigslist-debug.html (full HTML source)');
    console.log('='.repeat(80));
}

debugCraigslist();