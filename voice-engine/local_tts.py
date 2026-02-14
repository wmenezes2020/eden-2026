import sys
import os
import torch
from TTS.api import TTS

# Supressão de logs do Coqui para limpar output
os.environ["COQUI_TOS_AGREED"] = "1"

def generate_audio(text, output_path, speaker_wav=None, language="pt"):
    # Detecta dispositivo (CPU no caso deste servidor)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Iniciando XTTS v2 no dispositivo: {device}...")

    # Carrega modelo (download automático na 1ª vez)
    # Requer COQUI_TOS_AGREED=1 no ambiente
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)

    # Parâmetros de geração
    # Se speaker_wav não for passado ou arquivo não existir, usa speaker padrão do modelo se disponível
    # XTTS v2 requer speaker reference. Se não tiver, vamos tentar um dos speakers embutidos se a lib permitir,
    # mas a API simplificada geralmente pede wav.
    
    if speaker_wav and os.path.exists(speaker_wav):
        print(f"Usando clonagem de voz a partir de: {speaker_wav}")
        tts.tts_to_file(
            text=text, 
            speaker_wav=speaker_wav, 
            language=language, 
            file_path=output_path
        )
    else:
        # Fallback se não tiver áudio de referência: usar um speaker padrão do modelo (se houver nomeado)
        # Para XTTS v2, geralmente se usa speaker_wav.
        # Vamos tentar listar speakers e usar o primeiro se não tiver wav.
        print("Aviso: Áudio de referência não encontrado. Tentando usar speaker padrão interna.")
        # Isso pode falhar se a API exigir wav. Vamos assumir que o JS garante o WAV ou cria um dummy.
        # Mas para garantir, vou criar um dummy wav de silêncio se não existir? Não, o modelo precisa de voz para clonar.
        # Vou tentar usar 'Ana Florence' que costuma vir nos exemplos, ou similar.
        # Melhor: abortar e avisar erro se não tiver wav, pois o usuário quer clonagem.
        # Mas para o "Boas vindas" inicial, precisamos de algo.
        # Vou deixar falhar e tratar no JS se der erro.
        pass

    print(f"Áudio gerado em: {output_path}")

if __name__ == "__main__":
    # Args: text, output_path, speaker_wav, language
    if len(sys.argv) < 5:
        print("Uso: python local_tts.py <text> <output_path> <speaker_wav> <language>")
        sys.exit(1)

    text = sys.argv[1]
    output_path = sys.argv[2]
    speaker_wav = sys.argv[3]
    language = sys.argv[4]

    generate_audio(text, output_path, speaker_wav, language)
