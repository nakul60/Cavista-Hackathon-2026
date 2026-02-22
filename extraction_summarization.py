from pydantic import BaseModel, Field, ValidationError
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
# Llama API Call
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
# Generate Summary
# ----------------------------

def generate_summary_from_transcript(conversation):

    cleaned = re.sub(r"\[speaker_\d+\]:", "", conversation).strip()

    prompt = f"""
Create a clear, short, patient-friendly medical summary 
from this doctor-patient conversation.

Do NOT hallucinate.
Only use explicitly mentioned information.

CONVERSATION:
{cleaned}
"""

    return llama_chat(prompt, temperature=0.2)


# ----------------------------
# Generate EMR JSON
# ----------------------------

def generate_emr_from_summary(summary_text):

    empty_schema = EMR().model_dump()

    prompt = f"""
You are a clinical data extraction AI.

Fill the following JSON schema using ONLY information 
from the summary below.

IMPORTANT RULES:
- Do NOT change structure.
- Do NOT add new keys.
- If field not mentioned → keep null or empty list.
- Return ONLY valid JSON.
- No explanation.
- No markdown.

JSON SCHEMA TO FILL:
{json.dumps(empty_schema, indent=2)}

SUMMARY:
{summary_text}
"""

    content = llama_chat(prompt, temperature=0)

    content = content.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        print("\n⚠ Raw Model Output:\n", content)
        raise ValueError("Model did not return valid JSON.")


# ----------------------------
# Field Updater (Doctor Editing)
# ----------------------------

def update_nested_field(data, field_path, new_value):

    keys = field_path.split(".")
    current = data

    for key in keys[:-1]:
        if key not in current:
            print("❌ Invalid field path.")
            return data
        current = current[key]

    final_key = keys[-1]

    # Auto-type conversion
    if new_value.isdigit():
        new_value = int(new_value)
    elif new_value.lower() == "null":
        new_value = None

    # Handle list fields (comma separated)
    if isinstance(current.get(final_key), list):
        new_value = [x.strip() for x in new_value.split(",")]

    current[final_key] = new_value
    return data


# ----------------------------
# MAIN PIPELINE
# ----------------------------
def process_pipeline(conversation):
    # STEP 1 → Summary Approval Loop
    summary = generate_summary_from_transcript(conversation)

    while True:
        print("\n--- GENERATED SUMMARY ---\n")
        print(summary)
        decision = input("\nDo you approve this summary? (yes/no): ").strip().lower()

        if decision == "yes":
            print("\n✅ Summary Approved.")
            final_summary = summary
            break
        elif decision == "no":
            correction = input("\nEnter corrections or missing details:\n")
            refinement_prompt = f"""
You previously generated this patient summary:

{summary}

The doctor provided the following corrections:
{correction}

Generate a corrected, clean, patient-friendly medical summary.

Rules:
- Use original content + corrections
- Do NOT hallucinate
- Keep it concise
- Return only the updated summary text
"""
            summary = llama_chat(refinement_prompt, temperature=0.2)
        else:
            print("Please enter 'yes' or 'no'.")

    # STEP 2 → EMR Generation
    extracted_data = generate_emr_from_summary(final_summary)
    emr = EMR(**extracted_data)
    final_emr = emr.model_dump()

    # STEP 3 → Doctor Validation Loop
    while True:
        doctor_decision = input("\nDoctor, is this EMR correct? (yes/no): ").strip().lower()
        if doctor_decision == "yes":
            # Save EMR JSON locally ONLY after doctor confirms
            output_path = os.path.join(
                os.path.dirname(os.path.abspath(__file__)),
                "final_emr_output.json"
            )
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(final_emr, f, indent=4)

            print(f"\n✅ FINAL EMR JSON saved as: {output_path}")
            print("\n✅ EMR Finalized.")
            return final_emr

        elif doctor_decision == "no":
            print("\nYou can edit fields using dot notation.")
            print("Examples: patient.name, patient.age, chief_complaint, history_of_present_illness.location")
            field = input("\nEnter field to update: ").strip()
            value = input("Enter new value: ").strip()

            updated_emr = update_nested_field(final_emr, field, value)

            try:
                validated = EMR(**updated_emr)
                final_emr = validated.model_dump()
                print("\n✅ EMR updated. Doctor can review again.")

            except ValidationError as e:
                print("\n❌ Validation error:", e)
        else:
            print("Please enter yes or no.")


    # ----------------------------
# LOAD LATEST TRANSCRIPT FROM STAGE 1
# ----------------------------

def load_latest_transcript(transcript_folder):

    files = [
        f for f in os.listdir(transcript_folder)
        if f.startswith("transcript_") and f.endswith(".json")
    ]

    if not files:
        raise FileNotFoundError("No transcript files found in outputs folder.")

    # Get most recent file
    files.sort(reverse=True)
    latest_file = files[0]

    full_path = os.path.join(transcript_folder, latest_file)

    print(f"\n📄 Loading transcript: {latest_file}")

    with open(full_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data.get("plain_text", "")



# ----------------------------
# RUN
# ----------------------------

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    transcript_folder = os.path.join(base_dir, "outputs")

    conversation = load_latest_transcript(transcript_folder)  # ✅ pass folder

    if not conversation.strip():
        raise ValueError("Transcript is empty.")

    final_emr = process_pipeline(conversation)
    ...
