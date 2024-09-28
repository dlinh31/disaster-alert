from flask import Blueprint, jsonify, request
from .config import Config
from . import db
from app.models import User


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


@main.route('/api/get-users', methods=['GET'])
def get_users():
    try:
        # Fetch all users from the database
        users = User.query.all()
        users_list = [{"id": user.id, "name": user.name,
                       "email": user.email} for user in users]
        return jsonify(users_list), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@main.route('/api/add-user', methods=['POST'])
def add_user():
    try:
        data = request.json

        name = data.get('name')
        email = data.get('email')

        if not name or not email:
            return jsonify({"error": "Name and email are required"}), 400

        new_user = User(name=name, email=email)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User added successfully", "user": {"name": name, "email": email}}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
