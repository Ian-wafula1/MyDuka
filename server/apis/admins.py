from flask_restx import Namespace, Resource

admins = Namespace('admins', description='Administrator operations', path='/admins')

