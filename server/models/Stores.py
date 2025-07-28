from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from config import db
from .user_stores import user_stores

class Store(db.Model, SerializerMixin):
    __tablename__ = 'stores'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Foreign Keys
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchants.id'), nullable=False)
    # Relationships
    
    merchant = db.relationship('Merchant', back_populates='stores')
    products = db.relationship('Product', back_populates='store')
    supply_requests = db.relationship('Supply_Request', back_populates='store')
    users = db.relationship('User', back_populates='stores', secondary=user_stores)
    entries = db.relationship('Entry', back_populates='store')
    
    serialize_rules = ('-merchant', '-products', '-supply_requests', '-users', '-entries')

    # Hybrid property to get merchant's name
    @hybrid_property
    def merchant_name(self):
        return self.merchant.name if self.merchant else None

    def __repr__(self):
        return f'<Store {self.name} (Merchant: {self.merchant_name})>'
