const puppeteer = require('puppeteer');

async function scrapeSite(url) {
    console.log(`🕷️ Scraping via Puppeteer: ${url}...`);
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        // User Agent mobile-like as fallback or desktop
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Tenta encontrar links de navegação para "Servicios" ou "Services"
        const navLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            return links
                .filter(a => a.innerText.match(/servi|solu|what|que/i))
                .map(a => ({ text: a.innerText, href: a.href }));
        });

        console.log(`🔗 Links de navegação potenciais: ${JSON.stringify(navLinks.slice(0, 5))}`);

        // Extrair texto visível principal
        const text = await page.evaluate(() => document.body.innerText);
        
        // Se houver um link muito óbvio de "Servicios", vamos nele
        const servicesLink = navLinks.find(l => l.text.toLowerCase().includes('servi') || l.text.toLowerCase().includes('services'));
        
        let servicesText = "";
        if (servicesLink && servicesLink.href !== url) {
            console.log(`➡️ Navegando para página de serviços: ${servicesLink.href}`);
            await page.goto(servicesLink.href, { waitUntil: 'networkidle2' });
            servicesText = await page.evaluate(() => document.body.innerText);
        }

        return {
            mainPage: text.substring(0, 2000), // Limitando para log
            servicesPage: servicesText.substring(0, 2000)
        };

    } catch (error) {
        console.error("Erro no scraping:", error);
        return { error: error.message };
    } finally {
        await browser.close();
    }
}

// Execução direta
if (require.main === module) {
    const url = process.argv[2] || 'https://www.efamaa.com/';
    scrapeSite(url).then(res => {
        console.log("--- MAIN PAGE ---");
        console.log(res.mainPage);
        if (res.servicesPage) {
            console.log("\n--- SERVICES PAGE ---");
            console.log(res.servicesPage);
        }
    });
}
