const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(process.cwd(), 'logs', 'health-monitor.log');
if (!fs.existsSync(path.dirname(LOG_FILE))) fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });

function log(msg) {
    const entry = `[${new Date().toISOString()}] ${msg}\n`;
    fs.appendFileSync(LOG_FILE, entry);
    console.log(entry.trim());
}

async function runDoctorFix() {
    return new Promise((resolve) => {
        log("🏥 Executing Self-Repair (clawdbot doctor --fix)...");
        exec('clawdbot doctor --fix --non-interactive', (error, stdout, stderr) => {
            if (error) {
                log(`⚠️ Doctor Fix Warning: ${error.message}`);
            }
            if (stderr) log(`Doctor Stderr: ${stderr}`);
            log(`✅ Doctor Output: ${stdout}`);
            resolve();
        });
    });
}

async function checkHealth() {
    // Verificação simples: se o processo do gateway está respondendo ou se há muitos erros nos logs recentes
    // Por enquanto, vamos rodar o doctor preventivamente a cada intervalo
    await runDoctorFix();
}

// Loop de monitoramento (executa a cada 6 horas ou quando invocado)
if (require.main === module) {
    log("🛡️ EDEN Self-Healing Subsystem Initialized.");
    checkHealth();
    setInterval(checkHealth, 6 * 60 * 60 * 1000); // 6 horas
}

module.exports = { checkHealth };
