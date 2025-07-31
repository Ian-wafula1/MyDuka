from flask import send_from_directory
from config import app, db, migrate  # Import db and migrate
from apis import api
from flask_restx import Resource
from models import *

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return app.static_folder % path

@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True, port=5555)
