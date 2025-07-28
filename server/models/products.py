from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property
from server.models import db

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)          # Product name (e.g "Sugar 1kg")
    quantity_in_stock = db.Column(db.Integer, default=0)      # Available stock
    quantity_spoilt = db.Column(db.Integer, default=0)        # Spoilt/damaged items
    buying_price = db.Column(db.Float, nullable=False)        # Cost price (per unit)
    selling_price = db.Column(db.Float, nullable=False)       # Retail price (per unit)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Foreign Key (required for database relationship)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'), nullable=False)

    # Relationships
    store = db.relationship('Store', backref='products') # Parent store

    # Hybrid property to get the store's name (no database column)
    @hybrid_property
    def store_name(self):
        return self.store.name if self.store else None

    def __repr__(self):
        return f'<Product {self.name} (Store: {self.store_name})>'
