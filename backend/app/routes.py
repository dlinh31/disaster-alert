from flask import Blueprint, jsonify
from .config import Config


main = Blueprint('main', __name__)


@main.route('/')
def index():
    return "Backend is running"


@main.route('/api/get-api-key', methods=['GET'])
def get_api_key():
    if Config.GOOGLE_API_KEY:  # Check if the key is available
        return jsonify({"googleMapsApiKey": Config.GOOGLE_API_KEY})
    else:
        return jsonify({"error": "API key not found"}), 500
