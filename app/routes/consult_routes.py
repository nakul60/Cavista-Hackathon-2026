from flask import Blueprint, render_template, session, redirect, url_for, request
from extraction_summarization import process_pipeline, generate_summary_from_transcript, generate_emr_from_summary
from speech_text import transcribe_audio
import tempfile
import os
import json

consult_bp = Blueprint('consult', __name__)

@consult_bp.route('/consult_choice', methods=['GET', 'POST'])
def consult_choice():
    # Only allow access if logged in
    if not session.get('user_id'):
        return redirect(url_for('auth.login'))
    return render_template('consult_choice.html')

@consult_bp.route('/consult_choice/consult_text', methods=['GET', 'POST'])
def consult_text():
    if not session.get('user_id'):
        return redirect(url_for('auth.login'))
    if session.get('user_role') != 'patient':
        return redirect(url_for('consult.consult_choice'))
    if request.method == 'POST':
        audio_file = request.files.get('audio_file')
        if audio_file:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp:
                audio_file.save(tmp.name)
                tmp_path = tmp.name
            try:
                transcript_json_path = transcribe_audio(tmp_path)
                # transcribe_audio returns a file path to the JSON; load the plain_text from it
                with open(transcript_json_path, 'r', encoding='utf-8') as f:
                    transcript_data = json.load(f)
                transcript = transcript_data.get('plain_text', '')
                summary = generate_summary_from_transcript(transcript)
                emr_json = generate_emr_from_summary(summary)
            finally:
                os.remove(tmp_path)
            # Store in session to avoid URL length limits
            session['emr_summary'] = summary
            session['emr_json'] = json.dumps(emr_json)
            return redirect(url_for('consult.emr_review'))
        else:
            return render_template('consult_text.html', error="No audio file uploaded.")
    return render_template('consult_text.html')

@consult_bp.route('/consult_choice/consult_audio', methods=['GET', 'POST'])
def consult_audio():
    if not session.get('user_id'):
        return redirect(url_for('auth.login'))
    if request.method == 'POST':
        audio_file = request.files.get('audio')  # Match input name in consult_audio.html
        if audio_file:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp:
                audio_file.save(tmp.name)
                tmp_path = tmp.name
            try:
                transcript_json_path = transcribe_audio(tmp_path)
                # transcribe_audio returns a file path to the JSON; load the plain_text from it
                with open(transcript_json_path, 'r', encoding='utf-8') as f:
                    transcript_data = json.load(f)
                transcript = transcript_data.get('plain_text', '')
                summary = generate_summary_from_transcript(transcript)
                emr_json = generate_emr_from_summary(summary)
            finally:
                os.remove(tmp_path)
            # Store in session to avoid URL length limits
            session['emr_summary'] = summary
            session['emr_json'] = json.dumps(emr_json)
            return redirect(url_for('consult.emr_review'))
        else:
            return render_template('consult_audio.html', error="No audio file uploaded.")
    return render_template('consult_audio.html')

@consult_bp.route('/consult_choice/emr_review', methods=['GET', 'POST'])
def emr_review():
    from extraction_summarization import llama_chat
    import requests

    def _ensure_dict(val):
        """Parse val into a dict if it's a JSON string; return as-is if already dict."""
        if val is None:
            return {}
        if isinstance(val, dict):
            return val
        if isinstance(val, str):
            try:
                parsed = json.loads(val)
                if isinstance(parsed, dict):
                    return parsed
                if isinstance(parsed, str):
                    return json.loads(parsed)
            except (json.JSONDecodeError, TypeError):
                pass
        return {}

    if request.method == 'POST':
        summary = request.form.get('summary', '')
        emr_json_raw = request.form.get('emr_json', '')
        decision = request.form.get('decision', '')
        correction = request.form.get('correction', '')

        emr_dict = _ensure_dict(emr_json_raw)

        if decision == 'yes':
            # Store in DB via emr_routes — POST the dict as JSON
            api_url = url_for('emr.store_and_display_emr', _external=True)
            resp = requests.post(api_url, json=emr_dict)
            # Clear session data after successful store
            session.pop('emr_summary', None)
            session.pop('emr_json', None)
            return resp.text, resp.status_code
        elif decision == 'correction' and correction:
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
            new_summary = llama_chat(refinement_prompt, temperature=0.2)
            new_emr_dict = generate_emr_from_summary(new_summary)
            return render_template('emr_review.html', summary=new_summary, emr_json=json.dumps(new_emr_dict))
        else:
            return render_template('emr_review.html', summary=summary, emr_json=json.dumps(emr_dict), error="Please approve or correct the EMR.")

    # GET: load summary/EMR from session (set during audio upload)
    summary = session.get('emr_summary', '')
    emr_json_raw = session.get('emr_json', '')
    emr_dict = _ensure_dict(emr_json_raw)
    if not summary and not emr_dict:
        return redirect(url_for('consult.consult_choice'))
    return render_template('emr_review.html', summary=summary, emr_json=json.dumps(emr_dict))