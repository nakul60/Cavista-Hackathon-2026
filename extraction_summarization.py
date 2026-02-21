from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from openai import OpenAI
import os
import json
import re
from dotenv import load_dotenv


# ----------------------------
# NVIDIA Llama 3 Client
# ----------------------------

load_dotenv()

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("OPENAI_API_KEY")
)

MODEL_NAME = "meta/llama3-70b-instruct"


# ----------------------------
# EMR Schema
# ----------------------------

class EMR(BaseModel):

    patient: Dict[str, Optional[Any]] = Field(default_factory=lambda: {
        "name": None,
        "age": None,
        "gender": None,
        "occupation": None
    })

    visit: Dict[str, Any] = Field(default_factory=lambda: {
        "date": datetime.today().strftime("%Y-%m-%d"),
        "type": "Outpatient Consultation"
    })

    chief_complaint: Optional[str] = None

    history_of_present_illness: Dict[str, Any] = Field(default_factory=lambda: {
        "duration": None,
        "location": None,
        "severity_out_of_10": None,
        "character": None,
        "aggravating_factors": [],
        "relieving_factors": [],
        "medications_tried": []
    })

    review_of_systems: Dict[str, Any] = Field(default_factory=lambda: {
        "constitutional": [],
        "neurological": [],
        "cardiovascular": [],
        "respiratory": [],
        "gastrointestinal": [],
        "musculoskeletal": [],
        "sleep": None,
        "other": []
    })

    past_medical_history: Dict[str, Any] = Field(default_factory=lambda: {
        "conditions": [],
        "surgeries": [],
        "hospitalizations": []
    })

    family_history: Dict[str, Any] = Field(default_factory=dict)

    social_history: Dict[str, Any] = Field(default_factory=lambda: {
        "occupation": None,
        "stress_level": None,
        "smoking": None,
        "alcohol": None,
        "exercise": None,
        "diet": None,
        "recent_life_changes": None
    })

    current_medications: List[str] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    provisional_diagnosis: Optional[str] = None
    ai_confidence: Optional[float] = None
    fields_not_mentioned: List[str] = Field(default_factory=list)


# ----------------------------
# Llama API Call Helper
# ----------------------------

def llama_chat(prompt, temperature=0.1):
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "You are a medical AI assistant."},
            {"role": "user", "content": prompt}
        ],
        temperature=temperature,
        max_tokens=2048
    )
    return response.choices[0].message.content.strip()


# ----------------------------
# Generate Summary From Transcript
# ----------------------------

def generate_summary_from_transcript(conversation):

    # Remove speaker labels
    cleaned = re.sub(r"\[speaker_\d+\]:", "", conversation)
    cleaned = cleaned.strip()

    prompt = f"""
Create a clear, short, patient-friendly medical summary 
from this doctor-patient conversation.

Ignore speaker labels.
Do NOT hallucinate.
Only use explicitly mentioned information.

CONVERSATION:
{cleaned}
"""

    return llama_chat(prompt, temperature=0.2)


# ----------------------------
# Generate EMR From Summary
# ----------------------------

def generate_emr_from_summary(summary_text):

    prompt = f"""
You are a clinical data extraction AI.

From the medical summary below, extract structured data 
and return JSON in the EXACT schema format.

==============================
EXTRACTION INSTRUCTIONS
==============================

PATIENT:
- patient.name → Extract full name if mentioned.
- patient.age → Extract numeric age only.
- patient.gender → Extract if explicitly mentioned.

CHIEF COMPLAINT:
- Main reason for visit (primary symptom).

HISTORY OF PRESENT ILLNESS:
- duration → How long symptoms present.
- location → Where pain/symptom is located.
- severity_out_of_10 → Numeric value if mentioned.
- character → Type/description of pain.

REVIEW OF SYSTEMS:
- gastrointestinal → Symptoms like loose motions, diarrhea, vomiting.
- Fill other systems only if mentioned.

RULES:
- If information exists, you MUST fill it.
- If not mentioned, keep null or empty.
- Do NOT hallucinate.
- Return ONLY valid JSON.
- No explanation.
- No markdown.

==============================
SUMMARY:
{summary_text}
==============================
"""

    content = llama_chat(prompt, temperature=0.1)

    content = content.replace("```json", "").replace("```", "").strip()

    match = re.search(r"\{.*\}", content, re.DOTALL)
    if not match:
        print("Raw output:\n", content)
        raise ValueError("No valid JSON found.")

    return json.loads(match.group(0))

# ----------------------------
# MAIN PIPELINE
# ----------------------------

def process_pipeline(conversation):

    # STEP 1 → Generate summary
    summary = generate_summary_from_transcript(conversation)

    print("\n--- GENERATED SUMMARY ---\n")
    print(summary)

    decision = input("\nDo you approve this summary? (yes/no): ").strip().lower()

    if decision == "yes":
        final_summary = summary
    else:
        user_edit = input("\nEnter corrections or additional details:\n")

    # Merge original + correction
        final_summary = summary + " " + user_edit

    # STEP 2 → Generate EMR from approved summary
    extracted_data = generate_emr_from_summary(final_summary)

    # Validate using Pydantic
    emr = EMR(**extracted_data)
    final_emr = emr.model_dump()

    return final_emr


# ----------------------------
# RUN
# ----------------------------

if __name__ == "__main__":

    conversation = """
[speaker_0]: Good   morning.   So   what   seems   to   be   the   problem   today?
[speaker_1]: Good   morning,   doctor.   I've   been   having   headaches   for   the   past   few   days.
[speaker_0]: How   long   exactly?
[speaker_1]: Uh,   about   five   days   now.
[speaker_0]: Can   you   describe   the   headache?
[speaker_1]: It's   a   dull,   constant   pain   in   the   back   of   my   head.   It   feels   like   a   pressure.
[speaker_0]: Okay.   So   is   it   continuous,   or   does   it   come   and   go?
[speaker_1]: Mostly   continuous,   but   worse   in   the   morning.
[speaker_0]: Okay,   so   on   a   scale   of   one   to   ten,   how   worse   it   is?
[speaker_1]: Like   seven.
[speaker_0]: Do   you   have   any   associated   symptoms   like   nausea,   vomiting,   dizziness,   or   blurred   vision?
[speaker_1]: Uh,   I've   been   slightly   dizzy   in   the   morning   and   had,   had   mild   nausea.   [chuckles]   No   vomiting,   though.
[speaker_0]: Uh,   okay,   so   sensitivity   to   so-   light   or   sound?
[speaker_1]: Yes,   bright   light   bothers   me   when   the   pa-   pain   get   worse...   gets   worse.
[speaker_0]: Does   anything   trigger   it?
[speaker_1]: Uh,   long   hours   on   my   laptop   seem   to   make   it   worse.
[speaker_0]: Anything   that   relieves   it?
[speaker_1]: Resting   in   the   dark   room   helps.   I   took   a   paracetamol   once.   It   helped   a   little.
[speaker_0]: So   have   you   had   similar   headaches   before?
[speaker_1]: Occasionally,   but   not   this   persistent.
[speaker_0]: Okay,   so   do   you   have   any   fever,   neck   stiffness,   or   recent   infections?
[speaker_1]: No,   no.
[speaker_0]: How   long   has   your   sleep   been?
[speaker_1]: Poor.   I've   been   sleeping   late   due   to   work.
[speaker_0]: So   tell   me   about   yourself.   What   do   you   do?
[speaker_1]: So   I'm   a   software   engineer.
[speaker_0]: How   many-
[speaker_1]: Like,   I   work   around   ten   to   eleven   hours.
[speaker_0]: Oh,   okay.   So   are   you   stressed   recently   due   to   your   job?
[speaker_1]: Yeah,   due   to   deadlines.
[speaker_0]: Okay.   Uh,   do   you   have   any   medical   conditions   like   blood,   blood   pressure,   diabetes,   or   thyroid   issues?
[speaker_1]: No   known   conditions.
[speaker_0]: Okay.   Do   you   take   any   medications?
[speaker_1]: Just   a   vitamin   D   supplement.
[speaker_0]: Okay.   Uh,   do   you   have   any   allergies?
[speaker_1]: None.
[speaker_0]: Okay.   Uh,   so   do   you   have   any   family   history   issues   like   migraine   or   neurological   problems?
[speaker_1]: Not   that   I'm   aware   of.
[speaker_0]: Okay.   From   what   you   describe,   this   appears   to   be   a   consistent   type   of   headache,   likely   aggravated   by   stress   and   prolonged   screen   time.
[speaker_1]: So   is   it   serious?
[speaker_0]: It   doesn't   sound   alarming   based   on   your   symptoms,   but   we'll   monitor.   I'll   prescribe   medication   for   relief   and   recommend   some   lifestyle   adjustments,   like   better   sleep,   hydration,   screen   breaks,   and   stress   management.
[speaker_1]: Okay,   doctor.
[speaker_0]: If   the   headache   worsens,   becomes   severe   suddenly,   or   you   develop   vomiting,   vision   problems,   or   [chuckles]   weakness,   come   back   immediately.
[speaker_1]: You're   very   unsympathetic,   doctor.   [chuckles]
[speaker_0]: Thank   you.
[speaker_1]: Understood,   but   I   will   not   say   thank   you.
[speaker_0]: See   you-
[speaker_1]: You   were   laughing.   [chuckles]
[speaker_0]: Good   day.

"""

    final_emr = process_pipeline(conversation)

    with open("final_emr_output.json", "w", encoding="utf-8") as f:
        json.dump(final_emr, f, indent=4)

    print("\n✅ FINAL EMR JSON saved as 'final_emr_output.json'")