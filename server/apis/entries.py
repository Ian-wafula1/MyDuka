from flask_restx import Namespace, Resource
from config import jwt, db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask import request, make_response
from models import User, Merchant, Store, Entry, Product
import datetime, os

entries = Namespace('entries', description='Entry operations', path='/api/entries')

@entries.route('/<int:id>')
class EntryById(Resource):
    def patch(self, id):
        try:
            entry = Entry.query.filter_by(id=id).first()
            if not entry:
                return make_response({'error': 'Entry not found'}, 404)
            
            for key, value in request.json.items():
                setattr(entry, key, value)
            db.session.add(entry)
            db.session.commit()
            return make_response({'message': 'Entry updated successfully'}, 200)
        
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
@entries.route('/')
class Entries(Resource):
    def post(self):
        try:
            data= request.json
            for key in ['store_id', 'product_id', 'quantity', 'payment_status', 'total_sum']:
                if key not in data:
                    return make_response({'error': f'Missing {key}'}, 400)
                
            entry = Entry(
                store_id=data['store_id'],
                product_id=data['product_id'],
                quantity=data['quantity'],
                payment_status=data['payment_status'],
                total_sum=data['total_sum'],
            )
            
            product = Product.query.filter_by(id=data['product_id']).first()
            product.quantity_in_stock += data['quantity']
            
            db.session.add_all([entry, product])
            db.session.commit()
            return make_response(entry.to_dict(), 201)
        except Exception as e:
            return make_response({'error': str(e)}, 500)