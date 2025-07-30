from flask_restx import Namespace, Resource
from config import jwt, db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask import request, make_response
from models import User, Merchant, Store, Product
import datetime, os

products = Namespace('products', description='Product operations', path='/api/products')


@products.route('/')
class Products(Resource):
    def post(self):
        try:
            data = request.json
            for key in ('name', 'quantity_in_stock', 'quantity_spoilt', 'buying_price', 'selling_price'):
                if key not in data:
                    return make_response({'error': f'Missing {key}'}, 400)
                
            product = Product(
                name=data['name'],
                quantity_in_stock=data['quantity_in_stock'],
                quantity_spoilt=data['quantity_spoilt'],
                buying_price=data['buying_price'],
                selling_price=data['selling_price'],
                store_id=data['store_id']
            )
            db.session.add(product)
            db.session.commit()
            return make_response(product.to_dict(), 201)
        except Exception as e:
            make_response({'error': str(e)}, 500)