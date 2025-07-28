from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from server.models import db


class Merchant(db.Model):
    __tablename__ = 'merchants'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    stores = db.relationship('Store', backref='merchant', lazy=True)
    users = db.relationship('User', backref='merchant', lazy=True)

    def __repr__(self):
        return f'<Merchant {self.name}>'
