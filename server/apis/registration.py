from flask_restx import Namespace, Resource
from config import jwt, db
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask import request, make_response
from models import User, Merchant, Store
import datetime, os
from email.mime.text import MIMEText
import smtplib

reg = Namespace('registration', description='Registration operations', path='/api')

@reg.route('/login')
class Login(Resource):
    def post(self):
        try: 
            data = request.json
            if not data or 'email' not in data or 'password' not in data:
                return make_response({'error': 'Missing email or password'}, 400)
            
            account_type = data.get('account_type')
            
            if account_type == 'merchant':
                user = Merchant.query.filter_by(email=request.json['email']).first()
                
            elif account_type in ('clerk', 'admin'):
                user = User.query.filter_by(email=data.get('email'), account_type=account_type).first()
            else:
                return make_response({'error': 'Invalid account type'}, 400)
            
            if not user:
                return make_response({'error': 'User not found'}, 404)
            if not user.authenticate(request.json['password']):
                return make_response({'error': 'Invalid password'}, 401)
            if account_type in ('clerk', 'admin') and user.account_status != 'active':
                return make_response({'error': 'User account is disabled. Please contact your superior'}, 401)
            access_token = create_access_token(identity={
                'id': user.id,
                'account_type': account_type
            }, expires_delta=datetime.timedelta(days=7))
            return {'access_token': access_token, 'user_dict': user.to_dict()}
        except Exception as e:
            return make_response({'error': str(e)}, 500)

@reg.route('/signup')
class Signup(Resource):
    def post(self):
        try:
            data = request.json
        
            if (account_type := data['account_type']) == 'merchant':
                user = Merchant(name=data['name'], email=data['email'])
            elif account_type in ('admin', 'clerk'):
                user = User(name=data['name'], email=data['email'], account_type=account_type)
            else:
                return make_response({'error': 'Invalid account type'}, 400)
            
            user.password_hash = data.get('password')
            if account_type == 'admin':
                id = get_jwt_identity()['store_id']
                store = Store.query.filter_by(id=id).first()
                store.users.append(user)
                user.merchant_id = store.merchant_id
                db.session.add_all([user, store])
                db.session.commit()
                # user.merchant_id = get_jwt_identity()['id']
            else:
                db.session.add(user)
                db.session.commit()
            return make_response({'message': f'{account_type.capitalize()} signed up successfully'}, 201)
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
@reg.route('/reset-password')
class ResetPassword(Resource):
    def post(self):
        try:
            data = request.json
            if not data or 'email' not in data or 'newPassword' not in data:
                return make_response({'error': 'Missing email or password'}, 400)
            
            if (account_type := data['account_type']) == 'merchant':
                user = Merchant.query.filter_by(email=data['email']).first()
            elif account_type in ('admin', 'clerk'):
                user = User.query.filter_by(email=data['email'], account_type=account_type).first()
            else:
                return make_response({'error': 'Invalid account type'}, 400)
                
            if not user:
                return make_response({'error': 'Merchant not found'}, 404)
            user.password_hash = data.get('newPassword')
            db.session.add(user)
            db.session.commit()
            
            return make_response({'message': 'Password reset successfully'}, 200)
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        

@reg.route('/verify-token')
class VerifyToken(Resource):
    @jwt_required()
    def get(self):
        try:
            data = get_jwt_identity()
            return make_response({'email': data['email'],
                                'store_id': data.get('store_id'),
                                'store_name': data.get('store_name')},
                                200)
        except Exception as e:
            return make_response({'error': str(e)}, 500)
        
@reg.route('/send-invite')
class SendInvite(Resource):
    @jwt_required()
    def post(self):
        try:
            data = request.json
            store = Store.query.filter_by(id=data['store_id']).first()
            if not store:
                return make_response({'error': 'Store not found'}, 404)
            access_token = create_access_token(identity={
                'email': data['email'],
                'store_id': data['store_id'],
                'store_name': store.name
            }, expires_delta=datetime.timedelta(hours=2))
            # message = Message(
            #     subject="Invitation to join a store",
            #     sender=os.environ.get('MAIL_USERNAME'),
            #     recipients=[data['email']],
            #     body=f"Hello {data['name']} ,\n\nYou have been invited to join {store.name}. Please click the link below to join:\n{os.environ.get('FRONTEND_URL')}/signup/{access_token}\n\nBest regards,\nMyDuka Team"
            # )
            
            msg = MIMEText(f"""
            Hello {data['name']}, You have been invited to join {store.name}.
            Please click the link below to join:
            {os.environ.get('FRONTEND_URL')}/signup/{access_token}
            
            Best regards,
            MyDuka Team
            """)
            msg['Subject'] = f'Invitation to join {store.name}'
            msg['From'] = os.environ.get('MAIL_USERNAME')
            msg['To'] = data['email']

            with smtplib.SMTP_SSL('smtp.gmail.com', os.getenv('MAIL_PORT')) as server:
                server.login(os.getenv('MAIL_USERNAME'), os.getenv('MAIL_PASSWORD'))
                server.sendmail(os.getenv('MAIL_USERNAME'), data['email'], msg.as_string())
            # mail.send(message)
            return make_response({'message': 'Invitation sent successfully'}, 200)
        except Exception as e:
            return make_response({'error': str(e)}, 500)
    
@reg.route('/me')
class Me(Resource):
    @jwt_required()
    def get(self):
        try:
            data = get_jwt_identity()
            if (account_type := data['account_type']) == 'merchant':
                user = Merchant.query.filter_by(id=data['id']).first()
            elif account_type in ('admin', 'clerk'):
                user = User.query.filter_by(id=data['id']).first()
            else:
                return make_response({'error': 'Invalid account type'}, 400)
            
            # stores = [store.to_dict() for store in user.stores]
            
            return make_response({
                'account_type': account_type, 'user_dict': user.to_dict()}, 200)
            
        except Exception as e:
            print(e)
            return make_response({'error': str(e)}, 500)