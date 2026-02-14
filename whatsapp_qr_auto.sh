#!/bin/bash
# Script para gerar QR code do WhatsApp atualizado a cada 5 segundos

export PATH=/usr/local/go/bin:$PATH
export HOME=/root

QR_DIR="/root/clawd"
QR_DATA="$QR_DIR/qr_data.json"
QR_IMAGE="$QR_DIR/qr_image.png"
CHAT_ID="5239423422"

echo "=== WhatsApp QR Auto-Sender ==="
echo "Iniciando geração automática de QR codes..."
echo "O QR será atualizado a cada 5 segundos"
echo ""

# Função para enviar imagem pelo Telegram
send_qr() {
    local image_path=$1
    local attempt=$2
    
    if [ -f "$image_path" ]; then
        # Envia via curl para API do Telegram
        curl -s -X POST "https://api.telegram.org/bot8251482019:AAFRWHHU0Ln2s_EDzrwPTlKGqxIl9DE0EYQ/sendPhoto" \
            -F chat_id="$CHAT_ID" \
            -F photo="@$image_path" \
            -F caption="QR Code WhatsApp #${attempt}\nEscaneie agora!" \
            > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo "[$(date '+%H:%M:%S')] ✅ QR #$attempt enviado para Telegram"
        else
            echo "[$(date '+%H:%M:%S')] ⚠️ Falha ao enviar QR #$attempt"
        fi
    fi
}

# Função para verificar status de autenticação
check_auth() {
    /root/go/bin/wacli auth status --json 2>/dev/null | grep -q "logged_in\|success" && return 0 || return 1
}

# Loop principal
ATTEMPT=0
MAX_ATTEMPTS=60  # 5 minutos máximo

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    
    echo "[$(date '+%H:%M:%S')] Gerando QR Code #$ATTEMPT..."
    
    # Gera novo QR code
    /root/go/bin/wacli_qr auth --qr-file "$QR_DIR/qr_temp" 2>&1 &
    WACLI_PID=$!
    
    # Aguarda o QR ser gerado
    sleep 5
    
    # Mata o processo wacli se ainda estiver rodando
    kill $WACLI_PID 2>/dev/null
    wait $WACLI_PID 2>/dev/null
    
    # Verifica se o QR foi gerado
    if [ -f "$QR_DIR/qr_temp.png" ]; then
        # Move para arquivo atual
        cp "$QR_DIR/qr_temp.png" "$QR_IMAGE"
        
        # Envia para Telegram
        send_qr "$QR_IMAGE" $ATTEMPT
        
        # Verifica se está autenticado
        if /root/go/bin/wacli auth status 2>&1 | grep -qi "logged\|success"; then
            echo ""
            echo "🎉 Autenticação confirmada!"
            /root/go/bin/wacli auth status
            exit 0
        fi
    else
        echo "[$(date '+%H:%M:%S')] ⚠️ QR não gerado ainda"
    fi
    
    # Aguarda intervalo
    sleep 5
done

echo ""
echo "⏰ Timeout após $MAX_ATTEMPTS tentativas"
echo "Por favor, tente novamente ou escaneie o último QR code"
