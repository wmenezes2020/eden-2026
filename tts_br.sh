#!/bin/bash
# TTS em Português Brasileiro usando gTTS

# Uso: ./tts_br.sh "Seu texto aqui" [arquivo.mp3]

TEXT="${1:-Olá, tudo bem com você?}"
OUTPUT="${2:-/root/clawd/tts_br.mp3}"

python3 -c "
from gtts import gTTS
import os

tts = gTTS(text='''$TEXT''', lang='pt-br', slow=False)
tts.save('$OUTPUT')
print('Áudio gerado: $OUTPUT')
" 2>&1
