from flask import Blueprint, request, render_template, redirect, url_for, flash, session
from app import db
from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

# ===== HOME PAGE =====
@auth_bp.route('/', methods=['GET'])
def home():
    """Home page"""
    return render_template('home.html')


# ===== SIGNUP/REGISTER ROUTES =====
@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    """User signup/registration"""
    if request.method == 'POST':
        try:
            # Get form data
            full_name = request.form.get('full_name', '').strip()
            email = request.form.get('email', '').strip().lower()
            password = request.form.get('password', '')
            confirm_password = request.form.get('confirm_password', '')
            phone_number = request.form.get('phone_number', '').strip()
            role = request.form.get('role', 'patient').lower()
            
            # Validate required fields
            if not all([full_name, email, password, phone_number, role]):
                flash('❌ All fields are required!', 'danger')
                return redirect(url_for('auth.signup'))
            
            # Validate passwords match
            if password != confirm_password:
                flash('❌ Passwords do not match!', 'danger')
                return redirect(url_for('auth.signup'))
            
            # Validate password length
            if len(password) < 6:
                flash('❌ Password must be at least 6 characters long!', 'danger')
                return redirect(url_for('auth.signup'))
            
            # Validate email format
            if '@' not in email or '.' not in email:
                flash('❌ Invalid email format!', 'danger')
                return redirect(url_for('auth.signup'))
            
            # Validate role
            if role not in ['patient', 'doctor']:
                flash('❌ Invalid role selected!', 'danger')
                return redirect(url_for('auth.signup'))
            
            # Check if email already exists
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                flash('❌ Email already registered! Please login instead.', 'warning')
                return redirect(url_for('auth.login'))
            
            # Create new user with hashed password
            hashed_password = generate_password_hash(password)
            new_user = User(
                full_name=full_name,
                email=email,
                phone_number=phone_number,
                password=hashed_password,
                role=role
            )
            
            db.session.add(new_user)
            db.session.commit()
            
            print(f'✓ New user registered: {new_user.email} ({new_user.role})')
            flash('✅ Registration successful! Please login.', 'success')
            return redirect(url_for('auth.login'))
            
        except Exception as e:
            db.session.rollback()
            print(f'✗ Registration error: {str(e)}')
            flash(f'❌ Registration failed: {str(e)}', 'danger')
            return redirect(url_for('auth.signup'))
    
    return render_template('signup.html')


# ===== LOGIN ROUTES =====
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if request.method == 'POST':
        try:
            email = request.form.get('email', '').strip().lower()
            password = request.form.get('password', '')
            
            # Validate required fields
            if not email or not password:
                flash('❌ Email and password are required!', 'danger')
                return redirect(url_for('auth.login'))
            
            # Find user by email
            user = User.query.filter_by(email=email).first()
            
            # Verify credentials
            if not user or not check_password_hash(user.password, password):
                print(f'✗ Login failed for email: {email}')
                flash('❌ Invalid email or password!', 'danger')
                return redirect(url_for('auth.login'))
            
            # Create session
            session['user_id'] = user.id
            session['user_email'] = user.email
            session['user_role'] = user.role
            session['user_name'] = user.full_name
            session.permanent = True
            
            print(f'✓ User logged in: {user.email} ({user.role})')
            flash(f'✅ Welcome back, {user.full_name}!', 'success')
            
            # Redirect based on role
            if user.role == 'doctor':
                return render_template('dashboard.html', user_name=user.full_name)
            else:
                return render_template('patient_profile.html', user_name=user.full_name)

        except Exception as e:
            print(f'✗ Login error: {str(e)}')
            flash(f'❌ Login failed: {str(e)}', 'danger')
            return redirect(url_for('auth.login'))
    
    return render_template('login.html')

# ===== PATIENT PROFILE =====
@auth_bp.route('/patient_profile', methods=['GET'])
def patient_profile():
    """Patient profile page"""
    if not session.get('user_id') or session.get('user_role') != 'patient':
        return redirect(url_for('auth.login'))
    return render_template('patient_profile.html')

# ===== DOCTOR DASHBOARD =====
@auth_bp.route('/doctor_dashboard', methods=['GET'])
def doctor_dashboard():
    """Doctor dashboard page"""
    if not session.get('user_id') or session.get('user_role') != 'doctor':
        return redirect(url_for('auth.login'))
    return render_template('doctor_dashboard.html')

# ===== LOGOUT ROUTES =====
@auth_bp.route('/logout', methods=['GET', 'POST'])
def logout():
    """User logout"""
    try:
        user_email = session.get('user_email', 'Unknown')
        session.clear()
        print(f'✓ User logged out: {user_email}')
        flash('✅ You have been logged out!', 'info')
        return redirect(url_for('auth.home'))
    except Exception as e:
        print(f'✗ Logout error: {str(e)}')
        flash(f'❌ Logout failed: {str(e)}', 'danger')
        return redirect(url_for('auth.login'))