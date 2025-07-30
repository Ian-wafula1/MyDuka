from config import app
from flask_restx import Api
from .registration import reg
from .stores import stores

api = Api(app,
          title='MyDuka API',
          version='1.0',
          doc='/api')


api.add_namespace(reg)
api.add_namespace(stores)