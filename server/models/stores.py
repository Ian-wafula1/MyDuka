from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property
from app import db

class Store(db.Model):
    __tablename__ = 'stores'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Foreign Keys
    merchant_id = db.Column(db.Integer, db.ForeignKey('merchants.id'), nullable=False)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    assigned_to_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # User-friendly fields
    created_by = db.Column(db.String(100), nullable=False)  # Name of creator
    assigned_to = db.Column(db.String(100))  # Name of assignee

    # Relationships
    merchant = db.relationship('Merchant', backref='stores')
    created_by_user = db.relationship('User', foreign_keys=[created_by_user_id], backref='created_stores')
    assigned_to_user = db.relationship('User', foreign_keys=[assigned_to_user_id], backref='assigned_stores')
    products = db.relationship('Product', backref='store', lazy=True)
    supply_requests = db.relationship('SupplyRequest', backref='store', lazy=True)

    # Hybrid property to get merchant's name
    @hybrid_property
    def merchant_name(self):
        return self.merchant.name if self.merchant else None

    def __repr__(self):
        return f'<Store {self.name} (Merchant: {self.merchant_name})>'
