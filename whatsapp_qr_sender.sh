#!/bin/bash
# WhatsApp QR Sender - Mantém sessão aberta e envia QR codes atualizados

export PATH=/usr/local/go/bin:$PATH
export HOME=/root

CHAT_ID="5239423422"
QR_DIR="/root/clawd"
QR_FILE="$QR_DIR/wacli_qr_temp"
LOG_FILE="$QR_DIR/qr_sender.log"

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

send_photo() {
    local caption="$1"
    curl -s -X POST "https://api.telegram.org/bot8251482019:AAFRWHHU0Ln2s_EDzrwPTlKGqxIl9DE0EYQ/sendPhoto" \
        -F chat_id="$CHAT_ID" \
        -F photo="@$QR_FILE.png" \
        -F caption="$caption" \
        > /dev/null 2>&1
}

log "=== WhatsApp QR Sender Iniciado ==="
log "Este script mantém uma sessão aberta do WhatsApp"
log "Os QR codes serão atualizados automaticamente quando expirarem"
log ""

# Mata processos anteriores
pkill -f "wacli auth" 2>/dev/null
pkill -f "wacli_qr" 2>/dev/null
sleep 1

# Inicia wacli auth em modo follow (mantém sessão aberta)
log "Iniciando sessão WhatsApp..."
log "O QR code será gerado em breve..."

# Inicia o wacli e captura a saída
{
    /root/go/bin/wacli_qr auth --qr-file "$QR_FILE" --follow
} &
WACLI_PID=$!

# Monitora a saída do wacli
LAST_QR_TIME=0
ATTEMPT=0

while kill -0 $WACLI_PID 2>/dev/null; do
    # Verifica se há novo QR code
    if [ -f "$QR_FILE.png" ]; then
        QR_MTIME=$(stat -c %Y "$QR_FILE.png" 2>/dev/null || echo 0)
        
        # Se o QR code foi atualizado recentemente (últimos 3 segundos)
        if [ $QR_MTIME -gt $((LAST_QR_TIME - 3)) ] && [ $QR_MTIME -ne $LAST_QR_TIME ]; then
            ATTEMPT=$((ATTEMPT + 1))
            LAST_QR_TIME=$QR_MTIME
            
            log "QR Code #$ATTEMPT gerado! Enviando para Telegram..."
            
            # Envia para Telegram
            send_photo "📱 QR Code WhatsApp #${ATTEMPT}\n\n⏰ Expira em ~20 segundos\n\nVincule em:\nWhatsApp > Configurações > Dispositivos Vinculados > Vincular Dispositivo"
            
            log "QR #$ATTEMPT enviado!"
        fi
    fi
    
    # Verifica status de autenticação
    if /root/go/bin/wacli auth status 2>&1 | grep -qi "logged\|success\|authenticated"; then
        log ""
        log "🎉 AUTENTICAÇÃO CONFIRMADA!"
        log ""
        PHONE=$(/root/go/bin/wacli auth status 2>&1 | grep -oE '[0-9]{10,}' | head -1)
        if [ -n "$PHONE" ]; then
            send_photo "✅ WhatsApp conectado com sucesso!\n\n📞 Número: $PHONE"
        else
            send_photo "✅ WhatsApp conectado com sucesso!"
        fi
        log "Sessão estabelecida. Encerrando..."
        kill $WACLI_PID 2>/dev/null
        exit 0
    fi
    
    sleep 1
done

log "Sessão encerrada ou erro occurred"
