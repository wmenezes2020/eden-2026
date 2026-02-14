#!/bin/bash
# Script para iniciar autenticação WhatsApp e enviar QR code para o Telegram

export PATH=/usr/local/go/bin:$PATH
export GOBIN=/root/go/bin
export HOME=/root

QR_DIR="/root/clawd"
QR_IMAGE="$QR_DIR/qr_code.png"
QR_DATA="$QR_DIR/qr_code.txt"

echo "=== WhatsApp Auth QR Sender ==="
echo "Iniciando geração de QR code..."
echo ""

# Remove QR codes antigos
rm -f "$QR_IMAGE" "$QR_DATA"

# Inicia o qr_sender em background
/root/go/bin/qr_sender &
QR_PID=$!

# Aguarda o QR code ser gerado (máximo 30 segundos)
echo "Aguardando QR code..."
sleep 30

# Verifica se o QR code foi gerado
if [ -f "$QR_IMAGE" ]; then
    echo ""
    echo "✅ QR code gerado com sucesso!"
    echo "📍 Localização: $QR_IMAGE"
    echo ""
    echo "Para enviar para o Telegram, use o comando:"
    echo "  /root/go/bin/wacli chats list"
    echo ""
    echo "Ou reinicie o clawdbot para que ele possa enviar a imagem automaticamente."
else
    echo ""
    echo "⚠️ QR code não foi gerado ainda. Verificando status..."
    if [ -f "$QR_DATA" ]; then
        echo "Dados do QR disponíveis, mas a imagem falhou."
    fi
fi

# Mata o processo se ainda estiver rodando
kill $QR_PID 2>/dev/null

echo ""
echo "Processo concluído."
