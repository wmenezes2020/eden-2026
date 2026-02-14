const axios = require('axios');
const xml2js = require('xml2js');

const CREDENTIALS = {
    user: 'wesley.evangelista@vansa.co',
    pass: 'zcgo hwjb tlrm qcpy'
};

const CARDDAV_URL = `https://www.googleapis.com/carddav/v1/principals/${CREDENTIALS.user}/lists/default/ld/`;

async function searchContact(queryName) {
    console.log(`Buscando contato: ${queryName}...`);
    
    // CardDAV REPORT para buscar vcards
    // Nota: A API Google CardDAV é meio restrita, vamos tentar listar todos e filtrar localmente
    // ou usar um REPORT addressbook-query se suportado.
    
    // Tentativa simplificada: Listar contatos (PROPFIND ou REPORT)
    // Google requer OAuth2 para API de People completa, mas CardDAV funciona com App Password.
    
    const xml = `
    <c:addressbook-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:carddav">
        <d:prop>
            <d:getetag />
            <c:address-data />
        </d:prop>
        <c:filter>
            <c:prop-filter name="FN">
                <c:text-match collation="i;unicode-casemap" match-type="contains">${queryName}</c:text-match>
            </c:prop-filter>
        </c:filter>
    </c:addressbook-query>`;

    try {
        const res = await axios({
            method: 'REPORT',
            url: CARDDAV_URL,
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
        
        // Parsing simples do VCard na resposta
        const vcards = res.data; // Resposta vem misturada XML/VCard
        
        // Regex rápido para extrair emails de blocos vCard que tenham o nome
        // Isso é um hack rápido pois parser de XML CardDAV é verboso
        
        const contacts = [];
        const lines = vcards.split('\n');
        let currentContact = {};
        
        for (let line of lines) {
             if (line.includes('FN:')) currentContact.name = line.split('FN:')[1].trim();
             if (line.includes('EMAIL')) {
                 const email = line.split(':')[1].trim();
                 if (!currentContact.emails) currentContact.emails = [];
                 currentContact.emails.push(email);
             }
             if (line.includes('END:VCARD')) {
                 if (currentContact.name && currentContact.name.toLowerCase().includes(queryName.toLowerCase())) {
                     contacts.push(currentContact);
                 }
                 currentContact = {};
             }
        }
        
        return contacts;

    } catch (error) {
        console.error("Erro CardDAV:", error.response ? error.response.status : error.message);
        // Fallback: Google Contacts via IMAP? Não, CardDAV é o caminho.
        // Se falhar, é provável que a URL base precise de ajuste ou Google bloqueie REPORT específico.
        return [];
    }
}

// Execução
const name = "Esael";
searchContact(name).then(contacts => {
    console.log(JSON.stringify(contacts, null, 2));
});
