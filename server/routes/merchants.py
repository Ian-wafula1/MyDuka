from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

merchants_bp = Blueprint('merchants', __name__)

# Get all merchants (Superuser only)
@merchants_bp.route('/merchants', methods=['GET'])
@jwt_required()
def get_merchants():
    current_user = get_jwt_identity()
    # Logic to fetch all merchants (superuser only)
    return jsonify({"message": "List of merchants"}), 200

# Add a new admin (Superuser only)
@merchants_bp.route('/merchants/admins', methods=['POST'])
@jwt_required()
def add_admin():
    data = request.get_json()
    # Logic to send tokenized link to admin's email
    return jsonify({"message": "Admin invitation sent"}), 201

# Deactivate/Delete an admin (Superuser only)
@merchants_bp.route('/merchants/admins/<int:admin_id>', methods=['PATCH', 'DELETE'])
@jwt_required()
def manage_admin(admin_id):
    if request.method == 'PATCH':
        # Logic to deactivate admin
        return jsonify({"message": "Admin deactivated"}), 200
    elif request.method == 'DELETE':
        # Logic to delete admin
        return jsonify({"message": "Admin deleted"}), 200

# View store reports (Superuser only)
@merchants_bp.route('/merchants/reports/stores', methods=['GET'])
@jwt_required()
def get_store_reports():
    # Logic to fetch store-level reports
    return jsonify({"message": "Store reports"}), 200

# View product performance (Superuser only)
@merchants_bp.route('/merchants/reports/products/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product_performance(product_id):
    # Logic to fetch product performance
    return jsonify({"message": f"Performance for product {product_id}"}), 200
