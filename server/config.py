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

# app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER')
# app.config['MAIL_PORT'] = os.environ.get('MAIL_PORT')
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USE_SSL'] = False
# app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
# app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')

# GMAIL_APP_PASSWORD = os.environ.get('GMAIL_APP_PASSWORD')
    # GMAIL_SMTP_HOST = 'smtp.gmail.com'
    # GMAIL_SMTP_PORT = 465

app.config['GMAIL_USER'] = os.environ.get('MAIL_USERNAME')
app.config['GMAIL_APP_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['GMAIL_SMTP_HOST'] = os.environ.get('MAIL_SERVER')
app.config['GMAIL_SMTP_PORT'] = os.environ.get('MAIL_PORT')

db.init_app(app)

jwt = JWTManager(app)
CORS(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)