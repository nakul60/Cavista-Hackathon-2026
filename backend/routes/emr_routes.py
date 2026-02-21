from flask import Blueprint, request, jsonify, current_app, render_template_string
import json
import os
from models.emr import EMR
from __init__ import db

emr_bp = Blueprint('emr', __name__)

@emr_bp.route('/api/emr/store', methods=['GET', 'POST'])
def store_and_display_emr():
    # Store EMR data from emr_output.json into DB and display it
    json_path = os.path.join(current_app.root_path, 'emr_output.json')
    if not os.path.exists(json_path):
        print(f'Error: emr_output.json not found at {json_path}')
        return 'Error: emr_output.json not found', 404
    with open(json_path, 'r') as f:
        emr_data = json.load(f)
    emr = EMR(
        # Patient info
        patient_name=emr_data.get('patient', {}).get('name'),
        patient_age=emr_data.get('patient', {}).get('age'),
        patient_gender=emr_data.get('patient', {}).get('gender'),
        patient_occupation=emr_data.get('patient', {}).get('occupation'),
        # Visit info
        visit_date=emr_data.get('visit', {}).get('date'),
        visit_type=emr_data.get('visit', {}).get('type'),
        # Chief complaint
        chief_complaint=emr_data.get('chief_complaint'),
        # History of present illness
        hpi_duration=emr_data.get('history_of_present_illness', {}).get('duration'),
        hpi_location=emr_data.get('history_of_present_illness', {}).get('location'),
        hpi_severity_out_of_10=emr_data.get('history_of_present_illness', {}).get('severity_out_of_10'),
        hpi_character=emr_data.get('history_of_present_illness', {}).get('character'),
        hpi_aggravating_factors=','.join(emr_data.get('history_of_present_illness', {}).get('aggravating_factors', [])),
        hpi_relieving_factors=','.join(emr_data.get('history_of_present_illness', {}).get('relieving_factors', [])),
        hpi_medications_tried=','.join(emr_data.get('history_of_present_illness', {}).get('medications_tried', [])),
        # Review of systems
        ros_constitutional=','.join(emr_data.get('review_of_systems', {}).get('constitutional', [])),
        ros_neurological=','.join(emr_data.get('review_of_systems', {}).get('neurological', [])),
        ros_cardiovascular=','.join(emr_data.get('review_of_systems', {}).get('cardiovascular', [])),
        ros_respiratory=','.join(emr_data.get('review_of_systems', {}).get('respiratory', [])),
        ros_gastrointestinal=','.join(emr_data.get('review_of_systems', {}).get('gastrointestinal', [])),
        ros_musculoskeletal=','.join(emr_data.get('review_of_systems', {}).get('musculoskeletal', [])),
        ros_sleep=emr_data.get('review_of_systems', {}).get('sleep'),
        ros_other=','.join(emr_data.get('review_of_systems', {}).get('other', [])),
        # Past medical history
        pmh_conditions=','.join(emr_data.get('past_medical_history', {}).get('conditions', [])),
        pmh_surgeries=','.join(emr_data.get('past_medical_history', {}).get('surgeries', [])),
        pmh_hospitalizations=','.join(emr_data.get('past_medical_history', {}).get('hospitalizations', [])),
        # Family history
        family_history=json.dumps(emr_data.get('family_history', {})),
        # Social history
        social_occupation=emr_data.get('social_history', {}).get('occupation'),
        social_stress_level=emr_data.get('social_history', {}).get('stress_level'),
        social_smoking=emr_data.get('social_history', {}).get('smoking'),
        social_alcohol=emr_data.get('social_history', {}).get('alcohol'),
        social_exercise=emr_data.get('social_history', {}).get('exercise'),
        social_diet=emr_data.get('social_history', {}).get('diet'),
        social_recent_life_changes=emr_data.get('social_history', {}).get('recent_life_changes'),
        # Current medications and allergies
        current_medications=','.join(emr_data.get('current_medications', [])),
        allergies=','.join(emr_data.get('allergies', [])),
        # Provisional diagnosis and AI confidence
        provisional_diagnosis=emr_data.get('provisional_diagnosis'),
        ai_confidence=emr_data.get('ai_confidence'),
        fields_not_mentioned=','.join(emr_data.get('fields_not_mentioned', []))
    )
    db.session.add(emr)
    db.session.commit()
    
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
                    <div class="value"><span class="badge">{emr.ai_confidence * 100:.1f}%</span></div>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    return html
