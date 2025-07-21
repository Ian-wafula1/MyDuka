from config import db
from sqlalchemy_serializer import SerializerMixin

class Supply_Request(db.Model, SerializerMixin):
    
    __tablename__ = 'supply_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    status = db.Column(db.String, nullable=False, default='pending')
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    created_at = db.Column(db.DateTime, nullable=False)
    
    store = db.relationship('Store', back_populates='supply_requests')
    product = db.relationship('Product', back_populates='supply_requests')
    user = db.relationship('User', back_populates='supply_requests')
    
    serialize_rules = ('-store', '-user', '-product')