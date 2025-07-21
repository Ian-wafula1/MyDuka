from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import func

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
    created_at = db.Column(db.DateTime, nullable=False, default=func.now())
    
    merchant = db.relationship('Merchant', back_populates='users')
    supply_requests = db.relationship('Supply_Request', back_populates='user')
    store = db.relationship('Store', back_populates='users')
    
    serialize_rules = ('-merchant', '-supply_requests', '-store')
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')
        
    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password.encode('utf-8'))