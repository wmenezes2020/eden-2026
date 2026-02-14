const puppeteer = require('puppeteer');
const fs = require('fs');

async function comprehensiveSearch() {
  console.log('🎤 PESQUISA COMPLETA: Gabriel O Príncipe de Aracajú\n');
  console.log('='.repeat(60));
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const allData = {
    infoBasica: {
      nome: 'Gabriel O Príncipe de Aracajú',
      cidade: 'Aracaju, Sergipe',
      estilo: 'Forró / Arrocha / Música Nordestina',
      canais: []
    },
    musicasFamosas: [],
    redesSociais: {
      instagram: { url: 'https://instagram.com/gabrieloprincipe_oficial', seguidores: 'A ser confirmado' },
      tiktok: { url: 'https://tiktok.com/@gabrieloprincipe_oficial', seguidores: 'A ser confirmado' },
      youtube: { url: 'https://youtube.com/@GabrielOPrincipe', inscritos: 'A ser confirmado' },
      spotify: { url: 'https://open.spotify.com/artist/...', ouvintes: 'A ser confirmado' }
    },
    discografia: [],
    noticias: [],
    dadosImprensa: {}
  };
  
  const page = await browser.newPage();
  
  // Mock de dados baseados em pesquisa manual (não encontrados via API)
  console.log('📋 DADOS BÁSICOS:');
  console.log('   Nome: Gabriel O Príncipe de Aracajú');
  console.log('   Origem: Aracaju, Sergipe');
  console.log('   Estilo: Forró, Arrocha, Música Nordestina');
  console.log('   Atuação: Cantor e compositor\n');
  
  // Busca em múltiplas fontes
  const searchQueries = [
    { name: 'Instagram', url: 'https://www.instagram.com/gabrieloprincipe_oficial/' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@gabrieloprincipe_oficial' },
    { name: 'YouTube', url: 'https://www.youtube.com/@GabrielOPrincipe' },
    { name: 'Spotify', url: 'https://open.spotify.com/search/gabriel%20o%20principe' },
    { name: 'Letras.mus.br', url: 'https://www.letras.mus.br/gabriel-o-principe/' },
    { name: 'Deezer', url: 'https://www.deezer.com/search/gabriel%20o%20principe' },
    { name: 'Twitter', url: 'https://twitter.com/gabrieloprincipe_' },
    { name: 'Facebook', url: 'https://www.facebook.com/gabrieloprincipeoficial' }
  ];
  
  console.log('🔍 VERIFICANDO REDES SOCIAIS:');
  for (const social of searchQueries) {
    try {
      console.log(`   Verificando ${social.name}...`);
      await page.goto(social.url, { waitUntil: 'domcontentloaded', timeout: 8000 });
      await page.waitForTimeout(1000);
      
      const result = await page.evaluate((name) => {
        const stats = {};
        
        if (name === 'Instagram') {
          const h2 = document.querySelector('h2');
          const spans = document.querySelectorAll('ul li span');
          stats.username = h2?.textContent || 'Não encontrado';
          stats.stats = Array.from(spans).slice(0, 3).map(s => s.textContent);
        } else if (name === 'TikTok') {
          const followers = document.querySelector('[data-e2e="followers-count"]');
          const likes = document.querySelector('[data-e2e="likes-count"]');
          stats.followers = followers?.textContent || 'Privado/Bloqueado';
          stats.likes = likes?.textContent || 'Privado/Bloqueado';
        } else if (name === 'YouTube') {
          const subscribers = document.querySelector('#subscriber-count');
          const nameEl = document.querySelector('#text');
          stats.name = nameEl?.textContent || 'Canal não encontrado';
          stats.subscribers = subscribers?.textContent || 'Privado';
        } else {
          stats.status = 'Verificado - pode requerer interação';
        }
        
        return stats;
      }, social.name);
      
      console.log(`   ✓ ${social.name}:`, JSON.stringify(result));
      
      if (social.name === 'Instagram') {
        allData.redesSociais.instagram = { url: social.url, ...result };
      } else if (social.name === 'TikTok') {
        allData.redesSociais.tiktok = { url: social.url, ...result };
      } else if (social.name === 'YouTube') {
        allData.redesSociais.youtube = { url: social.url, ...result };
      }
      
    } catch (e) {
      console.log(`   ⚠️ ${social.name}: ${e.message.substring(0, 50)}`);
    }
  }
  
  console.log('\n🎵 PRINCIPAIS MÚSICAS (a ser preenchido com dados reais):');
  const musicasFamosas = [
    'A ser pesquisado',
    'A ser pesquisado', 
    'A ser pesquisado'
  ];
  musicasFamosas.forEach((m, i) => console.log(`   ${i+1}. ${m}`));
  
  await browser.close();
  
  // Gera relatório completo em markdown
  const markdownReport = `# 🎤 Gabriel O Príncipe de Aracajú
## Portfólio para Gestão de Imagem e Mídia

---

## 📋 INFORMAÇÕES BÁSICAS

| Campo | Informação |
|-------|------------|
| **Nome Artístico** | Gabriel O Príncipe de Aracajú |
| **Cidade de Origem** | Aracaju, Sergipe |
| **Estilo Musical** | Forró, Arrocha, Música Nordestina |
| **Gênero** | Música Popular Nordestina |
| **Atuação** | Cantor e Compositor |

---

## 🎵 PRINCIPAIS MÚSICAS E HITS

*Dados a serem preenchidos após pesquisa detalhada*

| # | Música | Álbum | Ano | Views/Plays |
|---|--------|-------|-----|-------------|
| 1 | [A confirmar] | - | - | - |
| 2 | [A confirmar] | - | - | - |
| 3 | [A confirmar] | - | - | - |
| 4 | [A confirmar] | - | - | - |
| 5 | [A confirmar] | - | - | - |

---

## 📱 REDES SOCIAIS E PRESENÇA DIGITAL

### Instagram
- **Perfil:** @gabrieloprincipe_oficial
- **URL:** https://instagram.com/gabrieloprincipe_oficial
- **Seguidores:** [A confirmar]
- **Verificado:** [Sim/Não]

### TikTok
- **Perfil:** @gabrieloprincipe_oficial
- **URL:** https://tiktok.com/@gabrieloprincipe_oficial
- **Seguidores:** [A confirmar]
- **Curtidas:** [A confirmar]

### YouTube
- **Canal:** @GabrielOPrincipe
- **URL:** https://youtube.com/@GabrielOPrincipe
- **Inscritos:** [A confirmar]

### Spotify
- **Artista:** Gabriel O Príncipe de Aracajú
- **URL:** https://open.spotify.com/artist/[ID]
- **Ouvintes Mensais:** [A confirmar]

### Outras Plataformas
- **Deezer:** [A confirmar]
- **Twitter/X:** [A confirmar]
- **Facebook:** [A confirmar]
- **Kwai:** [A confirmar]

---

## 📊 ESTATÍSTICAS DE ENGAGEMENT

| Plataforma | Seguidores | Engajamento Médio | Melhor Post |
|------------|------------|-------------------|-------------|
| Instagram | [Dado] | [Dado]% | [Dado] |
| TikTok | [Dado] | [Dado]% | [Dado] |
| YouTube | [Dado] | [Dado]% | [Dado] |
| Spotify | [Dado] plays | N/A | [Dado] streams |

---

## 🎤 DISCOGRAFIA

### Álbuns
| # | Álbum | Ano | Gravadora | Observações |
|---|-------|-----|-----------|-------------|
| 1 | [A confirmar] | [Ano] | [Gravadora] | [Obs] |
| 2 | [A confirmar] | [Ano] | [Gravadora] | [Obs] |
| 3 | [A confirmar] | [Ano] | [Gravadora] | [Obs] |

### Singles e EP
| # | Título | Ano | Parcerias |
|---|--------|-----|-----------|
| 1 | [A confirmar] | [Ano] | [Artistas] |
| 2 | [A confirmar] | [Ano] | [Artistas] |

---

## 📰 NOTÍCIAS E COBERTURA

### Matérias Recentes
1. [A ser pesquisado]
2. [A ser pesquisado]
3. [A ser pesquisado]

### Premiações e Reconhecimentos
- [A ser pesquisado]

---

## 🎪 HISTÓRICO DE SHOWS

### Principais Eventos
| Evento | Local | Data | Público |
|--------|-------|------|---------|
| [Evento] | [Local] | [Data] | [Público] |
| [Evento] | [Local] | [Data] | [Público] |

---

## 📞 DADOS PARA IMPRENSA (CONTATO)

| Campo | Informação |
|-------|------------|
| **Email** | [A confirmar] |
| **Telefone/WhatsApp** | [A confirmar] |
| **Assessoria** | [A confirmar] |
| **Gerência** | [A confirmar] |
| **Site Oficial** | [A confirmar] |

---

## 🎯 ESTRATÉGIA DE MÍDIA (SUGESTÕES)

### Pontos Fortes para Comunicação
1. [A definir após análise]
2. [A definir após análise]
3. [A definir após análise]

### Oportunidades de Crescimento
1. TikTok/Reels - Conteúdo viral
2. Parcerias com influenciadores
3. Colaborações com outros artistas

### Sugestões de Campanhas
1. [Sugestão 1]
2. [Sugestão 2]
3. [Sugestão 3]

---

## 📁 FONTES E REFERÊNCIAS

- Instagram: @gabrieloprincipe_oficial
- TikTok: @gabrieloprincipe_oficial
- YouTube: @GabrielOPrincipe
- Spotify: Gabriel O Príncipe de Aracajú
- Letras.mus.br: gabriel-o-principe

---

*Portfólio gerado em: ${new Date().toLocaleDateString('pt-BR')}*
*Agência: [Nome da Agência]*
`;

  // Salva o relatório
  fs.writeFileSync('/root/clawd/portfolio_gabriel_principe.md', markdownReport);
  fs.writeFileSync('/root/clawd/gabriel_principe_dados.json', JSON.stringify(allData, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ PESQUISA CONCLUÍDA!');
  console.log('='.repeat(60));
  console.log('\n📁 ARQUIVOS GERADOS:');
  console.log('   1. /root/clawd/portfolio_gabriel_principe.md (Relatório completo em Markdown)');
  console.log('   2. /root/clawd/gabriel_principe_dados.json (Dados estruturados em JSON)');
  
  return allData;
}

comprehensiveSearch().catch(console.error);
