import os
import json
from datetime import datetime
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

load_dotenv()

elevenlabs = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

AUDIO_PATH = r"C:/Users/Roshani/OneDrive/Desktop/cavista/Cavista-Hackathon-2026/cavista/convo.mp3"
OUTPUT_DIR = r"C:/Users/Roshani/OneDrive/Desktop/cavista/Cavista-Hackathon-2026/cavista/outputs"

#when frontend will be connected this will be used to save transcripts 
# OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

print("  Transcribing audio...")

with open(AUDIO_PATH, "rb") as f:
    audio_data = f.read()

transcription = elevenlabs.speech_to_text.convert(
    file=audio_data,
    model_id="scribe_v2",
    tag_audio_events=True,
    language_code="eng",
    diarize=False,
)

print("Transcription complete.")

def build_transcript(transcription):
    """Parse ElevenLabs diarized transcription into structured format."""
    words = getattr(transcription, "words", None)

    if not words:
        plain_text = transcription.text if hasattr(transcription, "text") else str(transcription)
        return {"plain_text": plain_text, "utterances": [], "speakers": []}

    utterances = []
    current_speaker = None
    current_words = []
    current_start = None

    for word in words:
        speaker = getattr(word, "speaker_id", "unknown")
        text = getattr(word, "text", "")
        start = getattr(word, "start", None)
        end = getattr(word, "end", None)

        if speaker != current_speaker:
            if current_words:
                utterances.append({
                    "speaker": current_speaker,
                    "start": current_start,
                    "end": end,
                    "text": " ".join(current_words).strip(),
                })
            current_speaker = speaker
            current_words = [text]
            current_start = start
        else:
            current_words.append(text)

    if current_words:
        utterances.append({
            "speaker": current_speaker,
            "start": current_start,
            "end": None,
            "text": " ".join(current_words).strip(),
        })

    speakers = list({u["speaker"] for u in utterances})
    plain_text = "\n".join([f"[{u['speaker']}]: {u['text']}" for u in utterances])

    return {"plain_text": plain_text, "utterances": utterances, "speakers": speakers}


transcript_data = build_transcript(transcription)

json_path = os.path.join(OUTPUT_DIR, f"transcript_{timestamp}.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump({
        "timestamp": timestamp,
        "audio_file": AUDIO_PATH,
        "speakers": transcript_data["speakers"],
        "utterances": transcript_data["utterances"],
        "plain_text": transcript_data["plain_text"],
    }, f, indent=2)

txt_path = os.path.join(OUTPUT_DIR, f"transcript_{timestamp}.txt")
with open(txt_path, "w", encoding="utf-8") as f:
    f.write(transcript_data["plain_text"])

print(f"Transcript saved:")
print(f"   JSON → {json_path}")
print(f"   TXT  → {txt_path}")
print(f"\n--- Transcript Preview ---")
print(transcript_data["plain_text"])