from flask import Blueprint, request, session, jsonify
from __init__ import db
from models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

# ===== JSON API ENDPOINTS FOR REACT FRONTEND =====

# POST /auth/api/register
@auth_bp.route('/api/register', methods=['POST'])
def api_register():
    """
    Register a new user
    
    Expected JSON:
    {
        "full_name": "John Doe",
        "email": "john@example.com",
        "password": "password123",
        "phone_number": "1234567890",
        "role": "patient" or "doctor"
    }
    
    Response Success (201):
    {
        "success": true,
        "message": "Registration successful",
        "user_id": 1,
        "full_name": "John Doe",
        "email": "john@example.com",
        "role": "patient"
    }
    
    Response Error (400/409/500):
    {
        "success": false,
        "message": "Error description"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'Request body must be JSON'
            }), 400
        
        # Extract and validate fields
        full_name = data.get('full_name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        phone_number = data.get('phone_number', '').strip()
        role = data.get('role', 'patient').lower()
        
        # Validate required fields
        if not all([full_name, email, password, phone_number, role]):
            return jsonify({
                'success': False,
                'message': 'Missing required fields: full_name, email, password, phone_number, role'
            }), 400
        
        # Validate email format
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'message': 'Invalid email format'
            }), 400
        
        # Validate password length
        if len(password) < 6:
            return jsonify({
                'success': False,
                'message': 'Password must be at least 6 characters long'
            }), 400
        
        # Validate role
        if role not in ['patient', 'doctor']:
            return jsonify({
                'success': False,
                'message': 'Invalid role. Must be "patient" or "doctor"'
            }), 400
        
        # Check if email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'Email already registered. Please login or use a different email.'
            }), 409
        
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
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user_id': new_user.id,
            'full_name': new_user.full_name,
            'email': new_user.email,
            'role': new_user.role
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f'✗ Registration error: {str(e)}')
        return jsonify({
            'success': False,
            'message': f'Registration failed: {str(e)}'
        }), 500


# POST /auth/api/login
@auth_bp.route('/api/login', methods=['POST'])
def api_login():
    """
    Login user and create session
    
    Expected JSON:
    {
        "email": "john@example.com",
        "password": "password123"
    }
    
    Response Success (200):
    {
        "success": true,
        "message": "Login successful",
        "user_id": 1,
        "full_name": "John Doe",
        "email": "john@example.com",
        "role": "patient"
    }
    
    Response Error (400/401/500):
    {
        "success": false,
        "message": "Error description"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'Request body must be JSON'
            }), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validate required fields
        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        # Verify credentials
        if not user or not check_password_hash(user.password, password):
            print(f'✗ Login failed for email: {email}')
            return jsonify({
                'success': False,
                'message': 'Invalid email or password'
            }), 401
        
        # Create session
        session['user_id'] = user.id
        session['user_email'] = user.email
        session['user_role'] = user.role
        session['user_name'] = user.full_name
        session.permanent = True
        
        print(f'✓ User logged in: {user.email} ({user.role})')
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user_id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'role': user.role
        }), 200
        
    except Exception as e:
        print(f'✗ Login error: {str(e)}')
        return jsonify({
            'success': False,
            'message': f'Login failed: {str(e)}'
        }), 500


# POST /auth/api/logout
@auth_bp.route('/api/logout', methods=['POST'])
def api_logout():
    """
    Logout user and clear session
    
    Response (200):
    {
        "success": true,
        "message": "Logout successful"
    }
    """
    try:
        user_email = session.get('user_email', 'Unknown')
        session.clear()
        
        print(f'✓ User logged out: {user_email}')
        
        return jsonify({
            'success': True,
            'message': 'Logout successful'
        }), 200
        
    except Exception as e:
        print(f'✗ Logout error: {str(e)}')
        return jsonify({
            'success': False,
            'message': f'Logout failed: {str(e)}'
        }), 500


# GET /auth/api/me
@auth_bp.route('/api/me', methods=['GET'])
def api_me():
    """
    Get current logged-in user information
    
    Response Success (200):
    {
        "success": true,
        "user_id": 1,
        "full_name": "John Doe",
        "email": "john@example.com",
        "role": "patient",
        "created_at": "2026-02-21T10:30:00"
    }
    
    Response Error (401):
    {
        "success": false,
        "message": "Not logged in"
    }
    """
    try:
        user_id = session.get('user_id')
        
        # Check if user is logged in
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'Not logged in'
            }), 401
        
        # Get user from database
        user = User.query.get(user_id)
        
        if not user:
            session.clear()  # Clear invalid session
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'user_id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'role': user.role,
            'phone_number': user.phone_number,
            'created_at': user.created_at.isoformat() if user.created_at else None
        }), 200
        
    except Exception as e:
        print(f'✗ Error getting user info: {str(e)}')
        return jsonify({
            'success': False,
            'message': f'Failed to get user: {str(e)}'
        }), 500