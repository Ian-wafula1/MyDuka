from flask_restx import Namespace, Resource
from config import jwt, db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask import request, make_response
from models import User, Merchant, Store, Transaction, Product
import datetime, os

admins = Namespace('admins', description='Administrator operations', path='/api/admins')

@admins.route('/<int:id>')
class AdminsByID(Resource):
    def delete(self, id):
        try:
            admin = User.query.filter_by(id=id, account_type='admin').first()
            if not admin:
                return make_response({'error': 'Admin not found'}, 404)
            db.session.delete(admin)
            db.session.commit()
            return make_response({'message': 'Admin deleted successfully'}, 200)
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
    def patch(self, id):
        try:
            admin = User.query.filter_by(id=id, account_type='admin').first()
            if not admin:
                return make_response({'error': 'Admin not found'}, 404)
            
            for key, value in request.json.items():
                setattr(admin, key, value)
            db.session.add(admin)
            db.session.commit()
            return make_response({'message': 'Admin updated successfully'}, 200)
            
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
@admins.route('/')
class Admins(Resource):
    def post(self):
        try:
            data = request.json
            admin = User(
                name=data['name'],
                email=data['email'],
                account_type='admin',
                account_status='active',
                merchant_id= data['merchant_id']
            )
            
            admin.password_hash = data['password']
            store = Store.query.filter_by(id=data['store_id']).first()
            store.admins.append(admin)
            
            db.session.add_all([admin, store])
            db.session.commit()
            return make_response(admin.to_dict(), 201)
        except Exception as e:
            return make_response({'error': str(e)}, 500)