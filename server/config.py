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
from flask_mail import Mail

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

app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER')
app.config['MAIL_PORT'] = os.environ.get('MAIL_PORT')
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS')
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

db.init_app(app)

jwt = JWTManager(app)
CORS(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)
mail = Mail(app)