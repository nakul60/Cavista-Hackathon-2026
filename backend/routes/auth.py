from flask import Blueprint, render_template_string, redirect, url_for, request, session
from backend import db
from backend.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

# Landing page
@auth_bp.route('/', methods=['GET'])
def landing():
    return redirect(url_for('auth.landing_page'))

# Landing page HTML
@auth_bp.route('/landing', methods=['GET'])
def landing_page():
    landing_html = """
    <html>
    <head>
        <title>Smart EMR Assistant - Landing Page</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { background: white; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); padding: 50px; text-align: center; max-width: 600px; }
            h1 { color: #333; font-size: 40px; margin-bottom: 20px; }
            p { color: #666; font-size: 18px; margin-bottom: 30px; line-height: 1.6; }
            .features { text-align: left; margin: 40px 0; }
            .features li { color: #555; margin: 10px 0; font-size: 16px; }
            .button-group { display: flex; gap: 15px; margin-top: 30px; justify-content: center; }
            a { padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; transition: all 0.3s; }
            .btn-login { background-color: #667eea; color: white; }
            .btn-login:hover { background-color: #5568d3; }
            .btn-register { background-color: #764ba2; color: white; }
            .btn-register:hover { background-color: #663a91; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏥 Smart EMR Assistant</h1>
            <p>Your intelligent Electronic Medical Records and Diagnostic Assistant</p>
            <ul class="features">
                <li>✓ Audio-based consultation recording</li>
                <li>✓ Automatic EMR data extraction</li>
                <li>✓ ICD code mapping</li>
                <li>✓ AI-powered diagnosis suggestions</li>
                <li>✓ Professional report generation</li>
            </ul>
            <div class="button-group">
                <a href="/auth/login" class="btn-login">Login</a>
                <a href="/auth/register" class="btn-register">Register</a>
            </div>
        </div>
    </body>
    </html>
    """
    return landing_html

# Register route
@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == "POST":
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        phone_number = request.form.get('phone_number')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        role = request.form.get('role', 'patient')
        
        # Validation
        if not all([full_name, email, phone_number, password, confirm_password]):
            error_message = "All fields are required!"
        elif len(password) < 6:
            error_message = "Password must be at least 6 characters long!"
        elif password != confirm_password:
            error_message = "Passwords do not match. Please try again!"
        elif User.query.filter_by(email=email).first():
            error_message = "Email already exists. Please use a different email!"
        else:
            error_message = None
        
        if error_message:
            register_html = f"""
            <html>
            <head>
                <title>Register - Smart EMR Assistant</title>
                <style>
                    body {{ font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }}
                    .container {{ background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; width: 100%; }}
                    h1 {{ color: #333; margin-bottom: 30px; }}
                    .form-group {{ margin-bottom: 20px; }}
                    label {{ display: block; margin-bottom: 8px; color: #555; font-weight: bold; }}
                    input, select {{ width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }}
                    input:focus, select:focus {{ outline: none; border-color: #667eea; }}
                    button {{ width: 100%; padding: 12px; background-color: #764ba2; color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer; }}
                    button:hover {{ background-color: #663a91; }}
                    .error {{ color: #dc3545; background-color: #f8d7da; padding: 12px; border-radius: 5px; margin-bottom: 20px; }}
                    .link {{ text-align: center; margin-top: 20px; }}
                    .link a {{ color: #667eea; text-decoration: none; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Register</h1>
                    <div class="error">❌ {error_message}</div>
                    <form method="POST">
                        <div class="form-group">
                            <label for="full_name">Full Name:</label>
                            <input type="text" id="full_name" name="full_name" required value="{full_name}">
                        </div>
                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required value="{email}">
                        </div>
                        <div class="form-group">
                            <label for="phone_number">Phone Number:</label>
                            <input type="tel" id="phone_number" name="phone_number" required value="{phone_number}">
                        </div>
                        <div class="form-group">
                            <label for="role">Role:</label>
                            <select id="role" name="role">
                                <option value="patient" {"selected" if role == "patient" else ""}>Patient</option>
                                <option value="doctor" {"selected" if role == "doctor" else ""}>Doctor</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="password">Password:</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <div class="form-group">
                            <label for="confirm_password">Confirm Password:</label>
                            <input type="password" id="confirm_password" name="confirm_password" required>
                        </div>
                        <button type="submit">Register</button>
                    </form>
                    <div class="link">
                        Already have an account? <a href="/auth/login">Login here</a>
                    </div>
                </div>
            </body>
            </html>
            """
            return register_html
        
        # Create new user with hashed password
        hashed_password = generate_password_hash(password)
        new_user = User(full_name=full_name, email=email, phone_number=phone_number, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()
        
        success_html = """
        <html>
        <head>
            <title>Registration Successful</title>
            <style>
                body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
                .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 500px; }
                h1 { color: #28a745; }
                p { color: #666; margin: 20px 0; }
                a { display: inline-block; margin-top: 20px; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>✓ Registration Successful!</h1>
                <p>Your account has been created successfully.</p>
                <p>Please log in to continue.</p>
                <a href="/auth/login">Login here</a>
            </div>
        </body>
        </html>
        """
        return success_html
    
    # GET request - show registration form
    register_html = """
    <html>
    <head>
        <title>Register - Smart EMR Assistant</title>
        <style>
            body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; width: 100%; }
            h1 { color: #333; margin-bottom: 30px; }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 8px; color: #555; font-weight: bold; }
            input, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
            input:focus, select:focus { outline: none; border-color: #667eea; }
            button { width: 100%; padding: 12px; background-color: #764ba2; color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer; }
            button:hover { background-color: #663a91; }
            .link { text-align: center; margin-top: 20px; }
            .link a { color: #667eea; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Register</h1>
            <form method="POST">
                <div class="form-group">
                    <label for="full_name">Full Name:</label>
                    <input type="text" id="full_name" name="full_name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="phone_number">Phone Number:</label>
                    <input type="tel" id="phone_number" name="phone_number" required>
                </div>
                <div class="form-group">
                    <label for="role">Role:</label>
                    <select id="role" name="role">
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="confirm_password">Confirm Password:</label>
                    <input type="password" id="confirm_password" name="confirm_password" required>
                </div>
                <button type="submit">Register</button>
            </form>
            <div class="link">
                Already have an account? <a href="/auth/login">Login here</a>
            </div>
        </div>
    </body>
    </html>
    """
    return register_html

# Login route
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Validation
        if not email or not password:
            error_message = "Email and password are required!"
        else:
            user = User.query.filter_by(email=email).first()
            if user and check_password_hash(user.password, password):
                session['user_id'] = user.id
                session['user_email'] = user.email
                session['user_role'] = user.role
                session['user_name'] = user.full_name
                success_html = f"""
                <html>
                <head>
                    <title>Login Successful</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }}
                        .container {{ background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 500px; }}
                        h1 {{ color: #28a745; }}
                        p {{ color: #666; margin: 20px 0; }}
                        a {{ display: inline-block; margin-top: 20px; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>✓ Login Successful!</h1>
                        <p>Welcome, {user.full_name}!</p>
                        <p>You are logged in as: {user.role}</p>
                        <a href="/api/emr/store">Go to Dashboard</a>
                    </div>
                </body>
                </html>
                """
                return success_html
            else:
                error_message = "Invalid Email or Password. Please try again!"
        
        login_html = f"""
        <html>
        <head>
            <title>Login - Smart EMR Assistant</title>
            <style>
                body {{ font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }}
                .container {{ background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; width: 100%; }}
                h1 {{ color: #333; margin-bottom: 30px; }}
                .form-group {{ margin-bottom: 20px; }}
                label {{ display: block; margin-bottom: 8px; color: #555; font-weight: bold; }}
                input {{ width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }}
                input:focus {{ outline: none; border-color: #667eea; }}
                button {{ width: 100%; padding: 12px; background-color: #667eea; color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer; }}
                button:hover {{ background-color: #5568d3; }}
                .error {{ color: #dc3545; background-color: #f8d7da; padding: 12px; border-radius: 5px; margin-bottom: 20px; }}
                .link {{ text-align: center; margin-top: 20px; }}
                .link a {{ color: #667eea; text-decoration: none; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Login</h1>
                <div class="error">❌ {error_message}</div>
                <form method="POST">
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required value="{email}">
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit">Login</button>
                </form>
                <div class="link">
                    Don't have an account? <a href="/auth/register">Register here</a>
                </div>
            </div>
        </body>
        </html>
        """
        return login_html
    
    # GET request - show login form
    login_html = """
    <html>
    <head>
        <title>Login - Smart EMR Assistant</title>
        <style>
            body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 500px; width: 100%; }
            h1 { color: #333; margin-bottom: 30px; }
            .form-group { margin-bottom: 20px; }
            label { display: block; margin-bottom: 8px; color: #555; font-weight: bold; }
            input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
            input:focus { outline: none; border-color: #667eea; }
            button { width: 100%; padding: 12px; background-color: #667eea; color: white; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer; }
            button:hover { background-color: #5568d3; }
            .link { text-align: center; margin-top: 20px; }
            .link a { color: #667eea; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Login</h1>
            <form method="POST">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit">Login</button>
            </form>
            <div class="link">
                Don't have an account? <a href="/auth/register">Register here</a>
            </div>
        </div>
    </body>
    </html>
    """
    return login_html

# Logout route
@auth_bp.route('/logout', methods=['GET', 'POST'])
def logout():
    session.clear()
    logout_html = """
    <html>
    <head>
        <title>Logged Out</title>
        <style>
            body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); text-align: center; max-width: 500px; }
            h1 { color: #667eea; }
            p { color: #666; margin: 20px 0; }
            a { display: inline-block; margin-top: 20px; padding: 12px 30px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>You have been logged out</h1>
            <p>Thank you for using Smart EMR Assistant!</p>
            <a href="/auth/">Go to Home</a>
        </div>
    </body>
    </html>
    """
    return logout_html
