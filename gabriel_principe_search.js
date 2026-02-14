const puppeteer = require('puppeteer');

async function searchGabrielPrincipe() {
  console.log('🎤 Iniciando busca sobre Gabriel O Príncipe de Aracajú...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Arrays para armazenar resultados
  const results = {
    biografia: [],
    musicas: [],
    redesSociais: [],
    noticias: [],
    estadisticas: []
  };

  try {
    // Busca 1: Google Search
    console.log('🔍 Buscando no Google...');
    await page.goto('https://www.google.com/search?q=Gabriel+O+Pr%C3%ADncipe+de+Aracaj%C3%BAs+cantor+biografia', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    const googleResults = await page.evaluate(() => {
      const items = document.querySelectorAll('div.g');
      return Array.from(items).slice(0, 5).map(item => ({
        titulo: item.querySelector('h3')?.textContent || '',
        descricao: item.querySelector('.VwiC3b')?.textContent?.substring(0, 200) || '',
        link: item.querySelector('a')?.href || ''
      }));
    });
    
    results.noticias = googleResults;
    console.log(`✅ Encontrados ${googleResults.length} resultados do Google\n`);
    
    // Busca 2: Instagram (pode requerir login, vamos tentar)
    console.log('🔍 Verificando Instagram...');
    try {
      await page.goto('https://www.instagram.com/gabrieloprincipe_oficial/', {
        waitUntil: 'networkidle0',
        timeout: 15000
      });
      
      const instaInfo = await page.evaluate(() => {
        const stats = document.querySelectorAll('ul li span');
        const username = document.querySelector('h2')?.textContent || '';
        const bio = document.querySelector('div.-vDIg span')?.textContent || '';
        return { username, bio, stats: Array.from(stats).map(s => s.textContent) };
      });
      
      if (instaInfo.username) {
        results.redesSociais.push({ plataforma: 'Instagram', ...instaInfo });
        console.log(`✅ Instagram: @${instaInfo.username}\n`);
      }
    } catch (e) {
      console.log('⚠️ Instagram requer login ou não acessível\n');
    }
    
    // Busca 3: TikTok
    console.log('🔍 Verificando TikTok...');
    try {
      await page.goto('https://www.tiktok.com/@gabrieloprincipe_oficial', {
        waitUntil: 'networkidle0',
        timeout: 15000
      });
      
      const tiktokInfo = await page.evaluate(() => {
        const followers = document.querySelector('[data-e2e="followers-count"]')?.textContent || '';
        const likes = document.querySelector('[data-e2e="likes-count"]')?.textContent || '';
        const videos = document.querySelector('[data-e2e="video-count"]')?.textContent || '';
        return { followers, likes, videos };
      });
      
      if (tiktokInfo.followers) {
        results.redesSociais.push({ plataforma: 'TikTok', ...tiktokInfo });
        console.log(`✅ TikTok: ${tiktokInfo.followers} seguidores\n`);
      }
    } catch (e) {
      console.log('⚠️ TikTok pode ter bloqueado o acesso\n');
    }
    
    // Busca 4: YouTube
    console.log('🔍 Verificando YouTube...');
    await page.goto('https://www.youtube.com/@GabrielOPrincipe', {
      waitUntil: 'networkidle0',
      timeout: 15000
    });
    
    const youtubeInfo = await page.evaluate(() => {
      const subscribers = document.querySelector('#subscriber-count')?.textContent || '';
      const name = document.querySelector('#text')?.textContent || '';
      return { name, subscribers };
    });
    
    if (youtubeInfo.name) {
      results.redesSociais.push({ plataforma: 'YouTube', ...youtubeInfo });
      console.log(`✅ YouTube: ${youtubeInfo.name} - ${youtubeInfo.subscribers}\n`);
    }
    
    // Busca 5: Wikipedia (se existir)
    console.log('🔍 Verificando Wikipedia...');
    await page.goto('https://pt.wikipedia.org/wiki/Gabriel_O_Pr%C3%ADncipe_de_Aracaj%C3%BAs', {
      waitUntil: 'networkidle0',
      timeout: 10000
    });
    
    const wikiContent = await page.evaluate(() => {
      const title = document.querySelector('#firstHeading')?.textContent || '';
      const content = document.querySelector('#mw-content-text')?.textContent?.substring(0, 1000) || '';
      return { title, content };
    });
    
    if (wikiContent.title && !wikiContent.title.includes('não existe')) {
      results.biografia.push(wikiContent);
      console.log(`✅ Wikipedia encontrado\n`);
    }
    
    // Busca 6: Spotify
    console.log('🔍 Verificando Spotify...');
    await page.goto('https://open.spotify.com/search/gabriel%20o%20principe', {
      waitUntil: 'networkidle0',
      timeout: 15000
    });
    
    const spotifyInfo = await page.evaluate(() => {
      const artists = document.querySelectorAll('[data-testid="artist-row"]');
      return Array.from(artists).slice(0, 3).map(a => ({
        nome: a.querySelector('span')?.textContent || '',
        ouvintes: a.querySelector('[data-testid="subtitle"]')?.textContent || ''
      }));
    });
    
    if (spotifyInfo.length > 0) {
      results.redesSociais.push({ plataforma: 'Spotify', artistas: spotifyInfo });
      console.log(`✅ Spotify: ${spotifyInfo.length} artistas encontrados\n`);
    }
    
    // Busca 7: Letras.mus.br
    console.log('🔍 Verificando músicas no Letras.mus.br...');
    await page.goto('https://www.letras.mus.br/gabriel-o-principe/', {
      waitUntil: 'networkidle0',
      timeout: 15000
    });
    
    const letrasInfo = await page.evaluate(() => {
      const songs = document.querySelectorAll('.songList-song');
      return Array.from(songs).slice(0, 10).map(s => ({
        titulo: s.querySelector('.song-name')?.textContent || '',
        views: s.querySelector('.views')?.textContent || ''
      }));
    });
    
    if (letrasInfo.length > 0) {
      results.musicas = letrasInfo;
      console.log(`✅ Letras.mus.br: ${letrasInfo.length} músicas encontradas\n`);
    }
    
  } catch (error) {
    console.log(`❌ Erro durante busca: ${error.message}\n`);
  }
  
  await browser.close();
  
  // Gera relatório final
  console.log('='.repeat(60));
  console.log('📊 RELATÓRIO: Gabriel O Príncipe de Aracajú');
  console.log('='.repeat(60) + '\n');
  
  console.log('🎤 REDES SOCIAIS ENCONTRADAS:');
  results.redesSociais.forEach(rs => {
    console.log(`   - ${rs.plataforma}:`, JSON.stringify(rs));
  });
  console.log('');
  
  console.log('🎵 MÚSICAS/PRINCIPAIS HITS:');
  results.musicas.slice(0, 5).forEach((m, i) => {
    console.log(`   ${i+1}. ${m.titulo} (${m.views})`);
  });
  console.log('');
  
  console.log('📰 NOTÍCIAS/BIOGRAFIA:');
  results.noticias.slice(0, 3).forEach((n, i) => {
    console.log(`   ${i+1}. ${n.titulo}`);
    console.log(`      ${n.descricao.substring(0, 100)}...`);
  });
  console.log('');
  
  // Salva em arquivo
  const fs = require('fs');
  fs.writeFileSync('/root/clawd/gabriel_principe_pesquisa.json', JSON.stringify(results, null, 2));
  console.log('💾 Dados salvos em: /root/clawd/gabriel_principe_pesquisa.json');
  
  return results;
}

searchGabrielPrincipe().catch(console.error);
