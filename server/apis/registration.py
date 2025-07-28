from flask_restx import Namespace, Resource
from config import jwt, db, mail
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask import request, make_response
from models import User, Merchant, Store
import datetime, os
from flask_mail import Message

reg = Namespace('registration', description='Registration operations', path='/')

@reg.route('/login')
class Login(Resource):
    def post(self):
        account_type = request.json['account_type']
        if account_type == 'merchant':
            merchant = Merchant.query.filter_by(email=request.json['email']).first()
            if not merchant:
                return make_response({'error': 'Merchant not found'}, 404)
            if not merchant.authenticate(request.json['password']):
                return make_response({'error': 'Invalid password'}, 401)
            access_token = create_access_token(identity={
                'id': merchant.id,
                'account_type': 'merchant'
            }, expires_delta=datetime.timedelta(days=7))
            return {'access_token': access_token, 'user_dict': merchant.to_dict()}
            
        elif account_type == 'admin':
            admin = User.query.filter_by(email=request.json['email'], account_type='admin').first()
            if not admin:
                return make_response({'error': 'Admin not found'}, 404)
            if not admin.authenticate(request.json['password']):
                return make_response({'error': 'Invalid password'}, 401)
            access_token = create_access_token(identity={
                'id': admin.id,
                'account_type': 'admin'
            }, expires_delta=datetime.timedelta(days=7))
            return {'access_token': access_token, 'user_dict': admin.to_dict()}
        
        elif account_type == 'clerk':
            clerk = User.query.filter_by(email=request.json['email'], account_type='clerk').first()
            if not clerk:
                return make_response({'error': 'Clerk not found'}, 404)
            if not clerk.authenticate(request.json['password']):
                return make_response({'error': 'Invalid password'}, 401)
            access_token = create_access_token(identity={
                'id': clerk.id,
                'account_type': 'clerk'
            }, expires_delta=datetime.timedelta(days=7))
            return {'access_token': access_token, 'user_dict': clerk.to_dict()}
        else:
            return make_response({'error': 'Invalid account type'}, 400)

@reg.route('/signup')
class Signup(Resource):
    def post(self):
        data = request.json
        
        if (account_type := data['account_type']) == 'merchant':
            merchant = Merchant(name=data['name'], email=data['email'])
            merchant.password_hash = data.get('password')
            db.session.add(merchant)
            db.session.commit()
            
            return make_response({'message': 'Merchant signed up successfully'}, 201)
        elif account_type in ('admin', 'clerk'):
            user = User(name=data['name'], email=data['email'], account_type=account_type)
            user.password_hash = data.get('password')
            db.session.add(user)
            db.session.commit()
            
            return make_response({'message': 'User signed up successfully'}, 201)
        
        else:
            return make_response({'error': 'Invalid account type'}, 400)
        
@reg.route('/reset-password')
class ResetPassword(Resource):
    def post(self):
        data = request.json
        if (account_type := data['account_type']) == 'merchant':
            merchant = Merchant.query.filter_by(email=data['email']).first()
            if not merchant:
                return make_response({'error': 'Merchant not found'}, 404)
            merchant.password_hash = data.get('password')
            db.session.add(merchant)
            db.session.commit()
            
            return make_response({'message': 'Password reset successfully'}, 200)
        
        elif account_type in ('admin', 'clerk'):
            user = User.query.filter_by(email=data['email'], account_type=account_type).first()
            if not user:
                return make_response({'error': 'User not found'}, 404)
            user.password_hash = data.get('password')
            db.session.add(user)
            db.session.commit()
            
            return make_response({'message': 'Password reset successfully'}, 200)
        else:
            return make_response({'error': 'Invalid account type'}, 400)

@reg.route('/verify-token')
class VerifyToken(Resource):
    @jwt_required()
    def get(self):
        data = get_jwt_identity()
        return make_response({'email': data['email'],
                              'store_id': data.get('store_id'),
                              'store_name': data.get('store_name')},
                            200)
        
@reg.route('/send-invite')
class SendInvite(Resource):
    @jwt_required()
    def post(self):
        data = request.json
        store = Store.query.filter_by(id=data['store_id']).first()
        if not store:
            return make_response({'error': 'Store not found'}, 404)
        access_token = create_access_token(identity={
            'email': data['email'],
            'store_id': data['store_id'],
            'store_name': store.name
        })
        message = Message(
            subject="Invitation to join a store",
            sender="no-reply@myduka.com",
            recipients=[data['email']],
            body=f"Hello,\n\nYou have been invited to join {store.name}. Please click the link below to join:\n{os.environ.get('FRONTEND_URL')}/signup/{access_token}\n\nBest regards,\nMyDuka Team"
        )
        
        mail.send(message)
        return make_response({'message': 'Invitation sent successfully'}, 200)