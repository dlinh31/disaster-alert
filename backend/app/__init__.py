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

    # Load environment variables from .env
    load_dotenv()

    # Configure the app
    app.config.from_object('app.config.Config')

    # Initialize SQLAlchemy with the app
    db.init_app(app)

    # Register routes (blueprints)
    from .routes import main
    app.register_blueprint(main)

    return app
