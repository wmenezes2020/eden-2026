const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ margin: 50 });
const outputPath = path.join(process.cwd(), 'media', 'Relatorio_Efamaa_Colombia.pdf');

// Garantir diretório
if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// --- Título ---
doc.font('Helvetica-Bold').fontSize(24).text('Relatório Empresarial: Grupo Efamaa', { align: 'center' });
doc.moveDown();
doc.fontSize(12).font('Helvetica').text('Data do Relatório: ' + new Date().toLocaleDateString('pt-BR'), { align: 'center' });
doc.moveDown(2);

// --- Dados de Contato ---
doc.rect(50, doc.y, 500, 100).fill('#f0f0f0').stroke();
doc.fillColor('black');
doc.moveDown(0.5);

doc.font('Helvetica-Bold').fontSize(14).text('Informações de Contato', { indent: 20 });
doc.moveDown(0.5);
doc.font('Helvetica').fontSize(12);
doc.text(`📧 E-mail: sac@grupoefamaa.com`, { indent: 20 });
doc.text(`📍 Endereço: Cra. 7 #156-80, Torre 3 Oficina 1805, Bogotá - Colombia`, { indent: 20 });
doc.text(`📱 WhatsApp: +57 312 248 7805`, { indent: 20 });
doc.text(`🕒 Horário: Seg-Sex 8am-6pm / Sáb 8am-12pm`, { indent: 20 });
doc.moveDown(3);

// --- Serviços ---
doc.font('Helvetica-Bold').fontSize(18).text('Portfólio de Serviços');
doc.lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown();

const services = [
    { title: 'AI (Inteligência Artificial)', desc: 'Soluções inovadoras para aumentar eficiência, personalização e competitividade.' },
    { title: 'Systems (Sistemas)', desc: 'Otimização e automação de processos de negócio com soluções customizadas e manutenção.' },
    { title: 'Security (Segurança)', desc: 'Proteção avançada para integridade de sistemas, dados e conexões.' },
    { title: 'Web & Design', desc: 'Design, desenvolvimento e marketing para impulsionar a presença digital da marca.' },
    { title: 'Info & Telephony', desc: 'Manutenção, segurança e automação da infraestrutura tecnológica e telefonia.' },
    { title: 'Consulting (Consultoria)', desc: 'Modernização tecnológica com visão 360 graus para garantir sucesso a longo prazo.' },
    { title: 'Cloud Consulting', desc: 'Soluções de nuvem para escalabilidade, colaboração e armazenamento seguro de dados.' }
];

services.forEach(service => {
    doc.font('Helvetica-Bold').fontSize(14).text(`🔹 ${service.title}`);
    doc.font('Helvetica').fontSize(12).text(service.desc, { align: 'justify' });
    doc.moveDown(1);
});

// --- Rodapé ---
doc.moveDown(2);
doc.fontSize(10).text('Gerado por EDEN (JARVIS) - Relatório Automatizado', { align: 'center', color: 'grey' });

doc.end();

stream.on('finish', () => {
    console.log(`PDF gerado com sucesso: ${outputPath}`);
});
