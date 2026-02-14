/**
 * BATEU, CURTIU - Mobile App
 * Main JavaScript Application
 */

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
    API_URL: 'http://localhost:3001/api',
    STORAGE_KEYS: {
        USER: 'bateu_curtiu_user',
        TOKEN: 'bateu_curtiu_token',
        POINTS: 'bateu_curtiu_points'
    }
};

// ==========================================
// STATE MANAGEMENT
// ==========================================

const state = {
    user: null,
    token: null,
    currentPage: 'home',
    currentArtist: null,
    player: {
        playing: false,
        currentTrack: null,
        audio: null
    },
    data: {
        artists: [],
        playlists: [],
        rewards: [],
        featured: []
    }
};

// ==========================================
// API FUNCTIONS
// ==========================================

const API = {
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (state.token) {
            headers['Authorization'] = `Bearer ${state.token}`;
        }
        
        try {
            const response = await fetch(url, { ...options, headers });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro na requisição');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: error.message };
        }
    },
    
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },
    
    async register(name, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
    },
    
    async getArtists() {
        return this.request('/artists');
    },
    
    async getArtist(id) {
        return this.request(`/artists/${id}`);
    },
    
    async getPlaylists() {
        return this.request('/playlists');
    },
    
    async getRewards() {
        return this.request('/community/rewards');
    },
    
    async followArtist(id) {
        return this.request(`/community/follow/${id}`, { method: 'POST' });
    },
    
    async claimReward(id) {
        return this.request(`/community/rewards/${id}/claim`, { method: 'POST' });
    },
    
    async addPoints(type, artistId) {
        return this.request('/community/points', {
            method: 'POST',
            body: JSON.stringify({ type, artistId })
        });
    }
};

// ==========================================
// STORAGE FUNCTIONS
// ==========================================

const Storage = {
    get(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error('Storage error:', e);
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Storage error:', e);
        }
    },
    
    clear() {
        Object.values(CONFIG.STORAGE_KEYS).forEach(key => this.remove(key));
    }
};

// ==========================================
// UI FUNCTIONS
// ==========================================

const UI = {
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    },
    
    showLoading() {
        document.getElementById('splash-screen').classList.add('active');
    },
    
    hideLoading() {
        document.getElementById('splash-screen').classList.remove('active');
    },
    
    updatePointsDisplay() {
        const points = state.user?.points || 0;
        document.getElementById('user-points').textContent = points.toLocaleString();
    },
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--surface)'};
            color: white;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            animation: fadeInUp 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};

// ==========================================
// NAVIGATION
// ==========================================

function navigateTo(page) {
    state.currentPage = page;
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    
    // Load page content
    loadPageContent(page);
}

function loadPageContent(page) {
    const content = document.getElementById('app-content');
    
    switch (page) {
        case 'home':
            renderHomePage(content);
            break;
        case 'artists':
            renderArtistsPage(content);
            break;
        case 'playlists':
            renderPlaylistsPage(content);
            break;
        case 'rewards':
            renderRewardsPage(content);
            break;
        case 'profile':
            renderProfilePage(content);
            break;
    }
}

// ==========================================
// PAGE RENDERERS
// ==========================================

function renderHomePage(container) {
    container.innerHTML = `
        <h2 class="section-title">Destaques</h2>
        <div class="card-grid" id="featured-grid">
            ${state.data.featured.map(artist => renderArtistCard(artist)).join('')}
        </div>
        
        <h2 class="section-title" style="margin-top: 30px;">Artistas Populares</h2>
        <div class="card-grid" id="popular-grid">
            ${state.data.artists.slice(0, 6).map(artist => renderArtistCard(artist)).join('')}
        </div>
        
        <h2 class="section-title" style="margin-top: 30px;">Playlists</h2>
        <div class="card-grid">
            ${state.data.playlists.map(playlist => renderPlaylistCard(playlist)).join('')}
        </div>
    `;
    
    // Add click handlers
    container.querySelectorAll('.card[data-type="artist"]').forEach(card => {
        card.addEventListener('click', () => openArtistModal(card.dataset.id));
    });
}

function renderArtistsPage(container) {
    container.innerHTML = `
        <h2 class="section-title">Todos os Artistas</h2>
        <div class="card-grid" id="all-artists-grid">
            ${state.data.artists.map(artist => renderArtistCard(artist)).join('')}
        </div>
    `;
    
    container.querySelectorAll('.card[data-type="artist"]').forEach(card => {
        card.addEventListener('click', () => openArtistModal(card.dataset.id));
    });
}

function renderPlaylistsPage(container) {
    container.innerHTML = `
        <h2 class="section-title">Playlists</h2>
        <div class="card-grid">
            ${state.data.playlists.map(playlist => renderPlaylistCard(playlist)).join('')}
        </div>
    `;
}

function renderRewardsPage(container) {
    container.innerHTML = `
        <h2 class="section-title">Suas Recompensas</h2>
        <p style="color: var(--gray); margin-bottom: 20px;">Use seus pontos para trocar por prêmios exclusivos!</p>
        <div id="rewards-list">
            ${state.data.rewards.map(reward => renderRewardCard(reward)).join('')}
        </div>
    `;
    
    container.querySelectorAll('.reward-claim').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const result = await API.claimReward(id);
            if (result.success) {
                UI.showToast('Recompensa resgatada com sucesso!', 'success');
                state.user.points -= parseInt(btn.dataset.cost);
                UI.updatePointsDisplay();
            } else {
                UI.showToast(result.message || 'Erro ao resgatar', 'error');
            }
        });
    });
}

function renderProfilePage(container) {
    const user = state.user;
    container.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">
                <i class="fas fa-user"></i>
            </div>
            <h2 class="profile-name">${user?.name || 'Usuário'}</h2>
            <p class="profile-email">${user?.email || ''}</p>
            <div class="profile-stats">
                <div>
                    <span class="profile-stat-value">${user?.points || 0}</span>
                    <span class="profile-stat-label">Pontos</span>
                </div>
                <div>
                    <span class="profile-stat-value">${user?.follows || 0}</span>
                    <span class="profile-stat-label">Seguindo</span>
                </div>
                <div>
                    <span class="profile-stat-value">${user?.rewardsClaimed || 0}</span>
                    <span class="profile-stat-label">Prêmios</span>
                </div>
            </div>
        </div>
        
        <button class="btn-primary" onclick="logout()" style="margin-top: 20px;">Sair da Conta</button>
    `;
}

// ==========================================
// CARD RENDERERS
// ==========================================

function renderArtistCard(artist) {
    return `
        <div class="card" data-type="artist" data-id="${artist.id}">
            <div class="card-image">
                <img src="${artist.photo || 'assets/default-cover.svg'}" alt="${artist.name}">
                <div class="card-play">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="card-body">
                <h4 class="card-title">${artist.name}</h4>
                <p class="card-subtitle">${artist.genre || 'Artista'}</p>
            </div>
        </div>
    `;
}

function renderPlaylistCard(playlist) {
    return `
        <div class="card" data-type="playlist" data-id="${playlist.id}">
            <div class="card-image">
                <img src="${playlist.cover || 'assets/default-cover.svg'}" alt="${playlist.name}">
                <div class="card-play">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="card-body">
                <h4 class="card-title">${playlist.name}</h4>
                <p class="card-subtitle">${playlist.description || 'Playlist'}</p>
            </div>
        </div>
    `;
}

function renderRewardCard(reward) {
    return `
        <div class="reward-card">
            <div class="reward-icon">
                <i class="fas fa-gift"></i>
            </div>
            <div class="reward-info">
                <h4 class="reward-title">${reward.name}</h4>
                <div class="reward-cost">
                    <i class="fas fa-star"></i>
                    ${reward.cost} pontos
                </div>
            </div>
            <button class="reward-claim" data-id="${reward.id}" data-cost="${reward.cost}">Resgatar</button>
        </div>
    `;
}

// ==========================================
// ARTIST MODAL
// ==========================================

async function openArtistModal(artistId) {
    const modal = document.getElementById('artist-modal');
    modal.classList.add('active');
    
    const artist = state.data.artists.find(a => a.id === artistId);
    if (!artist) return;
    
    state.currentArtist = artist;
    
    // Update modal content
    modal.querySelector('.modal-cover').src = artist.photo || 'assets/default-cover.svg';
    modal.querySelector('.modal-title').textContent = artist.name;
    modal.querySelector('.modal-genre').textContent = artist.genre || 'Artista';
    modal.querySelector('#artist-followers').textContent = (artist.followers || 0).toLocaleString();
    modal.querySelector('#artist-points').textContent = (artist.points || 0).toLocaleString();
    modal.querySelector('#artist-content').textContent = (artist.contentCount || 0);
    
    // Check if following
    const isFollowing = artist.following || false;
    const btnFollow = modal.querySelector('#btn-follow');
    btnFollow.textContent = isFollowing ? 'Seguindo' : 'Seguir';
    btnFollow.style.background = isFollowing ? 'var(--surface)' : 'linear-gradient(135deg, var(--primary), var(--primary-light))';
    
    // Load contents
    const musicsHtml = (artist.musics || []).map(music => `
        <div class="content-item">
            <img src="${music.cover || 'assets/default-cover.svg'}" class="content-item-cover">
            <div class="content-item-info">
                <div class="content-item-title">${music.title}</div>
                <div class="content-item-meta">${music.album || 'Single'}</div>
            </div>
            <button class="content-item-action" onclick="playMusic('${music.id}', '${music.title}', '${music.url}')">
                <i class="fas fa-play"></i>
            </button>
        </div>
    `).join('');
    
    document.getElementById('artist-musics').innerHTML = musicsHtml || '<p style="color: var(--gray); text-align: center;">Nenhuma música disponível</p>';
    
    const videosHtml = (artist.videos || []).map(video => `
        <div class="content-item">
            <img src="${video.thumbnail || 'assets/default-cover.svg'}" class="content-item-cover">
            <div class="content-item-info">
                <div class="content-item-title">${video.title}</div>
                <div class="content-item-meta">${video.views || '0'} visualizações</div>
            </div>
            <button class="content-item-action" onclick="openVideo('${video.youtubeId}')">
                <i class="fas fa-play"></i>
            </button>
        </div>
    `).join('');
    
    document.getElementById('artist-videos').innerHTML = videosHtml || '<p style="color: var(--gray); text-align: center;">Nenhum vídeo disponível</p>';
    
    // Follow button handler
    btnFollow.onclick = async () => {
        const result = await API.followArtist(artistId);
        if (result.success) {
            artist.following = !artist.following;
            btnFollow.textContent = artist.following ? 'Seguindo' : 'Seguir';
            btnFollow.style.background = artist.following ? 'var(--surface)' : 'linear-gradient(135deg, var(--primary), var(--primary-light))';
            UI.showToast(artist.following ? 'Você agora segue ' + artist.name : 'Você parou de seguir ' + artist.name, 'success');
        }
    };
}

function closeArtistModal() {
    document.getElementById('artist-modal').classList.remove('active');
}

// ==========================================
// MUSIC PLAYER
// ==========================================

function playMusic(id, title, url) {
    const miniPlayer = document.getElementById('mini-player');
    miniPlayer.classList.add('active');
    
    state.player.currentTrack = { id, title, url };
    
    document.getElementById('mini-player').querySelector('.mini-player-title').textContent = title;
    
    // In a real app, you would play the actual audio here
    // For demo, we'll just show the player
    
    // Add points for listening
    if (state.currentArtist) {
        API.addPoints('listen', state.currentArtist.id);
    }
}

function togglePlay() {
    state.player.playing = !state.player.playing;
    const btn = document.getElementById('mini-play');
    btn.innerHTML = state.player.playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

function openVideo(youtubeId) {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
    
    // Add points for watching
    if (state.currentArtist) {
        API.addPoints('watch', state.currentArtist.id);
    }
}

// ==========================================
// AUTH FUNCTIONS
// ==========================================

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const result = await API.login(email, password);
    
    if (result.success) {
        state.user = result.data.user;
        state.token = result.data.token;
        
        Storage.set(CONFIG.STORAGE_KEYS.USER, JSON.stringify(state.user));
        Storage.set(CONFIG.STORAGE_KEYS.TOKEN, state.token);
        
        UI.showScreen('main-screen');
        UI.updatePointsDisplay();
        loadInitialData();
        navigateTo('home');
        UI.showToast('Bem-vindo de volta!', 'success');
    } else {
        UI.showToast(result.message || 'Erro ao fazer login', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    const result = await API.register(name, email, password);
    
    if (result.success) {
        state.user = result.data.user;
        state.token = result.data.token;
        
        Storage.set(CONFIG.STORAGE_KEYS.USER, JSON.stringify(state.user));
        Storage.set(CONFIG.STORAGE_KEYS.TOKEN, state.token);
        
        UI.showScreen('main-screen');
        UI.updatePointsDisplay();
        loadInitialData();
        navigateTo('home');
        UI.showToast('Conta criada com sucesso!', 'success');
    } else {
        UI.showToast(result.message || 'Erro ao criar conta', 'error');
    }
}

function logout() {
    Storage.clear();
    state.user = null;
    state.token = null;
    UI.showScreen('login-screen');
    UI.showToast('Você saiu da sua conta', 'info');
}

// ==========================================
// INITIALIZATION
// ==========================================

async function loadInitialData() {
    // Load data from API or use mock data for demo
    state.data = {
        artists: [
            { id: '1', name: 'Gabriel O Príncipe', genre: 'Arrocha', photo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400', followers: 85000, points: 125000, following: false, musics: [{ id: 'm1', title: 'Ta Certinha Bebê', album: 'Clipe Oficial' }, { id: 'm2', title: 'Faz o Pix que Ela Ama', album: 'Clipe Oficial' }], videos: [{ id: 'v1', title: 'Ta Certinha Bebê (Clipe)', youtubeId: 'Mqh4qF1MZJE' }] },
            { id: '2', name: 'João Gomes', genre: 'Forró', photo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', followers: 250000, points: 340000, following: false, musics: [{ id: 'm3', title: 'Dengo', album: 'Single' }], videos: [] },
            { id: '3', name: 'Marília Mendonça', genre: 'Sertanejo', photo: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400', followers: 500000, points: 890000, following: false, musics: [], videos: [] },
            { id: '4', name: 'Zé Neto & Cristiano', genre: 'Sertanejo', photo: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400', followers: 420000, points: 650000, following: false, musics: [], videos: [] },
            { id: '5', name: 'Luan Santana', genre: 'Sertanejo', photo: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',380000, points: 520000, following: false, musics: [], videos: [] },
            { id: '6', name: 'Jorge & Mateus', genre: 'Sertanejo', photo: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=400', followers: 680000, points: 920000, following: false, musics: [], videos: [] }
        ],
        playlists: [
            { id: 'p1', name: 'Top Arrocha', description: 'As melhores do arrocha', cover: 'https://images.unsplash.com/photo-1498598457410-9c0528b70e1c?w=400' },
            { id: 'p2', name: 'Forró Nordestino', description: 'O melhor do Nordeste', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
            { id: 'p3', name: 'Sertanejo 2026', description: 'As novidades do ano', cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400' },
            { id: 'p4', name: 'FAMA.LAB Hits', description: 'Artistas promovidos', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400' }
        ],
        rewards: [
            { id: 'r1', name: 'Meet & Greet Virtual', cost: 5000 },
            { id: 'r2', name: 'Baixar Música Exclusiva', cost: 1000 },
            { id: 'r3', name: 'Desconto em Show (20%)', cost: 2000 },
            { id: 'r4', name: 'Camiseta Oficial', cost: 3000 },
            { id: 'r5', name: 'Citação em Música', cost: 10000 },
            { id: 'r6', name: 'Acesso VIP Show', cost: 5000 }
        ],
        featured: [
            { id: '1', name: 'Gabriel O Príncipe', genre: 'Arrocha', photo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400' },
            { id: '2', name: 'João Gomes', genre: 'Forró', photo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' }
        ]
    };
}

function init() {
    // Check for existing session
    const storedUser = Storage.get(CONFIG.STORAGE_KEYS.USER);
    const storedToken = Storage.get(CONFIG.STORAGE_KEYS.TOKEN);
    
    if (storedUser && storedToken) {
        state.user = JSON.parse(storedUser);
        state.token = storedToken;
        UI.showScreen('main-screen');
        UI.updatePointsDisplay();
        loadInitialData().then(() => navigateTo('home'));
    } else {
        UI.showScreen('login-screen');
    }
    
    // Setup event listeners
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('show-register').addEventListener('click', (e) => { e.preventDefault(); UI.showScreen('register-screen'); });
    document.getElementById('show-login').addEventListener('click', (e) => { e.preventDefault(); UI.showScreen('login-screen'); });
    document.getElementById('close-artist-modal').addEventListener('click', closeArtistModal);
    document.getElementById('mini-play').addEventListener('click', togglePlay);
    
    // Navigation clicks
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(item.dataset.page);
        });
    });
    
    // Hide splash after load
    setTimeout(UI.hideLoading, 2000);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
