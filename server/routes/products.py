from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

products_bp = Blueprint('products', __name__)

# Get all products (Admin/Clerk)
@products_bp.route('/products', methods=['GET'])
@jwt_required()
def get_products():
    # Logic to fetch all products
    return jsonify({"message": "List of products"}), 200

# Add a new product (Admin only)
@products_bp.route('/products', methods=['POST'])
@jwt_required()
def add_product():
    data = request.get_json()
    # Logic to add a new product
    return jsonify({"message": "Product added"}), 201

# Update product details (Admin only)
@products_bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    data = request.get_json()
    # Logic to update product
    return jsonify({"message": f"Product {product_id} updated"}), 200

# Delete a product (Admin only)
@products_bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    # Logic to delete product
    return jsonify({"message": f"Product {product_id} deleted"}), 200

# View product performance (Admin/Merchant)
@products_bp.route('/products/<int:product_id>/performance', methods=['GET'])
@jwt_required()
def get_product_performance(product_id):
    # Logic to fetch product performance
    return jsonify({"message": f"Performance for product {product_id}"}), 200
