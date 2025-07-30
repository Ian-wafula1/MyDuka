from flask_restx import Namespace, Resource
from config import jwt, db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask import request, make_response
from models import User, Merchant, Store, Transaction, Product
import datetime, os

transactions = Namespace('transactions', description='Transaction operations', path='/api/transactions')

@transactions.route('/')
class Transactions(Resource):
    def post(self):
        data = request.json
        for key in ['store_id', 'product_id', 'quantity']:
            if key not in data:
                return make_response({'error': f'Missing {key}'}, 400)
            
        product = Product.query.filter_by(id=data['product_id']).first()
        transaction = Transaction(
            store_id=data['store_id'],
            product_id=data['product_id'],
            quantity=data['quantity'],
            unit_price=product.selling_price
        )
        if product.quantity_in_stock < data['quantity']:
            return make_response({'error': 'Not enough stock'}, 400)
        product.quantity_in_stock -= data['quantity']
        
        db.session.add_all([transaction, product])
        db.session.commit()
        return make_response(transaction.to_dict(), 201)