from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from config import db
from .user_stores import user_stores
from sqlalchemy.orm import validates

class Store(db.Model, SerializerMixin):
    __tablename__ = 'stores'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20))
    description = db.Column(db.String(1000))
    email = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Foreign Keys
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchants.id'))
    # Relationships
    
    merchant = db.relationship('Merchant', back_populates='stores')
    products = db.relationship('Product', back_populates='store')
    supply_requests = db.relationship('SupplyRequest', back_populates='store')
    users = db.relationship('User', back_populates='stores', secondary=user_stores)
    entries = db.relationship('Entry', back_populates='store')
    transactions = db.relationship('Transaction', back_populates='store')
    
    serialize_rules = ('-merchant', '-products.store', '-supply_requests.store', '-users.stores', '-entries.store', '-transactions.store')
    # Hybrid property to get merchant's name
    @hybrid_property
    def merchant_name(self):
        return self.merchant.name if self.merchant else None

    def __repr__(self):
        return f'<Store {self.name} (Merchant: {self.merchant_name})>'
    
    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError('Store name is required')
        return name
    
    @validates('location')
    def validate_location(self, key, location):
        if not location:
            raise ValueError('Store location is required')
        return location
    
    
