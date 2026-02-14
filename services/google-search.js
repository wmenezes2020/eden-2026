const puppeteer = require('puppeteer');

async function googleSearch(query) {
    console.log(`🔍 Buscando no Google: "${query}"...`);
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=pt-BR,pt']
    });
    
    try {
        const page = await browser.newPage();
        // User Agent normal para evitar detecção básica
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&hl=pt-BR`, { waitUntil: 'domcontentloaded' });

        // Tenta esperar pelo container de resultados OU widget de conversão
        try {
            await page.waitForSelector('#search', { timeout: 10000 });
        } catch (e) {
            console.log("Container #search não encontrado, verificando snapshot...");
        }

        // Extrair dados específicos de cotação se houver
        const conversion = await page.evaluate(() => {
            const el = document.querySelector('.DFlfde.SwHCTb'); // Classe comum do valor do dólar
            return el ? el.innerText : null;
        });

        if (conversion) {
            console.log(`💰 Cotação Detectada: ${conversion}`);
        }

        // Extrair resultados genéricos
        const results = await page.evaluate(() => {
            const data = [];
            const items = document.querySelectorAll('.g'); // Container genérico de resultado
            
            items.forEach(item => {
                const titleEl = item.querySelector('h3');
                const linkEl = item.querySelector('a');
                const snippetEl = item.querySelector('.VwiC3b');

                if (titleEl && linkEl) {
                    data.push({
                        title: titleEl.innerText,
                        url: linkEl.href,
                        snippet: snippetEl ? snippetEl.innerText : ''
                    });
                }
            });
            return data;
        });

        console.log(`✅ Encontrados ${results.length} resultados.`);
        if (conversion) {
            results.unshift({ title: "Cotação Direta", url: "google.com", snippet: `Valor: ${conversion}` });
        }
        
        return results;

    } catch (error) {
        console.error("Erro na busca Puppeteer:", error);
        return [];
    } finally {
        await browser.close();
    }
}

// Se executado diretamente
if (require.main === module) {
    const args = process.argv.slice(2);
    const query = args.join(' ') || "Cotação Dólar Hoje";
    
    googleSearch(query).then(res => {
        console.log(JSON.stringify(res, null, 2));
    });
}

module.exports = { googleSearch };
