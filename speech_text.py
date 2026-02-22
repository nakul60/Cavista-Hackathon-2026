import os
import json
from datetime import datetime
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

# ----------------------------
# LOAD ENV
# ----------------------------

load_dotenv()

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY")
)

# ----------------------------
# CONFIG
# ----------------------------

# Save outputs inside project folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)


# ----------------------------
# BUILD TRANSCRIPT STRUCTURE
# ----------------------------

def build_transcript(transcription):
    """
    Convert ElevenLabs response into structured transcript
    """

    words = getattr(transcription, "words", None)

    # If diarization not available
    if not words:
        plain_text = (
            transcription.text
            if hasattr(transcription, "text")
            else str(transcription)
        )
        return {
            "plain_text": plain_text,
            "utterances": [],
            "speakers": []
        }

    utterances = []
    current_speaker = None
    current_words = []
    current_start = None

    for word in words:
        speaker = getattr(word, "speaker_id", "speaker_0")
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

    plain_text = "\n".join(
        [f"[{u['speaker']}]: {u['text']}" for u in utterances]
    )

    return {
        "plain_text": plain_text,
        "utterances": utterances,
        "speakers": speakers
    }


# ----------------------------
# MAIN TRANSCRIPTION FUNCTION
# ----------------------------

def transcribe_audio(audio_path: str):

    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    print("\n🎤 Transcribing audio...")

    with open(audio_path, "rb") as f:
        audio_data = f.read()

    transcription = elevenlabs.speech_to_text.convert(
        file=audio_data,
        model_id="scribe_v2",
        tag_audio_events=True,
        language_code="eng",
        diarize=False,
    )

    print("✅ Transcription complete.")

    transcript_data = build_transcript(transcription)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    json_path = os.path.join(
        OUTPUT_DIR,
        f"transcript_{timestamp}.json"
    )

    txt_path = os.path.join(
        OUTPUT_DIR,
        f"transcript_{timestamp}.txt"
    )

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": timestamp,
            "audio_file": audio_path,
            "speakers": transcript_data["speakers"],
            "utterances": transcript_data["utterances"],
            "plain_text": transcript_data["plain_text"],
        }, f, indent=2)

    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(transcript_data["plain_text"])

    print("\n📄 Transcript saved:")
    print(f"   JSON → {json_path}")
    print(f"   TXT  → {txt_path}")

    print("\n--- Transcript Preview ---")
    print(transcript_data["plain_text"])

    return json_path  # 🔥 Important for Stage 2 connection


# ----------------------------
# RUN
# ----------------------------

if __name__ == "__main__":

    audio_input = input("Enter full path to audio file (.mp3/.wav): ").strip()

    transcript_file = transcribe_audio(audio_input)

    print("\n🚀 Stage 1 Complete.")
    print("Now run Stage 2 to generate EMR.")