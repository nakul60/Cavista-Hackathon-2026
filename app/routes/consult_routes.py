from flask import Blueprint, render_template, session, redirect, url_for, request

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
        answers = []
        for i in range(1, 6):
            answers.append(request.form.get(f'q{i}', ''))
        audio_file = request.files.get('audio_file')
        # Here you would process/save answers and audio_file as needed
        # For now, just show a success message
        return render_template('consult_text.html', success=True)
    return render_template('consult_text.html')

@consult_bp.route('/consult_choice/consult_audio')
def consult_audio():
    if not session.get('user_id'):
        return redirect(url_for('auth.login'))
    return render_template('consult_audio.html')