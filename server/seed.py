from server import create_app
from server.models import db
from server.models.merchants import Merchant
from server.models.products import Product
from server.models.stores import Store
from server.models.entries import Entry

app = create_app()

with app.app_context():
    # Drop all tables (optional, for fresh seed)
    db.drop_all()
    db.create_all()

    # Sample Merchants
    merchant1 = Merchant(name="Wilfred", email="wilfred@example.com")
    merchant2 = Merchant(name="Kiprop", email="kiprop@example.com")

    # Sample Stores
    store1 = Store(name="MyDuka Nairobi")
    store2 = Store(name="MyDuka Eldoret")

    # Sample Products
    product1 = Product(name="Soda", price=50.0)
    product2 = Product(name="Bread", price=40.0)

    # Sample Entries
    entry1 = Entry(product=product1, quantity=100, store=store1)
    entry2 = Entry(product=product2, quantity=50, store=store2)

    # Add and commit
    db.session.add_all([merchant1, merchant2, store1, store2, product1, product2, entry1, entry2])
    db.session.commit()

    print("✅ Database seeded successfully!")
