from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# This db object will be imported by models and used in app factory

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'my-secret-key'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

    # Enable CORS for React frontend
    CORS(app, resources={
        r"/auth/*": {"origins": ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"]},
        r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"]}
    })

    # Database linking
    db.init_app(app)

    # Blueprints
    from routes.emr_routes import emr_bp
    from routes.auth import auth_bp
    app.register_blueprint(emr_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app
