#!/bin/bash
# WhatsApp QR Sender - Versão que captura QR da saída do wacli

export PATH=/usr/local/go/bin:$PATH
export HOME=/root

CHAT_ID="5239423422"
QR_DIR="/root/clawd"
LOG_FILE="$QR_DIR/wacli_monitor.log"

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

send_photo() {
    local caption="$1"
    curl -s -X POST "https://api.telegram.org/bot8251482019:AAFRWHHU0Ln2s_EDzrwPTlKGqxIl9DE0EYQ/sendPhoto" \
        -F chat_id="$CHAT_ID" \
        -F photo="@$QR_DIR/qr.png" \
        -F caption="$caption" \
        > /dev/null 2>&1
}

# Mata processos anteriores e limpa
pkill -9 -f "wacli" 2>/dev/null
sleep 2

log "=== Monitor WhatsApp Iniciado ==="
log "Iniciando sessão wacli..."

# Cria pipe para capturar saída do wacli
PIPE="/tmp/wacli_output"
rm -f "$PIPE"
mkfifo "$PIPE"

# Inicia wacli e captura stdout
/root/go/bin/wacli auth --follow > "$PIPE" 2>&1 &
WACLI_PID=$!
log "wacli iniciado (PID: $WACLI_PID)"

# Variáveis
LAST_QR_CHECKSUM=""
QR_COUNT=0
QR_SENT=false

# Loop principal - lê do pipe
while true; do
    # Lê linha do pipe (bloqueia até haver dados)
    if ! read line < "$PIPE"; then
        log "Pipe fechado ou erro"
        break
    fi
    
    # Verifica se é QR code (linhas com █)
    if echo "$line" | grep -q "█"; then
        # Captura todo o QR code (múltiplas linhas)
        QR_ASCII=""
        while echo "$line" | grep -q "█"; do
            QR_ASCII="$QR_ASCII$line"$'\n'
            if ! read line < "$PIPE"; then
                break
            fi
        done
        
        # Gera checksum do QR para detectar mudanças
        QR_CHECKSUM=$(echo "$QR_ASCII" | md5sum | cut -d' ' -f1)
        
        if [ "$QR_CHECKSUM" != "$LAST_QR_CHECKSUM" ]; then
            LAST_QR_CHECKSUM=$QR_CHECKSUM
            QR_COUNT=$((QR_COUNT + 1))
            QR_SENT=true
            
            log "QR Code #$QR_COUNT detectado!"
            
            # Extrai dados do QR (procure por padrão numérico)
            QR_DATA=$(echo "$QR_ASCII" | grep -oE '[0-9]+@[a-zA-Z0-9+/=]+' | head -1)
            
            if [ -n "$QR_DATA" ]; then
                # Gera imagem PNG
                echo "$QR_DATA" | qrencode -o "$QR_DIR/qr.png" -s 8 -l H
                
                # Envia para Telegram
                log "Enviando QR #$QR_COUNT para Telegram..."
                send_photo "📱 QR Code WhatsApp #$QR_COUNT\n\n⏰ Escaneie agora!"
                log "QR #$QR_COUNT enviado!"
            else
                log "Não foi possível extrair dados do QR"
            fi
        fi
    fi
    
    # Verifica se foi autenticado
    if echo "$line" | grep -qi "success\|logged\|authenticated"; then
        log ""
        log "✅ AUTENTICAÇÃO CONCLUÍDA!"
        log "Encerrando..."
        
        # Envia confirmação
        send_photo "✅ WhatsApp conectado com sucesso!"
        
        kill $WACLI_PID 2>/dev/null
        rm -f "$PIPE"
        exit 0
    fi
    
    # Verifica timeout (se não recebeu QR novo nos últimos 30 segundos)
    if [ "$QR_SENT" = true ] && [ $(($(date +%s) - $(date -r "$QR_DIR/qr.png" +%s 2>/dev/null || echo 0))) -gt 30 ]; then
        # QR antigo, wacli deve gerar novo automaticamente
        QR_SENT=false
        log "QR anterior expirando, aguardando novo..."
    fi
done

# Limpeza
kill $WACLI_PID 2>/dev/null
rm -f "$PIPE"
log "Monitor encerrado"
