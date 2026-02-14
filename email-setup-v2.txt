# Guia Rápido: Instalação e Configuração de E-mail (Postfix + Dovecot) no Ubuntu

Este guia passo a passo instala um servidor de e-mail completo (SMTP, IMAP, POP3) e um cliente local para checagens periódicas. Testado em Ubuntu 22.04/24.04.

Resumo de componentes
- MTA (SMTP): Postfix
- IMAP/POP3: Dovecot
- Envio via relay: msmtp (opcional)
- Sincronização/cheque: mbsync (IMAP) ou fetchmail (POP3)
- AS/Segurança: TLS (Let's Encrypt), DKIM (opendkim)

Pré-requisitos
- Acesso root
- Hostname configurado (ex.: mail.exemplo.com)
- DNS: A record apontando para o servidor
- Recomendo ter IP público ou port forwarding para testes de recebimento

Instalação básica

sudo apt update
sudo apt install -y postfix dovecot-core dovecot-imapd dovecot-pop3d msmtp mbsync fetchmail opendkim certbot

Configuração do Postfix (envio/recebimento)
1. Reconfigure:
   sudo dpkg-reconfigure postfix
   - "Internet Site" (se receber mensajes diretamente) ou "Satellite system" (via relay).
2. /etc/postfix/main.cf ajustes essenciais:
   myhostname = mail.exemplo.com
   mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
   inet_interfaces = all
   home_mailbox = Maildir/

3. (Relay opcional)
   relayhost = [smtp.provider.com]:587
   smtp_sasl_auth_enable = yes
   smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd

4. Proteja /etc/postfix/sasl_passwd e rode: sudo postmap /etc/postfix/sasl_passwd

Reinicie:
sudo systemctl restart postfix
sudo systemctl enable postfix

Configuração do Dovecot (IMAP/POP3)
1. /etc/dovecot/conf.d/10-mail.conf
   mail_location = maildir:~/Maildir

2. /etc/dovecot/conf.d/10-auth.conf
   disable_plaintext_auth = yes
   auth_mechanisms = plain login

3. /etc/dovecot/conf.d/10-master.conf — habilite listener para Postfix SASL:
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0660
    user = postfix
    group = postfix
  }
}

TLS (Let's Encrypt)
- Emita certificado:
  sudo certbot certonly --standalone -d mail.exemplo.com
- Aponte Postfix e Dovecot para os paths:
  /etc/letsencrypt/live/mail.exemplo.com/fullchain.pem
  /etc/letsencrypt/live/mail.exemplo.com/privkey.pem

Usuários e Maildirs
sudo adduser joao
su - joao
maildirmake Maildir

Cliente local / sincronização
- IMAP (mbsync/isync): configurar ~/.mbsyncrc e rodar `mbsync -a` via cron/systemd timer
- POP3 (fetchmail): editar ~/.fetchmailrc e rodar em daemon

Processamento automático
- Use dovecot-sieve para regras server-side ou um watcher Python que monitora Maildir/new e executa ações (respostas, transcrição, encaminhamento).

SPF, DKIM, DMARC (básico)
- SPF TXT: v=spf1 mx include:spf.provedor.com ~all
- DKIM: configure opendkim e publique a chave no DNS
- DMARC: v=DMARC1; p=quarantine; rua=mailto:postmaster@exemplo.com

Testes básicos
- Envio: echo "teste" | mail -s "assunto" usuario@exemplo.com
- SMTP relay: swaks --to dest@exemplo.com --server smtp.provider.com:587 --auth LOGIN --auth-user user --auth-password pass
- IMAP: usar Thunderbird/mutt/mbsync

Manutenção
- Logs: /var/log/mail.log, /var/log/dovecot.log
- Backups: /etc/postfix, /etc/dovecot, /var/mail
- Rotação: configure logrotate para diretórios de mídia e gravações

Opções avançadas (se desejar que eu implemente):
- Automação completa via Ansible/Playbook
- Configuração DKIM com opendkim e publicação automática da chave
- Integração com um serviço de transcrição/AI para processar anexos ou voicemails

---
Se quiser, eu também posso: gerar um playbook Ansible com estes passos ou executar a instalação completa aqui (precisarei de permissões/credenciais de DNS e provedor).