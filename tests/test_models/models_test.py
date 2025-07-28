import pytest
from faker import Faker
from server import app
from server.models import db, Merchant, User, Store, Product, Entry, SupplyRequest, Transaction

fake = Faker()

class TestModels:
    """SQLAlchemy models in models.py"""

    # Merchant Model Tests
    def test_validates_merchant_name(self):
        """Require merchant to have a name."""
        with app.app_context():
            with pytest.raises(ValueError):
                Merchant(name=None, email="test@example.com")

            with pytest.raises(ValueError):
                Merchant(name="", email="test@example.com")

    def test_validates_merchant_email(self):
        """Require merchant to have a valid email."""
        with app.app_context():
            with pytest.raises(ValueError):
                Merchant(name=fake.name(), email=None)

            with pytest.raises(ValueError):
                Merchant(name=fake.name(), email="")

    # User Model Tests
    def test_validates_user_username(self):
        """Require user to have a username."""
        with app.app_context():
            with pytest.raises(ValueError):
                User(username=None, email="user@example.com", password="password")

            with pytest.raises(ValueError):
                User(username="", email="user@example.com", password="password")

    def test_validates_user_email(self):
        """Require user to have a valid email."""
        with app.app_context():
            with pytest.raises(ValueError):
                User(username=fake.user_name(), email=None, password="password")

            with pytest.raises(ValueError):
                User(username=fake.user_name(), email="", password="password")

    # Store Model Tests
    def test_validates_store_name(self):
        """Require store to have a name."""
        with app.app_context():
            merchant = Merchant(name=fake.name(), email=fake.email())
            db.session.add(merchant)
            db.session.commit()

            with pytest.raises(ValueError):
                Store(name=None, merchant_id=merchant.id)

            with pytest.raises(ValueError):
                Store(name="", merchant_id=merchant.id)

    # Product Model Tests
    def test_validates_product_name(self):
        """Require product to have a name."""
        with app.app_context():
            with pytest.raises(ValueError):
                Product(name=None, price=100.0, quantity=10)

            with pytest.raises(ValueError):
                Product(name="", price=100.0, quantity=10)

    def test_validates_product_price(self):
        """Require product to have a valid price."""
        with app.app_context():
            with pytest.raises(ValueError):
                Product(name=fake.word(), price=None, quantity=10)

            with pytest.raises(ValueError):
                Product(name=fake.word(), price=-100.0, quantity=10)

    # Entry Model Tests
    def test_validates_entry_action(self):
        """Require entry to have a valid action (in/out)."""
        with app.app_context():
            product = Product(name=fake.word(), price=100.0, quantity=10)
            db.session.add(product)
            db.session.commit()

            with pytest.raises(ValueError):
                Entry(product_id=product.id, quantity=5, action=None)

            with pytest.raises(ValueError):
                Entry(product_id=product.id, quantity=5, action="invalid")

    # SupplyRequest Model Tests
    def test_validates_supply_request_status(self):
        """Require supply request to have a valid status."""
        with app.app_context():
            product = Product(name=fake.word(), price=100.0, quantity=10)
            db.session.add(product)
            db.session.commit()

            with pytest.raises(ValueError):
                SupplyRequest(product_id=product.id, quantity=10, status=None)

            with pytest.raises(ValueError):
                SupplyRequest(product_id=product.id, quantity=10, status="invalid")

    # Transaction Model Tests
    def test_validates_transaction_amount(self):
        """Require transaction to have a valid amount."""
        with app.app_context():
            user = User(username=fake.user_name(), email=fake.email(), password="password")
            db.session.add(user)
            db.session.commit()

            with pytest.raises(ValueError):
                Transaction(amount=None, user_id=user.id, type="purchase")

            with pytest.raises(ValueError):
                Transaction(amount=-50.0, user_id=user.id, type="purchase")
