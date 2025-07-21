from flask_bcrypt import Bcrypt
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy import MetaData
from flask_jwt_extended import  JWTManager
import os
from dotenv import load_dotenv

load_dotenv()
metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

authorizations = {
    'Bearer': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    }
}

app = Flask(
    __name__,
    static_url_path='',
    static_folder='static',
)

app.secret_key = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.json.sort_keys = True
app.json.compact = False

db.init_app(app)

jwt = JWTManager(app)
CORS(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

api = Api(app,
          title='MyDuka API',
          version='1.0',
          doc='/api')