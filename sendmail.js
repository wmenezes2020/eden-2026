const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'mail.smtp2go.com',
    port: 2525,
    secure: false,
    auth: {
        user: 'acertoai',
        pass: 'VgUHhVDKx5AGHd1S',
    },
});

const mailOptions = {
    from: 'AcertoAI Monitoramento <noreply@acertoai.com.br>',
    to: 'wesleyempresa@gmail.com, wesleymenezes.ofc@gmail.com',
    subject: 'Bem-vindo ao AcertoAI Monitoramento! 🚀',
    html: `
    <html>
    <head>
      <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' rel='stylesheet'>
    </head>
    <body>
      <div class='container' style='max-width:600px;margin:40px auto;padding:40px 30px;background:#f8f9fa;border-radius:16px;'>
        <h2 style='color:#0d6efd;'>Bem-vindo ao AcertoAI 🚀</h2>
        <p>Olá, seja bem-vindo ao <strong>AcertoAI Monitoramento</strong>!</p>
        <hr>
        <p>
          A partir de agora, você passará a receber notificações inteligentes em tempo real diretamente deste endereço.<br>
          Dúvidas ou sugestões? Responda este e-mail a qualquer momento.
        </p>
        <div class='text-center mt-4'>
          <a href='https://acertoai.com.br/' target='_blank' class='btn btn-primary'>Visitar plataforma AcertoAI</a>
        </div>
        <footer style='margin-top:40px;font-size:13px;color:#6c757d;'>Esta é uma mensagem automática. Não responda este e-mail.<br>&copy; 2026 AcertoAI</footer>
      </div>
    </body>
    </html>
    `,
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Erro ao enviar o e-mail:', error);
        process.exit(1);
    }
    console.log('E-mail enviado:', info.response);
    process.exit(0);
});
