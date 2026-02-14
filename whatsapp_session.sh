#!/bin/bash
# WhatsApp QR Sender - Sessão única que mantém o QR code válido

export PATH=/usr/local/go/bin:$PATH
export HOME=/root

CHAT_ID="5239423422"
QR_DIR="/root/clawd"
QR_FILE="$QR_DIR/current_qr"
LOG_FILE="$QR_DIR/whatsapp_session.log"

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
    echo " (enviado)"
}

# Para sessões anteriores
log "=== Nova Sessão WhatsApp ==="
pkill -f "wacli auth" 2>/dev/null
sleep 2

# Cria diretório
mkdir -p "$QR_DIR"

# Inicia wacli auth em modo follow (mantém sessão aberta)
# Isso gera UM QR code que fica rodando até expirar ou ser escaneado
log "Iniciando wacli auth --follow..."

# Roda em background e captura output
{
    /root/go/bin/wacli auth --follow 2>&1
} &
WACLI_PID=$!

log "Processo wacli iniciado (PID: $WACLI_PID)"

# Variáveis de controle
LAST_SIZE=0
QR_COUNT=0
LAST_QR_CHECK=0

while kill -0 $WACLI_PID 2>/dev/null; do
    # Verifica se há QR code image
    if [ -f "$QR_FILE.png" ]; then
        CURRENT_SIZE=$(stat -c %s "$QR_FILE.png" 2>/dev/null || echo 0)
        CURRENT_MTIME=$(stat -c %Y "$QR_FILE.png" 2>/dev/null || echo 0)
        
        # Se tamanho mudou ou é um QR novo (mais recente que 3s atrás)
        if [ "$CURRENT_SIZE" -ne "$LAST_SIZE" ] || [ $(( $(date +%s) - CURRENT_MTIME )) -lt 3 ]; then
            if [ "$CURRENT_SIZE" -ne "$LAST_SIZE" ]; then
                QR_COUNT=$((QR_COUNT + 1))
                LAST_SIZE=$CURRENT_SIZE
                log ""
                log "📱 QR Code #$QR_COUNT gerado (${CURRENT_SIZE} bytes)"
                log "   Enviando para Telegram..."
                
                # Envia para Telegram
                echo -n "   → "
                send_photo "📱 QR Code WhatsApp #$QR_COUNT\n\n⏰ Expira em ~20 segundos\n\nVincule em:\nWhatsApp → Configurações → Dispositivos Vinculados → Vincular Dispositivo"
            fi
        fi
    fi
    
    # Verifica se há dados do QR (para saber se está rodando)
    if [ -f "$QR_FILE" ]; then
        if [ $(($(date +%s) - LAST_QR_CHECK)) -gt 10 ]; then
            LAST_QR_CHECK=$(date +%s)
            # Verifica status JSON
            STATUS=$(/root/go/bin/wacli auth status --json 2>/dev/null)
            if echo "$STATUS" | grep -qi "logged_in.*true\|success.*true"; then
                PHONE=$(echo "$STATUS" | grep -oE '"phone[^"]*"[^"]*"[^"]*"' | grep -oE '[0-9]+' | head -1)
                log ""
                log "✅ AUTENTICAÇÃO CONCLUÍDA!"
                log "   Phone: $PHONE"
                send_photo "✅ WhatsApp conectado com sucesso!\n\n📞 Número: $PHONE"
                kill $WACLI_PID 2>/dev/null
                exit 0
            fi
        fi
    fi
    
    sleep 1
done

log "Sessão encerrada"
