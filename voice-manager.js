const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const VOICE_DIR = path.join(process.cwd(), 'voice-engine');
const VENV_PYTHON = path.join(VOICE_DIR, 'venv/bin/python');
const TTS_SCRIPT = path.join(VOICE_DIR, 'local_tts.py');
const OUTPUT_DIR = path.join(process.cwd(), 'media/voice-cache');
const CONFIG_PATH = path.join(process.cwd(), 'voice-config.json');
const DEFAULT_SAMPLE = path.join(VOICE_DIR, 'fallback_sample.wav');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Configuração Default
let config = {
    provider: 'local-xtts',
    language: 'pt',
    speakerWav: null // Caminho para o áudio do usuário
};

if (fs.existsSync(CONFIG_PATH)) {
    try { config = JSON.parse(fs.readFileSync(CONFIG_PATH)); } catch (e) {}
}

function saveConfig() {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

// Baixar sample fallback se não existir
if (!fs.existsSync(DEFAULT_SAMPLE)) {
    // Cria diretório se precisar
    if (!fs.existsSync(VOICE_DIR)) fs.mkdirSync(VOICE_DIR, { recursive: true });
    // Baixa um sample simples (Hello do Wikimedia) e converte se necessário, ou apenas um placeholder
    // Aqui vamos deixar sem, o script tentará lidar
}

async function generateAudio(text) {
    console.log(`[Voice] Gerando áudio local para: "${text.substring(0, 20)}..."`);
    
    const timestamp = Date.now();
    const outputFile = path.join(OUTPUT_DIR, `tts-${timestamp}.wav`);
    
    // Define qual sample usar: o do usuário ou fallback
    let speaker = config.speakerWav;
    if (!speaker || !fs.existsSync(speaker)) {
        speaker = DEFAULT_SAMPLE;
        if (!fs.existsSync(speaker)) {
             // Se nem o fallback existir, precisamos baixar um agora.
             console.log("[Voice] Baixando sample de fallback...");
             try {
                 await execPromise(`curl -L -o ${DEFAULT_SAMPLE} "https://github.com/coqui-ai/TTS/raw/dev/TTS/utils/assets/male_01.wav"`);
                 speaker = DEFAULT_SAMPLE;
             } catch (e) {
                 throw new Error("Não foi possível obter áudio de referência (speaker sample). Envie um áudio seu.");
             }
        }
    }

    const command = `${VENV_PYTHON} ${TTS_SCRIPT} "${text}" "${outputFile}" "${speaker}" "${config.language}"`;
    
    // Environment variables para aceitar licença
    const env = { ...process.env, COQUI_TOS_AGREED: '1' };

    console.log(`[Voice] Executando XTTS (pode demorar na CPU)...`);
    try {
        await execPromise(command, { env });
        if (fs.existsSync(outputFile)) {
            console.log(`[Voice] Sucesso: ${outputFile}`);
            return outputFile;
        } else {
            throw new Error("Arquivo de saída não foi gerado pelo script Python.");
        }
    } catch (err) {
        console.error(`[Voice] Erro no TTS: ${err.message}`);
        throw err;
    }
}

function setSpeaker(wavPath) {
    if (fs.existsSync(wavPath)) {
        config.speakerWav = wavPath;
        saveConfig();
        return true;
    }
    return false;
}

function execPromise(cmd, opts) {
    return new Promise((resolve, reject) => {
        exec(cmd, opts, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                console.error(`stderr: ${stderr}`);
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

module.exports = {
    generateAudio,
    setSpeaker,
    config
};
