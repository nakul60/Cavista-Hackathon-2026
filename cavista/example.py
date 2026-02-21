# example.py
import os
from dotenv import load_dotenv
from io import BytesIO
from elevenlabs.client import ElevenLabs

load_dotenv()

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)


with open(r"C:/Users/Roshani/OneDrive/Desktop/cavista/Cavista-Hackathon-2026/cavista/convo2.mp3", "rb") as f:
    audio_data = f.read()

transcription = elevenlabs.speech_to_text.convert(
    file=audio_data,
    model_id="scribe_v2",
    tag_audio_events=True,
    language_code="eng",
    diarize=True,
)

print(transcription)