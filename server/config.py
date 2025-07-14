from dotenv import load_dotenv
from flask import Flask
from flask_restx import Api

load_dotenv()

app = Flask(
    __name__,
    static_url_path='',
    static_folder='static',
)

app.json.sort_keys = True
app.json.compact = False
api = Api(app, doc=False)