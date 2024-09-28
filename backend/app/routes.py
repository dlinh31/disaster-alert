from flask import Blueprint, jsonify, request
import requests
from .config import Config
from . import db
from app.models import User, Flood_Alert
from datetime import datetime


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


@main.route('/fetch-flood-warnings', methods=['GET'])
def fetch_flood_warnings():
    try:
        response = requests.get(
            'https://api.weather.gov/alerts/active?event=Flood%20Warning')
        response.raise_for_status()  # Raise exception if status code is not 200

        data = response.json()

        features = data['features'][:50]  # Fetch only 10 features

        for feature in features:
            properties = feature['properties']
            geometry = feature['geometry']

            # Extract relevant fields
            event = properties['event']
            area_desc = properties['areaDesc']
            severity = properties['severity']
            certainty = properties['certainty']
            urgency = properties['urgency']
            headline = properties['headline']
            description = properties['description']
            coordinates = geometry['coordinates']
            effective = datetime.strptime(
                properties['effective'], '%Y-%m-%dT%H:%M:%S%z')
            expires = datetime.strptime(
                properties['expires'], '%Y-%m-%dT%H:%M:%S%z')

            # Check if the alert already exists (optional to avoid duplicates)
            existing_alert = Flood_Alert.query.filter_by(
                headline=headline).first()
            if not existing_alert:
                # Create a new Alert object
                new_alert = Flood_Alert(
                    event=event,
                    area_desc=area_desc,
                    severity=severity,
                    certainty=certainty,
                    urgency=urgency,
                    headline=headline,
                    description=description,
                    # Convert to string for storage
                    coordinates=str(coordinates),
                    effective=effective,
                    expires=expires
                )

                # Save the alert to the database
                db.session.add(new_alert)
                db.session.commit()

        return jsonify({"message": "50 Flood warnings fetched and saved successfully"}), 200

    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500
