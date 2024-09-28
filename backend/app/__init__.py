from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Initialize SQLAlchemy
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    CORS(app)

    load_dotenv()

    app.config.from_object('app.config.Config')

    db.init_app(app)

    from .routes.user_routes import user_bp
    from .routes.flood_alerts_routes import shelter_bp

    app.register_blueprint(shelter_bp, url_prefix='/api/alerts')
    app.register_blueprint(user_bp, url_prefix='/api/users')

    return app
