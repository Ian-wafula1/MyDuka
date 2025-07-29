import pytest
from faker import Faker
from config import app, db
from models import Merchant, User, Store, Product, Entry, SupplyRequest, Transaction

fake = Faker()

class TestModels:
    """SQLAlchemy models in models.py"""

    # Merchant Model Tests
    def test_validates_merchant_name(self):
        """Require merchant to have a name."""
        with app.app_context():
            with pytest.raises(Exception):
                Merchant(name=None, email="test@example.com")

            with pytest.raises(Exception):
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
                User(name=None, email="user@example.com", password="password")

            with pytest.raises(ValueError):
                User(name="", email="user@example.com", password="password")

    def test_validates_user_email(self):
        """Require user to have a valid email."""
        with app.app_context():
            with pytest.raises(ValueError):
                User(name=fake.user_name(), email=None, password="password")

            with pytest.raises(ValueError):
                User(name=fake.user_name(), email="", password="password")

    # Store Model Tests
    def test_validates_store_name(self):
        """Require store to have a name."""
        with app.app_context():
            merchant = Merchant(name=fake.name(), email=fake.email())
            merchant.password_hash = fake.password()
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
                Product(name=None, buying_price=100.0, selling_price=80.0, quantity_in_stock=10)

            with pytest.raises(ValueError):
                Product(name="", buying_price=100.0, selling_price=80.0, quantity_in_stock=10)

    def test_validates_product_price(self):
        """Require product to have a valid price."""
        with app.app_context():
            with pytest.raises(ValueError):
                Product(name=fake.word(), buying_price=None, selling_price=80.0, quantity_in_stock=10)

            with pytest.raises(ValueError):
                Product(name=fake.word(), buying_price=-100.0, selling_price=80.0, quantity_in_stock=10)
                
                
    # SupplyRequest Model Tests
    def test_validates_quantity(self):
        """Require supply request to have a valid quantity."""
        with app.app_context():
            with pytest.raises(ValueError):
                SupplyRequest(quantity=None, product_id=1)

            with pytest.raises(ValueError):
                SupplyRequest(quantity=-1, product_id=1)

    # Transaction Model Tests
    def test_validates_transaction_amount(self):
        """Require transaction to have a valid amount."""
        with app.app_context():
            user = User(name=fake.user_name(), email=fake.email())
            user.password_hash = fake.password()
            db.session.add(user)
            db.session.commit()

            with pytest.raises(ValueError):
                Transaction(quantity=None, user_id=user.id)

            with pytest.raises(ValueError):
                Transaction(quantity=-1, user_id=user.id)