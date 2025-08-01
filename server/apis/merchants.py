from flask_restx import Namespace, Resource
from config import jwt, db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask import request, make_response
from models import User, Merchant, Store
import datetime, os

merchants = Namespace('merchants', description='Merchant operations', path='/api/merchants')

@merchants.route('/stores')
class MerchantStores(Resource):
    @jwt_required()
    def get(self):
        try:
            merchant_id = get_jwt_identity()['user_id']
            merchant = Merchant.query.filter_by(id=merchant_id).first()
            if not merchant:
                return make_response({'error': 'Merchant not found'}, 404)
            stores = [store.to_dict() for store in merchant.stores]
            return make_response({'stores': stores}, 200, {'Content-Type': 'application/json'})
        
        except Exception as e:
            return make_response({'error': str(e)}, 500)