from config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import func

class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'
    
    # id, quantity, product_id, created_at, unit_price
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    created_at = db.Column(db.DateTime, nullable=False, default=func.now())
    unit_price = db.Column(db.Float, nullable=False, default=1.00)
    
    product = db.relationship('Product', back_populates='transactions')
    
    serialize_rules = ('-product',)