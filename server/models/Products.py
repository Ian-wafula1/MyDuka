from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy import func
from sqlalchemy.orm import validates

class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)          # Product name (e.g "Sugar 1kg")
    quantity_in_stock = db.Column(db.Integer, default=0)      # Available stock
    quantity_spoilt = db.Column(db.Integer, default=0)        # Spoilt/damaged items
    buying_price = db.Column(db.Float, nullable=False)        # Cost price (per unit)
    selling_price = db.Column(db.Float, nullable=False)       # Retail price (per unit)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())

    # Foreign Key (required for database relationship)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))

    # Relationships
    # store = db.relationship('Store', backref='products') # Parent store
    store = db.relationship('Store', back_populates='products')
    transactions = db.relationship('Transaction', back_populates='product')
    supply_requests = db.relationship('SupplyRequest', back_populates='product')
    entries = db.relationship('Entry', back_populates='product')
    
    serialize_rules = ('-store', '-transactions', '-supply_requests', '-entries')

    # Hybrid property to get the store's name (no database column)
    @hybrid_property
    def store_name(self):
        return self.store.name if self.store else None

    def __repr__(self):
        return f'<Product {self.name} (Store: {self.store_name})>'

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError('Product name is required')
        return name
    
    @validates('quantity_in_stock')
    def validate_quantity_in_stock(self, key, quantity_in_stock):
        if quantity_in_stock < 0:
            raise ValueError('Quantity in stock cannot be negative')
        return quantity_in_stock
    
    @validates('buying_price')
    def validate_buying_price(self, key, buying_price):
        if not buying_price or buying_price < 0:
            raise ValueError('Buying price cannot be negative')
        return buying_price
    
    @validates('selling_price')
    def validate_selling_price(self, key, selling_price):
        if not selling_price or selling_price < 0:
            raise ValueError('Selling price cannot be negative')
        return selling_price