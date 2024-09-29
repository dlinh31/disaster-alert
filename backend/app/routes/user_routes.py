from flask import Blueprint, request, jsonify
from ..models import User, SeekerProfile, ProviderProfile, db

user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone_number = data.get('phone_number')
    role = data.get('role')  # 'seeker' or 'provider'

    if role not in ['provider', 'seeker']:
        return jsonify({"error": "Invalid role"})

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(name=name, email=email,
                    phone_number=phone_number, role=role)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    if role == 'seeker':
        seeker_profile = SeekerProfile(
            user_id=new_user.id,
            emergency_contact=data.get('emergency_contact')
        )
        db.session.add(seeker_profile)
    elif role == 'provider':
        provider_profile = ProviderProfile(
            user_id=new_user.id,
            organization_name=data.get('organization_name'),
        )
        db.session.add(provider_profile)

    db.session.commit()

    return jsonify({"message": f"{role.capitalize()}, with id {new_user.id} registered successfully"}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Check if the user exists
    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({"error": "Invalid email or password"}), 401

    # Check if the provided password matches
    if not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    # If login is successful, you can return a success message and user details
    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        }
    }), 201
