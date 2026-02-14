const nodemailer = require('nodemailer');
const imapSimple = require('imap-simple');
const { simpleParser } = require('mailparser');
const axios = require('axios');
const uuid = require('uuid');
const nodeIcal = require('node-ical');
const _ = require('lodash'); // Adicionando lodash que faltava no getRecentEmails

const CREDENTIALS = {
    user: 'wesley.evangelista@vansa.co',
    pass: 'zcgo hwjb tlrm qcpy'
};

// ==========================================
// EMAIL SERVICE (SMTP & IMAP)
// ==========================================

const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: CREDENTIALS
});

async function sendEmail(to, subject, html) {
    const mailOptions = {
        from: `"EDEN (JARVIS)" <${CREDENTIALS.user}>`,
        to,
        subject,
        html
    };
    return await smtpTransport.sendMail(mailOptions);
}

async function getRecentEmails(limit = 5) {
    const config = {
        imap: {
            user: CREDENTIALS.user,
            password: CREDENTIALS.pass,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            authTimeout: 3000
        }
    };

    try {
        const connection = await imapSimple.connect(config);
        await connection.openBox('INBOX');

        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        const recent = messages.slice(-limit);
        
        const parsedEmails = [];
        for (const item of recent) {
            // Parsing simplificado
            parsedEmails.push({
                subject: item.parts[0].body.subject ? item.parts[0].body.subject[0] : 'No Subject',
                from: item.parts[0].body.from ? item.parts[0].body.from[0] : 'Unknown',
                date: item.parts[0].body.date ? item.parts[0].body.date[0] : 'Unknown'
            });
        }
        
        connection.end();
        return parsedEmails;
    } catch (err) {
        console.error("Erro IMAP:", err);
        return [];
    }
}

// ==========================================
// CALENDAR SERVICE (CalDAV)
// ==========================================
const CALDAV_URL = `https://www.google.com/calendar/dav/${CREDENTIALS.user}/events`;

async function fetchCalendarEvents(start, end) {
    const startStr = start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endStr = end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const xml = `
    <c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
        <d:prop>
            <d:getetag />
            <c:calendar-data />
        </d:prop>
        <c:filter>
            <c:comp-filter name="VCALENDAR">
                <c:comp-filter name="VEVENT">
                    <c:time-range start="${startStr}" end="${endStr}" />
                </c:comp-filter>
            </c:comp-filter>
        </c:filter>
    </c:calendar-query>`;

    try {
        const res = await axios({
            method: 'REPORT',
            url: CALDAV_URL,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Depth': '1'
            },
            auth: {
                username: CREDENTIALS.user,
                password: CREDENTIALS.pass
            },
            data: xml
        });

        const icalMatches = res.data.match(/<c:calendar-data>([\s\S]*?)<\/c:calendar-data>/gi);
        let allEvents = [];

        if (icalMatches) {
            for (const match of icalMatches) {
                const icalContent = match.replace(/<\/?c:calendar-data>/gi, '');
                const data = await nodeIcal.async.parseICS(icalContent);
                for (const k in data) {
                    if (data[k].type === 'VEVENT') {
                        allEvents.push(data[k]);
                    }
                }
            }
        }
        return allEvents;

    } catch (error) {
        // Erro silencioso se não houver eventos ou falha de rede
        return [];
    }
}

async function createEvent(summary, startDate, endDate, description = '') {
    const uid = uuid.v4();
    const startStr = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EDEN//JARVIS v1.0//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${startStr}
DTSTART:${startStr}
DTEND:${endStr}
SUMMARY:${summary}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

    try {
        await axios({
            method: 'PUT',
            url: `${CALDAV_URL}/${uid}.ics`,
            headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
            auth: { username: CREDENTIALS.user, password: CREDENTIALS.pass },
            data: ics
        });
        return { success: true, uid };
    } catch (error) {
         console.error("Erro CalDAV Create:", error.message);
         throw error;
    }
}

// Wrapper para teste
async function listEvents() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const events = await fetchCalendarEvents(now, tomorrow);
    return `Eventos encontrados: ${events.length}`;
}

async function testConnection() {
    try {
        await smtpTransport.verify();
        await listEvents();
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = { 
    sendEmail, 
    getRecentEmails, 
    listEvents, 
    fetchCalendarEvents, 
    createEvent, 
    testConnection 
};

// Execução direta para CLI/Teste
if (require.main === module) {
    // Exemplo de uso CLI: node google-connect.js list-today
    const args = process.argv.slice(2);
    if (args[0] === 'list-today') {
        const now = new Date();
        const start = new Date(now.setHours(0,0,0,0));
        const end = new Date(now.setHours(23,59,59,999));
        
        fetchCalendarEvents(start, end).then(events => {
            if (events.length === 0) console.log("Nenhum evento hoje.");
            else {
                console.log(`📅 Agenda de Hoje (${events.length}):`);
                events.forEach(e => console.log(`- ${new Date(e.start).toLocaleTimeString()}: ${e.summary}`));
            }
        });
    } else {
        testConnection().then(ok => console.log(ok ? "CONEXÃO OK" : "FALHA CONEXÃO"));
    }
}
