from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import func
from .user_stores import user_stores
from sqlalchemy.orm import validates

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    account_type = db.Column(db.String, nullable=False, default='admin')
    account_status = db.Column(db.String, nullable=False, default='active')
    email = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchants.id'))
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    
    merchant = db.relationship('Merchant', back_populates='users')
    supply_requests = db.relationship('SupplyRequest', back_populates='user')
    stores = db.relationship('Store', back_populates='users', secondary=user_stores)
    
    serialize_rules = ('-merchant', '-supply_requests', '-stores')
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')
        
    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password.encode('utf-8'))
    
    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name) < 3 or not name.isalpha():
            raise ValueError('Name must be at least 3 characters long')
        return name
    
    @validates('email')
    def validate_email(self, key, email):
        if not email or len(email) < 3:
            raise ValueError('Email must be at least 3 characters long')
        return email