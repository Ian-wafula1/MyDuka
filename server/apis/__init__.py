from config import app
from .registration import reg
from flask_restx import Api

api = Api(app,
          title='MyDuka API',
          version='1.0',
          doc='/api')


api.add_namespace(reg)