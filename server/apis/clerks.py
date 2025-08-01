from flask_restx import Namespace, Resource
from config import jwt, db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask import request, make_response
from models import User, Merchant, Store
import datetime, os

clerks = Namespace('clerks', description='Clerk operations', path='/api/clerks')

@clerks.route('/<int:id>')
class ClerkByID(Resource):
    @jwt_required()
    def get(self, id):
        try:
            clerk = User.query.filter_by(id=id, account_type='clerk').first()
            if not clerk:
                return make_response({'error': 'Clerk not found'}, 404)
            return make_response(clerk.to_dict(), 200)
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
    @jwt_required()
    def delete(self, id):
        try:
            clerk = User.query.filter_by(id=id, account_type='clerk').first()
            if not clerk:
                return make_response({'error': 'Clerk not found'}, 404)
            db.session.delete(clerk)
            db.session.commit()
            return make_response({'message': 'Clerk deleted successfully'}, 200)
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
    @jwt_required()
    def patch(self, id):
        try:
            clerk = User.query.filter_by(id=id, account_type='clerk').first()
            if not clerk:
                return make_response({'error': 'Clerk not found'}, 404)
            
            for key, value in request.json.items():
                setattr(clerk, key, value)
            db.session.add(clerk)
            db.session.commit()
            return make_response({'message': 'Clerk updated successfully'}, 200)
            
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
@clerks.route('/')
class Clerks(Resource):
    @jwt_required()
    def post(self):
        try:
            data = request.json
            for key in ['name', 'email', 'password']:
                if key not in data:
                    return make_response({'error': f'Missing {key}'}, 400)
                
            clerk = User(
                name=data['name'],
                email=data['email'],
                account_type='clerk', 
                account_status='active',
                merchant_id= data['merchant_id']
            )
            store = Store.query.filter_by(id=data['store_id']).first()
            store.clerks.append(clerk)
            
            clerk.password_hash = data['password']
            db.session.add_all([clerk, store])
            db.session.commit()
            return make_response(clerk.to_dict(), 201)
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
@clerks.route('/stores')
class ClerkStores(Resource):
    @jwt_required()
    def get(self):
        try:
            clerk_id = get_jwt_identity()['user_id']
            clerk = Merchant.query.filter_by(id=clerk_id).first()
            if not clerk:
                return make_response({'error': 'Clerk not found'}, 404)
            stores = [store.to_dict() for store in clerk.stores]
            return make_response({'stores': stores}, 200, {'Content-Type': 'application/json'})
        
        except Exception as e:
            return make_response({'error': str(e)}, 500)