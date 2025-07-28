from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

stores_bp = Blueprint('stores', __name__)

# Get all stores (Admin only)
@stores_bp.route('/stores', methods=['GET'])
@jwt_required()
def get_stores():
    current_user = get_jwt_identity()
    # Logic to fetch stores (admin only)
    return jsonify({"message": "List of stores"}), 200

# Add a new store (Admin only)
@stores_bp.route('/stores', methods=['POST'])
@jwt_required()
def add_store():
    data = request.get_json()
    # Logic to add a new store
    return jsonify({"message": "Store added"}), 201

# Update store details (Admin only)
@stores_bp.route('/stores/<int:store_id>', methods=['PUT'])
@jwt_required()
def update_store(store_id):
    data = request.get_json()
    # Logic to update store
    return jsonify({"message": f"Store {store_id} updated"}), 200

# Delete a store (Admin only)
@stores_bp.route('/stores/<int:store_id>', methods=['DELETE'])
@jwt_required()
def delete_store(store_id):
    # Logic to delete store
    return jsonify({"message": f"Store {store_id} deleted"}), 200

# View store inventory (Admin/Clerk)
@stores_bp.route('/stores/<int:store_id>/inventory', methods=['GET'])
@jwt_required()
def get_store_inventory(store_id):
    # Logic to fetch inventory for a store
    return jsonify({"message": f"Inventory for store {store_id}"}), 200
