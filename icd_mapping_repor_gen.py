import requests
import json
import re
from datetime import datetime
from typing import Dict, Any

# =================================
# CONFIG
# =================================

NIH_ICD_API = "https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search"
OPENFDA_API = "https://api.fda.gov/drug/label.json"

LOCAL_ICD_FALLBACK = {
    "hypertension": ("I10", "Essential (primary) hypertension"),
    "high blood pressure": ("I10", "Essential (primary) hypertension"),
    "diabetes": ("E11", "Type 2 diabetes mellitus"),
    "asthma": ("J45", "Asthma"),
    "fever": ("R50", "Fever, unspecified"),
    "headache": ("R51", "Headache"),
}

EVIDENCE_BASED_DRUGS = {
    "I10": ["Amlodipine", "Losartan", "Hydrochlorothiazide"],
    "E11": ["Metformin"],
    "J45": ["Salbutamol", "Budesonide"],
    "R50": ["Paracetamol"],
    "R51": ["Paracetamol", "Ibuprofen"],
}


# =================================
# HELPER: Flatten EMR Safely
# =================================

def flatten_emr_text(emr: Dict[str, Any]) -> str:
    collected = []

    def recursive_extract(value):
        if value is None:
            return
        if isinstance(value, dict):
            for v in value.values():
                recursive_extract(v)
        elif isinstance(value, list):
            for item in value:
                recursive_extract(item)
        else:
            collected.append(str(value))

    recursive_extract(emr)

    text = " ".join(collected)
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)
    return text.lower()


# =================================
# ICD ENGINE
# =================================

class ICDEngine:

    def query_nih(self, query: str):

        if not query.strip():
            return None

        params = {
            "sf": "code,name",
            "terms": query,
            "maxList": 5
        }

        try:
            response = requests.get(NIH_ICD_API, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()

            if len(data) >= 4 and data[3]:
                return {"code": data[3][0][0], "description": data[3][0][1]}

        except:
            pass

        return None

    def keyword_fallback(self, text: str):

        for keyword, (code, desc) in LOCAL_ICD_FALLBACK.items():
            if keyword in text:
                return {"code": code, "description": desc}

        return {"code": "R69", "description": "Illness, unspecified"}

    def get_best_icd(self, emr: Dict[str, Any]):

        flat_text = flatten_emr_text(emr)[:200]

        diagnosis = self.query_nih(flat_text)

        if diagnosis:
            return diagnosis

        return self.keyword_fallback(flat_text)


# =================================
# MEDICATION ENGINE
# =================================

class MedicationEngine:

    def fetch_openfda(self, condition: str):

        params = {
            "search": f'indications_and_usage:"{condition}"',
            "limit": 5
        }

        try:
            response = requests.get(OPENFDA_API, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()

            drugs = set()
            for result in data.get("results", []):
                for name in result.get("openfda", {}).get("generic_name", []):
                    drugs.add(name)

            return list(drugs)

        except:
            return []

    def recommend(self, icd_code: str, emr: Dict[str, Any]):

        # Doctor override
        if emr.get("current_medications"):
            return emr["current_medications"]

        base = EVIDENCE_BASED_DRUGS.get(icd_code[:3], [])

        if base:
            return base

        openfda = self.fetch_openfda(icd_code)

        return openfda[:3] if openfda else ["Consult physician"]


# =================================
# CLINICAL PIPELINE
# =================================

class ClinicalPipeline:

    def __init__(self):
        self.icd_engine = ICDEngine()
        self.med_engine = MedicationEngine()

    def process(self, emr: Dict[str, Any]):

        diagnosis = self.icd_engine.get_best_icd(emr)

        medications = self.med_engine.recommend(
            diagnosis["code"],
            emr
        )

        report = self.generate_report(emr, diagnosis, medications)

        return {
            "ICD_Code": diagnosis["code"],
            "ICD_Description": diagnosis["description"],
            "Recommended_Medications": medications,
            "Patient_Report": report,
            "Generated_At": datetime.now().isoformat()
        }

    def generate_report(self, emr, diagnosis, medications):

        name = emr.get("patient", {}).get("name") or "Patient"

        report = f"""
Medical Summary for {name}

Diagnosis:
{diagnosis['description']} (ICD Code: {diagnosis['code']})

This diagnosis is based on the recorded EMR data.

Recommended Medicines:
"""

        for med in medications:
            report += f"- {med}\n"

        report += "\nPlease consult your physician before starting medication."

        return report.strip()


# =================================
# CONNECT TO YOUR LLaMA OUTPUT
# =================================

def load_emr_from_file(filepath="final_emr_output.json"):

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        raise Exception("EMR file not found. Run extraction pipeline first.")


# =================================
# RUN
# =================================

if __name__ == "__main__":

    # 🔥 THIS IS NOW CONNECTED TO YOUR FIRST PIPELINE
    emr_input = load_emr_from_file("final_emr_output.json")

    pipeline = ClinicalPipeline()
    result = pipeline.process(emr_input)

    print("\n--- CLINICAL INTELLIGENCE OUTPUT ---\n")
    print(json.dumps(result, indent=4))