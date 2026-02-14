const { getRecentEmails, fetchCalendarEvents } = require('./google-connect');
const { exec } = require('child_process');

const CHECK_INTERVAL_MS = 60 * 1000; // 1 minuto
const TARGET_PHONE = '+557196901173';

// Estado em memória (reinicia se o script reiniciar)
// Em produção ideal, persistir em arquivo JSON
let notifiedEmails = new Set();
let notifiedEvents = new Set();

function log(msg) {
    console.log(`[Monitor] ${new Date().toLocaleTimeString()}: ${msg}`);
}

async function sendWhatsApp(text) {
    const cmd = `clawdbot message send --channel whatsapp --to "${TARGET_PHONE}" --message "${text.replace(/"/g, '\\"')}"`;
    exec(cmd, (err) => {
        if (err) log(`Erro ao enviar WhatsApp: ${err.message}`);
        else log(`WhatsApp enviado: "${text}"`);
    });
}

async function checkEmails() {
    try {
        // Busca últimos 5 não lidos
        const emails = await getRecentEmails(5);
        for (const email of emails) {
            // Identificador único (simplificado, ideal seria UID ou Message-ID)
            // Aqui usamos combinação de De + Assunto + Data para evitar duplicação em memória
            const id = `${email.from}|${email.subject}|${email.date}`;
            
            if (!notifiedEmails.has(id)) {
                log(`Novo e-mail detectado: ${email.subject}`);
                await sendWhatsApp(`📧 *Novo E-mail*\n\n*De:* ${email.from}\n*Assunto:* ${email.subject}\n\n_Verifique sua caixa de entrada._`);
                notifiedEmails.add(id);
            }
        }
    } catch (e) {
        log(`Erro ao checar e-mails: ${e.message}`);
    }
}

async function checkCalendar() {
    try {
        const now = new Date();
        const end = new Date(now.getTime() + 60 * 60 * 1000); // Próxima 1 hora
        
        const events = await fetchCalendarEvents(now, end);
        
        for (const evt of events) {
            if (!evt.start) continue;
            
            const timeDiff = evt.start.getTime() - now.getTime();
            const minutesDiff = Math.floor(timeDiff / 1000 / 60);
            
            // Notificar se faltar entre 25 e 30 minutos (janela de segurança)
            // e ainda não tiver sido notificado
            if (minutesDiff >= 25 && minutesDiff <= 30) {
                const uid = evt.uid;
                if (!notifiedEvents.has(uid)) {
                    log(`Evento próximo: ${evt.summary}`);
                    const timeStr = evt.start.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
                    await sendWhatsApp(`📅 *Lembrete de Agenda*\n\n*Evento:* ${evt.summary}\n*Horário:* ${timeStr}\n*Em:* ${minutesDiff} minutos.`);
                    notifiedEvents.add(uid);
                }
            }
        }
    } catch (e) {
        log(`Erro ao checar calendário: ${e.message}`);
    }
}

// Loop Principal
async function run() {
    log("Iniciando monitoramento (E-mail + Agenda)...");
    setInterval(async () => {
        await checkEmails();
        await checkCalendar();
    }, CHECK_INTERVAL_MS);
    
    // Primeira execução imediata
    await checkEmails();
    await checkCalendar();
}

run();
