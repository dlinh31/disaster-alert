from flask import Flask, jsonify
import googlemaps
from dotenv import load_dotenv
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv()


# Get the Google API key from environment variables
google_api_key = os.getenv('GOOGLE_API_KEY')

# Add debug prints to check if the API key is loaded correctly
print("Google API Key:", google_api_key)  # This should print the key in your terminal

@app.route('/')
def index():
    return "Backend is running"

@app.route('/api/get-api-key', methods=['GET'])
def get_api_key():
    if google_api_key:  # Check if API key is loaded
        return jsonify({"googleMapsApiKey": google_api_key})
    else:
        return jsonify({"error": "API key not found"}), 500

if __name__ == '__main__':
    app.run(debug=True)