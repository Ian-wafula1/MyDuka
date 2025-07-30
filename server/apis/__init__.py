from config import app
from flask_restx import Api
from .registration import reg
from .stores import stores
from .clerks import clerks
from .admins import admins
from .entries import entries
from .products import products
from .supply_requests import supply_requests
from .transactions import transactions

api = Api(app,
          title='MyDuka API',
          version='1.0',
          doc='/api')


api.add_namespace(reg)
api.add_namespace(stores)
api.add_namespace(clerks)
api.add_namespace(admins)
api.add_namespace(entries)
api.add_namespace(products)
api.add_namespace(supply_requests)
api.add_namespace(transactions)