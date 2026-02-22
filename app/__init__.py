from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Creating the global database object
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = 'my-secret-key'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    
    # Link the app with the database
    db.init_app(app)
    
    # Registering blueprints so that the flask knows about the routes
    from app.routes.auth import auth_bp
    from app.routes.emr_routes import emr_bp
    from app.routes.consult_routes import consult_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(emr_bp)
    app.register_blueprint(consult_bp)

    return app