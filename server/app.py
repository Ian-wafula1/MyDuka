
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, create_refresh_token, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, date
from functools import wraps
import uuid
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy import func, and_, or_
from sqlalchemy.orm import joinedload

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/inventory_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-this-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'your-email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your-app-password'

db = SQLAlchemy(app)
jwt = JWTManager(app)

blacklisted_tokens = set()

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return jwt_payload['jti'] in blacklisted_tokens

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # superuser, admin, clerk
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    store = db.relationship('Store', backref='users')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'store_id': self.store_id,
            'store_name': self.store.name if self.store else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }

class Store(db.Model):
    __tablename__ = 'stores'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=True)
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        admin_count = User.query.filter_by(store_id=self.id, role='admin', is_active=True).count()
        clerk_count = User.query.filter_by(store_id=self.id, role='clerk', is_active=True).count()
        
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'description': self.description,
            'admin_count': admin_count,
            'clerk_count': clerk_count,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    category = db.Column(db.String(50), nullable=True)
    buying_price = db.Column(db.Numeric(10, 2), nullable=False)
    selling_price = db.Column(db.Numeric(10, 2), nullable=False)
    current_stock = db.Column(db.Integer, default=0)
    reorder_level = db.Column(db.Integer, default=0)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text, nullable=True)
    
    store = db.relationship('Store', backref='products')
    spoilage_records = db.relationship('SpoilageRecord', backref='product')
    
    def to_dict(self):
        spoilt_items = sum([record.quantity_spoilt for record in self.spoilage_records])
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'sku': self.sku,
            'buying_price': float(self.buying_price),
            'selling_price': float(self.selling_price),
            'current_stock': self.current_stock,
            'spoilt_items': spoilt_items,
            'reorder_level': self.reorder_level,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'description': self.description
        }

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact_person': self.contact_person,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }

class InventoryEntry(db.Model):
    __tablename__ = 'inventory_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity_received = db.Column(db.Integer, nullable=False)
    payment_status = db.Column(db.String(20), default='unpaid')  # paid, unpaid
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=True)
    clerk_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    received_date = db.Column(db.DateTime, default=datetime.utcnow)
    batch_number = db.Column(db.String(50), nullable=True)
    expiry_date = db.Column(db.Date, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    payment_date = db.Column(db.Date, nullable=True)
    payment_reference = db.Column(db.String(100), nullable=True)
    
    product = db.relationship('Product', backref='inventory_entries')
    supplier = db.relationship('Supplier', backref='inventory_entries')
    clerk = db.relationship('User', backref='inventory_entries')
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_name': self.product.name,
            'quantity_received': self.quantity_received,
            'payment_status': self.payment_status,
            'supplier_name': self.supplier.name if self.supplier else None,
            'clerk_name': f"{self.clerk.first_name} {self.clerk.last_name}",
            'received_date': self.received_date.isoformat(),
            'batch_number': self.batch_number,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'notes': self.notes,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'payment_reference': self.payment_reference
        }

class SpoilageRecord(db.Model):
    __tablename__ = 'spoilage_records'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity_spoilt = db.Column(db.Integer, nullable=False)
    spoilage_reason = db.Column(db.String(50), nullable=False)  # expired, broken, damaged, other
    notes = db.Column(db.Text, nullable=True)
    recorded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recorded_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    recorded_by_user = db.relationship('User', backref='spoilage_records')
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_name': self.product.name,
            'quantity_spoilt': self.quantity_spoilt,
            'spoilage_reason': self.spoilage_reason,
            'notes': self.notes,
            'recorded_by': f"{self.recorded_by_user.first_name} {self.recorded_by_user.last_name}",
            'recorded_date': self.recorded_date.isoformat()
        }

class SupplyRequest(db.Model):
    __tablename__ = 'supply_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    clerk_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    requested_quantity = db.Column(db.Integer, nullable=False)
    approved_quantity = db.Column(db.Integer, nullable=True)
    urgency = db.Column(db.String(10), default='medium')  # low, medium, high
    status = db.Column(db.String(20), default='pending')  # pending, approved, declined
    reason = db.Column(db.Text, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    admin_notes = db.Column(db.Text, nullable=True)
    requested_at = db.Column(db.DateTime, default=datetime.utcnow)
    processed_at = db.Column(db.DateTime, nullable=True)
    processed_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    product = db.relationship('Product', backref='supply_requests')
    clerk = db.relationship('User', foreign_keys=[clerk_id], backref='clerk_supply_requests')
    admin = db.relationship('User', foreign_keys=[processed_by], backref='admin_supply_requests')
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_name': self.product.name,
            'current_stock': self.product.current_stock,
            'requested_quantity': self.requested_quantity,
            'approved_quantity': self.approved_quantity,
            'urgency': self.urgency,
            'status': self.status,
            'reason': self.reason,
            'notes': self.notes,
            'admin_notes': self.admin_notes,
            'clerk_name': f"{self.clerk.first_name} {self.clerk.last_name}",
            'requested_at': self.requested_at.isoformat(),
            'processed_at': self.processed_at.isoformat() if self.processed_at else None,
            'processed_by': f"{self.admin.first_name} {self.admin.last_name}" if self.admin else None
        }

class AdminInvitation(db.Model):
    __tablename__ = 'admin_invitations'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'), nullable=False)
    invited_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    
    store = db.relationship('Store', backref='invitations')
    inviter = db.relationship('User', backref='sent_invitations')


def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if not user or user.role not in allowed_roles or not user.is_active:
                return jsonify({'error': {'code': 'FORBIDDEN', 'message': 'Insufficient permissions'}}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

def send_email(to_email, subject, body):
    """Send email function - update with your email configuration"""
    try:
        print(f"Email would be sent to {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: {body}")
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

def get_current_user():
    """Helper to get current user object"""
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Email and password are required'
                }
            }), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({
                'error': {
                    'code': 'INVALID_CREDENTIALS',
                    'message': 'Invalid email or password'
                }
            }), 401
        
        if not user.is_active:
            return jsonify({
                'error': {
                    'code': 'ACCOUNT_INACTIVE',
                    'message': 'Account is deactivated'
                }
            }), 401
        
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'An error occurred during login'
            }
        }), 500

@app.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return jsonify({
                'error': {
                    'code': 'INVALID_USER',
                    'message': 'User not found or inactive'
                }
            }), 401
        
        new_token = create_access_token(identity=current_user_id)
        return jsonify({'access_token': new_token}), 200
        
    except Exception as e:
        return jsonify({
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to refresh token'
            }
        }), 500

@app.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    try:
        token = get_jwt()
        jti = token['jti']
        blacklisted_tokens.add(jti)
        
        return jsonify({'message': 'Successfully logged out'}), 200
        
    except Exception as e:
        return jsonify({
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to logout'
            }
        }), 500

@app.route('/auth/invite-admin', methods=['POST'])
@jwt_required()
@role_required(['superuser'])
def invite_admin():
    try:
        data = request.get_json()
        current_user = get_current_user()
        
        if not data.get('email') or not data.get('store_id'):
            return jsonify({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Email and store_id are required'
                }
            }), 400
        
        store = Store.query.get(data['store_id'])
        if not store:
            return jsonify({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Store not found'
                }
            }), 404
        
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({
                'error': {
                    'code': 'CONFLICT',
                    'message': 'User with this email already exists'
                }
            }), 409
        
        token = secrets.token_urlsafe(32)
        expires_hours = data.get('expires_in_hours', 24)
        expires_at = datetime.utcnow() + timedelta(hours=expires_hours)
        
        invitation = AdminInvitation(
            email=data['email'],
            token=token,
            store_id=data['store_id'],
            invited_by=current_user.id,
            expires_at=expires_at
        )
        
        db.session.add(invitation)
        db.session.commit()
        
        invitation_url = f"http://localhost:3000/register-admin?token={token}"
        email_body = f"""
        You have been invited to join as an admin for {store.name}.
        Click the link below to register:
        {invitation_url}
        
        This invitation expires on {expires_at.strftime('%Y-%m-%d %H:%M:%S UTC')}
        """
        
        send_email(data['email'], "Admin Invitation", email_body)
        
        return jsonify({
            'message': 'Invitation sent successfully',
            'invitation_id': invitation.id,
            'expires_at': expires_at.isoformat()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to send invitation'
            }
        }), 500

@app.route('/auth/register-admin', methods=['POST'])
def register_admin():
    try:
        data = request.get_json()
        
        required_fields = ['token', 'first_name', 'last_name', 'password', 'confirm_password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': f'{field} is required'
                    }
                }), 400
        
        if data['password'] != data['confirm_password']:
            return jsonify({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'Passwords do not match'
                }
            }), 400
        
        invitation = AdminInvitation.query.filter_by(
            token=data['token'],
            is_used=False
        ).first()
        
        if not invitation:
            return jsonify({
                'error': {
                    'code': 'INVALID_TOKEN',
                    'message': 'Invalid or expired invitation token'
                }
            }), 400
        
        if invitation.expires_at < datetime.utcnow():
            return jsonify({
                'error': {
                    'code': 'EXPIRED_TOKEN',
                    'message': 'Invitation token has expired'
                }
            }), 400
        
        admin = User(
            email=invitation.email,
            first_name=data['first_name'],
            last_name=data['last_name'],
            role='admin',
            store_id=invitation.store_id,
            created_by=invitation.invited_by
        )
        admin.set_password(data['password'])
                           
        invitation.is_used = True
        
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({
            'message': 'Admin registered successfully',
            'user': admin.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to register admin'
            }
        }), 500

@app.route('/users/clerks', methods=['POST'])
@jwt_required()
@role_required(['admin'])
def add_clerk():
    try:
        data = request.get_json()
        current_user = get_current_user()
        
        required_fields = ['email', 'first_name', 'last_name', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'error': {
                        'code': 'VALIDATION_ERROR',
                        'message': f'{field} is required'
                    }
                }), 400
    
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({
                'error': {
                    'code': 'CONFLICT',
                    'message': 'User with this email already exists'
                }
            }), 409
        
    
        clerk = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role='clerk',
            store_id=current_user.store_id,
            created_by=current_user.id
        )
        clerk.set_password(data['password'])
        
        db.session.add(clerk)
        db.session.commit()
        
        return jsonify({
            'message': 'Clerk added successfully',
            'user': clerk.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to add clerk'
            }
        }), 500

@app.route('/users/clerks', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_clerks():
    try:
        current_user = get_current_user()
        
        clerks = User.query.filter_by(
            role='clerk',
            store_id=current_user.store_id
        ).all()
        
        return jsonify({
            'clerks': [clerk.to_dict() for clerk in clerks]
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to fetch clerks'
            }
        }), 500

@app.route('/users/clerks/<int:clerk_id>/status', methods=['PATCH'])
@jwt_required()
@role_required(['admin'])
def update_clerk_status(clerk_id):
    try:
        data = request.get_json()
        current_user = get_current_user()
        
        if 'is_active' not in data:
            return jsonify({
                'error': {
                    'code': 'VALIDATION_ERROR',
                    'message': 'is_active field is required'
                }
            }), 400
        
        clerk = User.query.filter_by(
            id=clerk_id,
            role='clerk',
            store_id=current_user.store_id
        ).first()
        
        if not clerk:
            return jsonify({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Clerk not found'
                }
            }), 404
        
        clerk.is_active = data['is_active']
        db.session.commit()
        
        return jsonify({'message': 'Clerk status updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to update clerk status'
            }
        }), 500

@app.route('/users/clerks/<int:clerk_id>', methods=['DELETE'])
@jwt_required()
@role_required(['admin'])
def delete_clerk(clerk_id):
    try:
        current_user = get_current_user()
        
        clerk = User.query.filter_by(
            id=clerk_id,
            role='clerk',
            store_id=current_user.store_id
        ).first()
        
        if not clerk:
            return jsonify({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Clerk not found'
                }
            }), 404
        
        db.session.delete(clerk)
        db.session.commit()
        
        return jsonify({'message': 'Clerk account deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to delete clerk'
            }
        }), 500

@app.route('/users/admins', methods=['GET'])
@jwt_required()
@role_required(['superuser'])
def delete_admin(admin_id):
    try:
        admin = User.query.filter_by(id=admin_id, role='admin').first()
        
        if not admin:
            return jsonify({
                'error': {
                    'code': 'NOT_FOUND',
                    'message': 'Admin not found'
                }
            }), 404
        
        db.session.delete(admin)   
        db.session.commit()
        
        return jsonify({'message': 'Admin deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'Failed to delete admin'
            }
        }), 500

   