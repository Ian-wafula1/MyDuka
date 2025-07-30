from flask_restx import Namespace, Resource
from config import jwt, db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask import request, make_response
from models import User, Merchant, Store, SupplyRequest, Entry
import datetime, os

supply_requests = Namespace('supply_requests', description='Supply Request operations', path='/api/supply-requests')

@supply_requests.route('/<int:id>')
class RequestByID(Resource):
    def patch(self, id):
        try:
            supply_request = SupplyRequest.query.filter_by(id=id).first()
            if not supply_request:
                return make_response({'error': 'Request not found'}, 404)
            
            for key, value in request.json.items():
                setattr(supply_request, key, value)
                
            product = supply_request.product
            if supply_request.payment_status == 'approved':
                product.quantity_in_stock += supply_request.quantity
                entry = Entry(
                    quantity=supply_request.quantity,
                    product_id=supply_request.product_id,
                    store_id=supply_request.store_id,
                    payment_status='paid',
                    total_sum=product.buying_price * supply_request.quantity,
                )
                db.session.add_all([product, entry])
                db.session.commit()
                
            db.session.add(supply_request)
            db.session.commit()
            return make_response({'message': 'Request updated successfully'}, 200)
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
@supply_requests.route('/')
class Requests(Resource):
    def post(self):
        try:
            data = request.json
            for key in ['store_id', 'product_id', 'quantity', 'payment_status', 'total_sum']:
                if key not in data:
                    return make_response({'error': f'Missing {key}'}, 400)
            
            request = SupplyRequest(
                store_id=data['store_id'],
                product_id=data['product_id'],
                quantity=data['quantity'],
                payment_status=data['payment_status'],
                total_sum=data['total_sum'],
            )
            db.session.add(request)
            db.session.commit()
            return make_response(request.to_dict(), 201)
        except Exception as e:
            return make_response({'error': str(e)}, 500)