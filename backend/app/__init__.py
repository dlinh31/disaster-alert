from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Load environment variables
    load_dotenv()

    # Import routes and register blueprints
    from .routes import main
    app.register_blueprint(main)

    return app
