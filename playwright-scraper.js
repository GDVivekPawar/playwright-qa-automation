const { chromium } = require('playwright');

async function scrapeAndSum() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const seeds = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    let grandTotal = 0;
    
    for (const seed of seeds) {
        try {
            const url = `https://datadash-qa.vercel.app/seed${seed}`;
            console.log(`Scraping ${url}...`);
            
            await page.goto(url, { waitUntil: 'networkidle' });
            
            // Extract all numbers from tables
            const numbers = await page.evaluate(() => {
                const tables = document.querySelectorAll('table');
                const allNumbers = [];
                
                tables.forEach(table => {
                    const cells = table.querySelectorAll('td, th');
                    cells.forEach(cell => {
                        const text = cell.textContent.trim();
                        const numbers = text.match(/-?\d+\.?\d*/g);
                        if (numbers) {
                            numbers.forEach(num => {
                                const parsed = parseFloat(num);
                                if (!isNaN(parsed)) {
                                    allNumbers.push(parsed);
                                }
                            });
                        }
                    });
                });
                
                return allNumbers;
            });
            
            const seedTotal = numbers.reduce((sum, num) => sum + num, 0);
            console.log(`Seed ${seed} total: ${seedTotal}`);
            grandTotal += seedTotal;
            
        } catch (error) {
            console.error(`Error scraping seed ${seed}:`, error);
        }
    }
    
    await browser.close();
    
    console.log(`FINAL TOTAL SUM: ${grandTotal}`);
    return grandTotal;
}

scrapeAndSum().catch(console.error);
