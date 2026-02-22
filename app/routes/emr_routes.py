from flask import Blueprint, request, jsonify, current_app, render_template_string, render_template, session, redirect, url_for, flash
import json
import os
from app.models.emr import EMR
from app import db

emr_bp = Blueprint('emr', __name__)

@emr_bp.route('/api/emr/store', methods=['POST'])
def store_and_display_emr():
    # Store EMR data from POSTed JSON into DB and display it
    if request.method == 'POST':
        emr_data = request.get_json(force=True)
        if not emr_data:
            return 'Error: No EMR data provided', 400
        # Handle double-serialized JSON (string inside JSON)
        if isinstance(emr_data, str):
            try:
                emr_data = json.loads(emr_data)
            except (json.JSONDecodeError, TypeError):
                return 'Error: Invalid EMR data format', 400
        if not isinstance(emr_data, dict):
            return 'Error: EMR data must be a JSON object', 400

        # Helper to safely join list fields (handles None, non-list values)
        def safe_join(val):
            if val is None:
                return ''
            if isinstance(val, list):
                return ','.join(str(v) for v in val)
            return str(val)

        # Helper to safely get nested dict value
        def safe_get(d, *keys, default=None):
            current = d
            for key in keys:
                if isinstance(current, dict):
                    current = current.get(key, default)
                else:
                    return default
            return current

        # Parse ai_confidence safely (could be string, int, float, or None)
        raw_confidence = emr_data.get('ai_confidence')
        try:
            ai_confidence_val = float(raw_confidence) if raw_confidence is not None else None
        except (ValueError, TypeError):
            ai_confidence_val = None

        emr = EMR(
            # Patient info
            patient_name=safe_get(emr_data, 'patient', 'name'),
            patient_age=safe_get(emr_data, 'patient', 'age'),
            patient_gender=safe_get(emr_data, 'patient', 'gender'),
            patient_occupation=safe_get(emr_data, 'patient', 'occupation'),
            # Visit info
            visit_date=safe_get(emr_data, 'visit', 'date'),
            visit_type=safe_get(emr_data, 'visit', 'type'),
            # Chief complaint
            chief_complaint=emr_data.get('chief_complaint'),
            # History of present illness
            hpi_duration=safe_get(emr_data, 'history_of_present_illness', 'duration'),
            hpi_location=safe_get(emr_data, 'history_of_present_illness', 'location'),
            hpi_severity_out_of_10=safe_get(emr_data, 'history_of_present_illness', 'severity_out_of_10'),
            hpi_character=safe_get(emr_data, 'history_of_present_illness', 'character'),
            hpi_aggravating_factors=safe_join(safe_get(emr_data, 'history_of_present_illness', 'aggravating_factors', default=[])),
            hpi_relieving_factors=safe_join(safe_get(emr_data, 'history_of_present_illness', 'relieving_factors', default=[])),
            hpi_medications_tried=safe_join(safe_get(emr_data, 'history_of_present_illness', 'medications_tried', default=[])),
            # Review of systems
            ros_constitutional=safe_join(safe_get(emr_data, 'review_of_systems', 'constitutional', default=[])),
            ros_neurological=safe_join(safe_get(emr_data, 'review_of_systems', 'neurological', default=[])),
            ros_cardiovascular=safe_join(safe_get(emr_data, 'review_of_systems', 'cardiovascular', default=[])),
            ros_respiratory=safe_join(safe_get(emr_data, 'review_of_systems', 'respiratory', default=[])),
            ros_gastrointestinal=safe_join(safe_get(emr_data, 'review_of_systems', 'gastrointestinal', default=[])),
            ros_musculoskeletal=safe_join(safe_get(emr_data, 'review_of_systems', 'musculoskeletal', default=[])),
            ros_sleep=safe_get(emr_data, 'review_of_systems', 'sleep'),
            ros_other=safe_join(safe_get(emr_data, 'review_of_systems', 'other', default=[])),
            # Past medical history
            pmh_conditions=safe_join(safe_get(emr_data, 'past_medical_history', 'conditions', default=[])),
            pmh_surgeries=safe_join(safe_get(emr_data, 'past_medical_history', 'surgeries', default=[])),
            pmh_hospitalizations=safe_join(safe_get(emr_data, 'past_medical_history', 'hospitalizations', default=[])),
            # Family history
            family_history=json.dumps(emr_data.get('family_history', {})),
            # Social history
            social_occupation=safe_get(emr_data, 'social_history', 'occupation'),
            social_stress_level=safe_get(emr_data, 'social_history', 'stress_level'),
            social_smoking=safe_get(emr_data, 'social_history', 'smoking'),
            social_alcohol=safe_get(emr_data, 'social_history', 'alcohol'),
            social_exercise=safe_get(emr_data, 'social_history', 'exercise'),
            social_diet=safe_get(emr_data, 'social_history', 'diet'),
            social_recent_life_changes=safe_get(emr_data, 'social_history', 'recent_life_changes'),
            # Current medications and allergies
            current_medications=safe_join(emr_data.get('current_medications', [])),
            allergies=safe_join(emr_data.get('allergies', [])),
            # Provisional diagnosis and AI confidence
            provisional_diagnosis=emr_data.get('provisional_diagnosis'),
            ai_confidence=ai_confidence_val,
            fields_not_mentioned=safe_join(emr_data.get('fields_not_mentioned', []))
        )
        db.session.add(emr)
        db.session.commit()
        
        ai_confidence_display = "N/A"
        if emr.ai_confidence is not None:
            try:
                ai_confidence_display = f"{float(emr.ai_confidence) * 100:.1f}%"
            except (ValueError, TypeError):
                ai_confidence_display = "N/A"
        # Return HTML to display in browser
        html = f"""
        <html>
        <head>
            <title>EMR Record - Smart EMR Assistant</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }}
                .container {{ background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }}
                h1 {{ color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }}
                .section {{ margin: 20px 0; }}
                .section h2 {{ color: #007bff; font-size: 18px; margin-bottom: 10px; }}
                .field {{ display: flex; padding: 8px 0; border-bottom: 1px solid #eee; }}
                .label {{ font-weight: bold; width: 200px; color: #555; }}
                .value {{ flex: 1; color: #333; }}
                .success {{ color: #28a745; font-size: 16px; margin-bottom: 20px; }}
                .badge {{ background-color: #007bff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📋 EMR Record Successfully Stored</h1>
                <p class="success">✓ EMR stored in DB with ID: <span class="badge">{emr.id}</span></p>
                
                <div class="section">
                    <h2>👤 Patient Information</h2>
                    <div class="field">
                        <div class="label">Name:</div>
                        <div class="value">{emr.patient_name}</div>
                    </div>
                    <div class="field">
                        <div class="label">Age:</div>
                        <div class="value">{emr.patient_age} years</div>
                    </div>
                    <div class="field">
                        <div class="label">Gender:</div>
                        <div class="value">{emr.patient_gender}</div>
                    </div>
                    <div class="field">
                        <div class="label">Occupation:</div>
                        <div class="value">{emr.patient_occupation}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>🏥 Visit Details</h2>
                    <div class="field">
                        <div class="label">Date:</div>
                        <div class="value">{emr.visit_date}</div>
                    </div>
                    <div class="field">
                        <div class="label">Type:</div>
                        <div class="value">{emr.visit_type}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>⚠️ Chief Complaint</h2>
                    <div class="field">
                        <div class="value"><strong>{emr.chief_complaint}</strong></div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>📝 History of Present Illness</h2>
                    <div class="field">
                        <div class="label">Duration:</div>
                        <div class="value">{emr.hpi_duration}</div>
                    </div>
                    <div class="field">
                        <div class="label">Severity:</div>
                        <div class="value">{emr.hpi_severity_out_of_10}/10</div>
                    </div>
                    <div class="field">
                        <div class="label">Character:</div>
                        <div class="value">{emr.hpi_character}</div>
                    </div>
                    <div class="field">
                        <div class="label">Aggravating Factors:</div>
                        <div class="value">{emr.hpi_aggravating_factors if emr.hpi_aggravating_factors else 'Not specified'}</div>
                    </div>
                    <div class="field">
                        <div class="label">Relieving Factors:</div>
                        <div class="value">{emr.hpi_relieving_factors if emr.hpi_relieving_factors else 'Not specified'}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>🔍 Review of Systems</h2>
                    <div class="field">
                        <div class="label">Respiratory:</div>
                        <div class="value">{emr.ros_respiratory if emr.ros_respiratory else 'Not specified'}</div>
                    </div>
                    <div class="field">
                        <div class="label">Constitutional:</div>
                        <div class="value">{emr.ros_constitutional if emr.ros_constitutional else 'Not specified'}</div>
                    </div>
                    <div class="field">
                        <div class="label">Sleep:</div>
                        <div class="value">{emr.ros_sleep if emr.ros_sleep else 'Not specified'}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>💊 Medications & Allergies</h2>
                    <div class="field">
                        <div class="label">Current Medications:</div>
                        <div class="value">{emr.current_medications if emr.current_medications else 'None'}</div>
                    </div>
                    <div class="field">
                        <div class="label">Allergies:</div>
                        <div class="value">{emr.allergies if emr.allergies else 'None'}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>🩺 Diagnosis & Assessment</h2>
                    <div class="field">
                        <div class="label">Provisional Diagnosis:</div>
                        <div class="value"><strong>{emr.provisional_diagnosis}</strong></div>
                    </div>
                    <div class="field">
                        <div class="label">AI Confidence:</div>
                        <div class="value"><span class="badge">{ai_confidence_display}</span></div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        return html
