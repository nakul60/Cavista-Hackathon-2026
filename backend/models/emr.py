from __init__ import db
from datetime import datetime

class EMR(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Patient info
    patient_name = db.Column(db.String(100))
    patient_age = db.Column(db.Integer)
    patient_gender = db.Column(db.String(20))
    patient_occupation = db.Column(db.String(100))
    # Visit info
    visit_date = db.Column(db.String(20))
    visit_type = db.Column(db.String(100))
    # Chief complaint
    chief_complaint = db.Column(db.String(255))
    # History of present illness
    hpi_duration = db.Column(db.String(50))
    hpi_location = db.Column(db.String(100))
    hpi_severity_out_of_10 = db.Column(db.Integer)
    hpi_character = db.Column(db.String(100))
    hpi_aggravating_factors = db.Column(db.String(255))  # Comma-separated
    hpi_relieving_factors = db.Column(db.String(255))    # Comma-separated
    hpi_medications_tried = db.Column(db.String(255))    # Comma-separated
    # Review of systems (store as comma-separated for now)
    ros_constitutional = db.Column(db.String(255))
    ros_neurological = db.Column(db.String(255))
    ros_cardiovascular = db.Column(db.String(255))
    ros_respiratory = db.Column(db.String(255))
    ros_gastrointestinal = db.Column(db.String(255))
    ros_musculoskeletal = db.Column(db.String(255))
    ros_sleep = db.Column(db.String(100))
    ros_other = db.Column(db.String(255))
    # Past medical history
    pmh_conditions = db.Column(db.String(255))
    pmh_surgeries = db.Column(db.String(255))
    pmh_hospitalizations = db.Column(db.String(255))
    # Family history (as text for now)
    family_history = db.Column(db.Text)
    # Social history
    social_occupation = db.Column(db.String(100))
    social_stress_level = db.Column(db.String(100))
    social_smoking = db.Column(db.String(50))
    social_alcohol = db.Column(db.String(50))
    social_exercise = db.Column(db.String(100))
    social_diet = db.Column(db.String(100))
    social_recent_life_changes = db.Column(db.String(255))
    # Current medications, allergies (comma-separated)
    current_medications = db.Column(db.String(255))
    allergies = db.Column(db.String(255))
    # Provisional diagnosis, AI confidence, fields not mentioned
    provisional_diagnosis = db.Column(db.String(255))
    ai_confidence = db.Column(db.Float)
    fields_not_mentioned = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<EMR {self.id}>'
