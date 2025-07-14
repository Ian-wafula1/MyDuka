from flask import send_from_directory
from config import app, api
from flask_restx import Resource

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return app.static_folder % path

    
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

@api.route('/api/test')
class Test(Resource):
    def get(self):
        return {'test': 'test'}

if __name__ == '__main__':
    app.run()