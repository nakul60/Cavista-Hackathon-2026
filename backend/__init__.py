from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# This db object will be imported by models and used in app factory

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'my-secret-key'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

    # Database linking
    db.init_app(app)

    # Blueprints
    from backend.routes.emr_routes import emr_bp
    from backend.routes.auth import auth_bp
    app.register_blueprint(emr_bp)
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app
