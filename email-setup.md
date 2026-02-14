# Guia: Instalação e Configuração de Serviço de E-mail (SMTP/IMAP/POP3) no Ubuntu

Este documento descreve passo a passo como instalar e configurar um servidor de e-mail local no Ubuntu para enviar e receber mensagens (SMTP) e disponibilizá-las via IMAP/POP3, além de um cliente local que faz checagens periódicas e tratamento básico.

Escopo:
- Servidor MTA: Postfix (SMTP)
- Servidor IMAP/POP3: Dovecot
- Cliente local/worker: fetchmail (para POP3) ou mbsync/OfflineIMAP (para IMAP) e msmtp para envio via SMTP relay
- Opções de entrega/relay com provedor externo (ex.: Gmail, Outlook, provedor corporativo)
- Segurança: TLS, SPF/DKIM (visão geral), autenticação de usuário local

Observação: este guia presume acesso root e Ubuntu (20.04/22.04/24.04). Ajuste comandos conforme a versão.

---

## 1) Pré-requisitos

- Acesso root/sudo ao servidor
- Nome de host configurado corretamente (ex.: mail.exemplo.com) e DNS apontando para o IP do servidor (A record)
- Portas de entrada/saída: 25 (SMTP), 587 (submission), 465 (smtps, opcional), 143 (IMAP), 993 (IMAPS), 110 (POP3), 995 (POP3S)
  - Se o servidor for cliente outbound apenas (relay), portas de entrada podem não ser necessárias.
- Certificado TLS (Let's Encrypt recomendado) ou certificado provido pelo administrador

Instale utilitários básicos:

sudo apt update
sudo apt install -y postfix dovecot-core dovecot-imapd dovecot-pop3d opendkim opendkim-tools postfix-pcre msmtp-mta mbsync offlineimap fetchmail certbot

> Nota: `msmtp-mta` fornece um sendmail compatível para envio por relay; escolha a ferramenta que preferir.

---

## 2) Configurar Postfix (MTA) — envio/recebimento SMTP

1. Iniciar instalação básica:

sudo dpkg-reconfigure postfix

- Tipo de configuração: "Internet Site" (se você for receber e-mails diretamente) ou "Satellite system" (se usar relay/SMTP de provedor).
- System mail name: mail.exemplo.com (seu hostname)
- Relay host: deixe vazio para receber localmente, ou coloque [smtp.provider.com]:587 como relay.

2. Configuração mínima em /etc/postfix/main.cf:

myhostname = mail.exemplo.com
mydomain = exemplo.com
myorigin = /etc/mailname
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8
home_mailbox = Maildir/
smtpd_tls_cert_file = /etc/letsencrypt/live/mail.exemplo.com/fullchain.pem
smtpd_tls_key_file = /etc/letsencrypt/live/mail.exemplo.com/privkey.pem
smtpd_use_tls = yes
smtp_tls_security_level = may
smtpd_tls_security_level = may
smtpd_tls_auth_only = yes
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes

Se for usar relay (ex.: Gmail), adicione:
relayhost = [smtp.gmail.com]:587
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_security_level = encrypt
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt

Crie /etc/postfix/sasl_passwd com as credenciais do relay (somente se utilizar relay):

[smtp.gmail.com]:587    usuario@gmail.com:app-password
sudo postmap /etc/postfix/sasl_passwd
sudo chown root:root /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db
sudo chmod 0600 /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db

Recarregue postfix:

sudo systemctl restart postfix
sudo systemctl enable postfix

---

## 3) Configurar Dovecot (IMAP/POP3)

Arquivo principal: /etc/dovecot/dovecot.conf (inclui conf.d/*). Configuração mínima:

# /etc/dovecot/conf.d/10-mail.conf
mail_location = maildir:~/Maildir

# /etc/dovecot/conf.d/10-auth.conf
disable_plaintext_auth = yes
auth_mechanisms = plain login
!include auth-system.conf.ext

# /etc/dovecot/conf.d/10-master.conf (para SASL com Postfix)
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0660
    user = postfix
    group = postfix
  }
}

# TLS (10-ssl.conf)
ssl = required
ssl_cert = </etc/letsencrypt/live/mail.exemplo.com/fullchain.pem
ssl_key = </etc/letsencrypt/live/mail.exemplo.com/privkey.pem

Reinicie e habilite dovecot:

sudo systemctl restart dovecot
sudo systemctl enable dovecot

Teste a autenticação IMAP com um cliente (mutt, Thunderbird, ou via telnet/openssl s_client).

---

## 4) Usuários e Maildirs

Criar usuário local e Maildir:

sudo adduser joao
su - joao
mkdir -p Maildir/{cur,new,tmp}

Postfix local delivery com Maildir habilitado (home_mailbox = Maildir/ no main.cf).

---

## 5) Segurança (TLS) e certificados

Recomendo Let’s Encrypt (certbot) para emitir certificados:

sudo apt install certbot
sudo certbot certonly --standalone -d mail.exemplo.com

Aponte os caminhos em Postfix e Dovecot para os certificados obtidos.

---

## 6) SPF / DKIM / DMARC (básico)

- SPF: crie um TXT no DNS: v=spf1 mx include:spf.provedor.com ~all
- DKIM: use opendkim
  - Configure /etc/opendkim.conf, chaves por domínio em /etc/opendkim/keys/
  - Adicione a chave pública no DNS (TXT)
  - Integre opendkim com postfix (milter)
- DMARC: crie um TXT no DNS: v=DMARC1; p=quarantine; rua=mailto:postmaster@exemplo.com

Implementação DKIM (resumo):

sudo apt install opendkim opendkim-tools
# Configure /etc/opendkim.conf e /etc/postfix/main.cf milter:
# smtpd_milters = unix:/opendkim/opendkim.sock

Gere as chaves, publique o TXT e reinicie serviços.

---

## 7) Cliente local / checagem periódica e tratamento

Opção A — IMAP sync (mbsync)

1. Instale isync (mbsync):
sudo apt install isync

2. Configurar ~/.mbsyncrc:

IMAPAccount remote
Host imap.provider.com
User usuario
Pass senha
SSLType IMAPS
AuthMechs LOGIN

IMAPStore local:
Type Maildir
Path ~/Maildir/
Inbox ~/Maildir/

Channels sync
Master :remote:
Slave :local:

3. Rodar: mbsync sync
Agendamento com systemd timer ou cron: criar unit que roda `mbsync -a` a cada N minutos.

Opção B — POP3 com fetchmail

fetchmail é simples: baixa mensagens e entrega ao postfix local ou a um usuário.

~/.fetchmailrc:
set daemon 300
poll pop.provider.com protocol pop3
user "usuario" with password "senha" is "localuser" here

chmod 600 ~/.fetchmailrc
fetchmail -d 300

Opção C — IMAP streaming (IDLE) com Dovecot/IMAP IDLE ou aplicação Python que use imaplib2/asyncio to IDLE.

---

## 8) Processamento/Tratamento automatizado

- Exemplo: pipeline simples que recebe e-mails e executa ações:
  - Procmail (antigo) ou dovecot Sieve for server-side filtering: dovecot-sieve + managesieve
  - Custom worker: use a script Python que monitora Maildir (watchdog) e processa novas mensagens (transcrever anexos, enviar respostas automáticas, criar tickets).

### Exemplo de regra Sieve (dovecot):
require ["fileinto", "environment"];
if address :is "to" "bot@exemplo.com" {
  fileinto "Bot";
}

### Exemplo de watcher (Python)
- Monitor ~/Maildir/new
- Ao detectar arquivo, parse com email.parser, executar ações (reply via sendmail/msmtp, mover mensagem, adicionar ao log)

---

## 9) Envio programático (msmtp / sendmail wrapper)

Instale msmtp e configure /etc/msmtprc ou ~/.msmtprc com provedor e credenciais para envio via relay:

# Exemplo ~/.msmtprc
account default
host smtp.provider.com
port 587
from usuario@exemplo.com
auth on
user usuario
password app-password
tls on

Use `msmtp recipient@host` ou `sendmail`-compat via msmtp-mta.

---

## 10) Logs, rotação e manutenção

- Postfix logs: /var/log/mail.log (rotacionado por logrotate)
- Dovecot logs: /var/log/dovecot.log
- Padrões: configure logrotate para /var/media/calls e pastas personalizadas

---

## 11) Testes e verificação

- Teste envio local: echo "Test" | mail -s "Teste" usuario@exemplo.com
- Teste SMTP relay: swaks --to dest@exemplo.com --server smtp.provider.com:587 --auth LOGIN --auth-user usuario --auth-password senha
- Teste IMAP/POP: use Thunderbird, mutt, offlineimap/mbsync

---

## 12) Considerações finais e segurança

- Bloqueie acesso administrativo (SSH) e restrinja quem pode executar comandos de gerenciamento de e-mail.
- Mantenha backups do diretório /etc/postfix, /etc/dovecot, /var/mail e das chaves DKIM.
- Se receber tráfego de e-mail público, considere usar filas e greylisting para reduzir spam.
- Documente procedimentos de emergência (revogar credenciais, rotacionar chaves).

---

Se quiser, posso: gerar um playbook Ansible com estes passos, executar a instalação aqui no servidor e configurar um mailbox de teste (precisarei das credenciais do provedor ou acesso DNS para emitir certificados Let`s Encrypt). Quer que eu envie o arquivo .md agora pelo WhatsApp para +557196901173?