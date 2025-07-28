from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

entries_bp = Blueprint('entries', __name__)

# Add a new stock entry (Clerk only)
@entries_bp.route('/entries', methods=['POST'])
@jwt_required()
def add_entry():
    data = request.get_json()
    # Logic to add a new stock entry
    return jsonify({"message": "Entry added"}), 201

# Update an entry (Clerk/Admin)
@entries_bp.route('/entries/<int:entry_id>', methods=['PUT'])
@jwt_required()
def update_entry(entry_id):
    data = request.get_json()
    # Logic to update entry
    return jsonify({"message": f"Entry {entry_id} updated"}), 200

# Delete an entry (Admin only)
@entries_bp.route('/entries/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_entry(entry_id):
    # Logic to delete entry
    return jsonify({"message": f"Entry {entry_id} deleted"}), 200

# Request additional supply (Clerk only)
@entries_bp.route('/entries/<int:entry_id>/request-supply', methods=['POST'])
@jwt_required()
def request_supply(entry_id):
    # Logic to send supply request to admin
    return jsonify({"message": "Supply request sent"}), 200
