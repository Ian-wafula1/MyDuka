from flask_restx import Namespace, Resource
from config import jwt, db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask import request, make_response
from models import User, Merchant, Store
import datetime, os

stores = Namespace('stores', description='Store operations', path='/api/stores')

@stores.route('/<int:id>')
class StoreByID(Resource):
    def get(self, id):
        try:
            store = Store.query.filter_by(id=id).first()
            if not store:
                return make_response({'error': 'Store not found'}, 404)
            return make_response({'store': store.to_dict()}, 200)
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
