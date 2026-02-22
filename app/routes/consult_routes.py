from flask import Blueprint, render_template, session, redirect, url_for

consult_bp = Blueprint('consult', __name__)

@consult_bp.route('/consult_choice', methods=['GET', 'POST'])
def consult_choice():
    # Only allow access if logged in
    if not session.get('user_id'):
        return redirect(url_for('auth.login'))
    return render_template('consult_choice.html')

@consult_bp.route('/consult_choice/consult_text')
def consult_text():
    if not session.get('user_id'):
        return redirect(url_for('auth.login'))
    return render_template('consult_text.html')

@consult_bp.route('/consult_choice/consult_audio')
def consult_audio():
    if not session.get('user_id'):
        return redirect(url_for('auth.login'))
    return render_template('consult_audio.html')