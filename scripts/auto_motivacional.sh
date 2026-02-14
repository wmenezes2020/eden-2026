#!/bin/bash
# Script de envio automático de mensagens de autoestima
# Executado via cron - integra com Clawdbot CLI

WHATSAPP_CONTACTS=(
    "557998682773:Thaissa"
    "5519974260557:Ninha"
    "557196901173:Wesley"
    "5571996901173:Wesley"
)

# Frases de autoestima (rotacionam aleatoriamente)
PHRASES=(
    "Você é incrível do jeito que é! 💪"
    "Acredite em você, porque eu acredito!"
    "Seu potencial é ilimitado!"
    "Você consegue realizar tudo o que imaginar!"
    "Hoje é um ótimo dia para brilhar! ✨"
    "Você é forte, capaz e vai longe!"
    "Confie no processo, você está no caminho certo!"
    "Seu valor não depende da opinião dos outros!"
    "Você está fazendo um ótimo trabalho!"
    "A cada dia, você fica melhor!"
)

# Escolhe frase aleatória
RANDOM_PHRASE=${PHRASES[$((RANDOM % ${#PHRASES[@]}))]}

# Mensagem com base no horário
HOUR=$(date +%H)
if [ "$HOUR" -ge 6 ] && [ "$HOUR" -lt 12 ]; then
    MESSAGE="☀️ Bom dia! $RANDOM_PHRASE"
elif [ "$HOUR" -ge 12 ] && [ "$HOUR" -lt 18 ]; then
    MESSAGE="🌅 Boa tarde! $RANDOM_PHRASE"
else
    MESSAGE="🌙 Boa noite! $RANDOM_PHRASE"
fi

# Função para enviar mensagem via Clawdbot CLI
send_message() {
    local number=$1
    local name=$2
    
    clawdbot message send --channel whatsapp --target +"$number" --message "$MESSAGE" > /dev/null 2>&1
    
    echo "✓ $name"
}

echo "[$(date)] Iniciando rodada de envios..."
echo "Mensagem: $MESSAGE"
echo ""

for contact in "${WHATSAPP_CONTACTS[@]}"; do
    number=$(echo "$contact" | cut -d':' -f1)
    name=$(echo "$contact" | cut -d':' -f2)
    
    send_message "$number" "$name"
    
    echo "[$(date)] $name ($number): $MESSAGE" >> /root/clawd/logs/motivacional.log
done

echo ""
echo "[$(date)] Envio concluído!"
