from config import db, app
from models import *
from faker import Faker
from datetime import datetime
import random
import sqlalchemy as sa

fake = Faker()

# admins, clerks, merchants, stores - merchant, products

with app.app_context():
    
    Merchant.query.delete()
    Store.query.delete()
    Product.query.delete()
    Entry.query.delete()
    SupplyRequest.query.delete()
    Transaction.query.delete()
    User.query.delete()
    db.session.execute(sa.text('DELETE FROM user_stores;'))
    
    db.session.commit()
    
    test_merchant = Merchant(
        name='test_Merchant',
        email='test_Merchant@gmail.com'
    )
    test_merchant.password_hash = 'testing123'
    
    test_admin = User(
        name='test_admin',
        email='test_admin@gmail.com',
        account_type='admin',
    )
    test_admin.password_hash = 'testing123'
    
    test_clerk = User(
        name='test_clerk',
        email='test_clerk@gmail.com',
        account_type='clerk',
    )
    test_clerk.password_hash = 'testing123'
    
    test_merchant.users.extend([test_admin, test_clerk])
    
    db.session.add_all([test_merchant, test_admin, test_clerk])
    db.session.commit()
    
    
    for _ in range(10):
        merchant = Merchant(name=fake.name(), email=fake.email())
        merchant.password_hash = fake.password()
        db.session.add(merchant)
        db.session.commit()
    
    for merchant in Merchant.query.all():
        for _ in range(3):
            store = Store(name=fake.name(), merchant_id=merchant.id, location=fake.address())
            db.session.add(store)
            db.session.commit()
            
    store = Store.query.first()
    store.users.append(test_admin)
    store.users.append(test_clerk)
    db.session.add_all([test_admin, test_clerk])
    db.session.commit()
            
    for store in Store.query.all():
        for _ in range(10):
            product = Product(
                name=fake.name(),
                store_id=store.id,
                quantity_in_stock=random.randrange(4, 10),
                quantity_spoilt=random.randrange(1,3),
                buying_price=random.randrange(5, 20),
                selling_price=random.randrange(10, 25)
            )
            db.session.add(product)
            db.session.commit()
        
        for _ in range(random.randrange(1, 10)):
            entry = Entry(
                quantity=random.randrange(1, 10),
                product_id=random.choice(store.products).id,
                payment_status=random.choice(['pending', 'paid']),
                total_sum=random.randrange(30, 100),
                store_id=store.id,
            )
            db.session.add(entry)
            db.session.commit()
            
        for _ in range(random.randrange(1,4)):
            admin = User(
                name=fake.name(),
                email=fake.email(),
                account_type='admin',
            )
            admin.password_hash = fake.password()
            store.users.append(admin)
            store.merchant.users.append(admin)
            db.session.add(admin)
            db.session.commit()
            
        for _ in range(random.randrange(1,4)):
            clerk = User(
                name=fake.name(),
                email=fake.email(),
                account_type='clerk',
            )
            clerk.password_hash = fake.password()
            store.users.append(clerk)
            store.merchant.users.append(clerk)
            db.session.add(clerk)
            db.session.commit()
            
        
        for _ in range(random.randrange(1, 10)):
            supply_request = SupplyRequest(
                quantity=random.randrange(1, 10),
                product_id=random.choice(store.products).id,
                store_id=store.id,
                status=random.choice(['pending', 'approved', 'declined']),
                user_id=random.choice([x.id for x in store.users if x.account_type == 'clerk'])
            )
            db.session.add(supply_request)
            db.session.commit()
            
        for _ in range(random.randrange(1, 10)):
            transaction = Transaction(
                quantity=random.randrange(1, 10),
                product_id=random.choice(store.products).id,
                store_id=store.id,
                unit_price=random.randrange(1, 20),
            )
            db.session.add(transaction)
            db.session.commit()