from config import db
from sqlalchemy_serializer import SerializerMixin


class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'
    
    # id, quantity, product_id, created_at, unit_price
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    created_at = db.Column(db.DateTime, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    
    product = db.relationship('Product', back_populates='transactions')
    
    serialize_rules = ('-product',)