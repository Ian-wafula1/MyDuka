import click
from flask import Flask
from flask_migrate import Migrate
from server.models import db

migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///myduka.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    migrate.init_app(app, db)

    @app.cli.command("init-db")
    def init_db():
        """Initialize the database."""
        db.create_all()
        print("Database initialized.")

    with app.app_context():
        from server.models.merchants import Merchant
        from server.models.products import Product
        from server.models.entries import Entry
        from server.models.stores import Store

        from server.routes import merchants_bp, products_bp, entries_bp, stores_bp

        app.register_blueprint(merchants_bp)
        app.register_blueprint(products_bp)
        app.register_blueprint(entries_bp)
        app.register_blueprint(stores_bp)

    return app
