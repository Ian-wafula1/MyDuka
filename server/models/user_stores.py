from config import db

user_stores = db.Table(
    'user_stores',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('store_id', db.Integer, db.ForeignKey('stores.id'))
)