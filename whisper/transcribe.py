# Whisper transcription script placeholder

def transcribe(audio_path):
    # TODO: Implement transcription using OpenAI Whisper
    return "Transcription not implemented."

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python transcribe.py <audio_file>")
    else:
        result = transcribe(sys.argv[1])
        print(result)
