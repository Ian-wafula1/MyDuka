from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy_serializer import SerializerMixin
from config import db

class Entry(db.Model, SerializerMixin):
    __tablename__ = 'entries'

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)  # Positive (add stock) / Negative (remove/spoilage)
    payment_status = db.Column(db.String(20), default='unpaid')  # 'paid', 'unpaid', 'partial'
    total_sum = db.Column(db.Float, nullable=False) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Foreign Keys (enforce integrity)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))

    # Relationships
    store = db.relationship('Store', back_populates='entries')
    product = db.relationship('Product', back_populates='entries')
    
    serialize_rules = ('-store', '-product')

    def __repr__(self):
        return f'<Entry {self.id} (Product: {self.product_id}, Qty: {self.quantity})>'

    # --- Core Methods ---
    def validate(self):
        """Validate entry data before saving."""
        if not self.product:
            raise ValueError("Product does not exist.")
        if self.quantity == 0:
            raise ValueError("Quantity cannot be zero.")
        if self.total_sum < 0:
            raise ValueError("Total sum must be non-negative.")

    def calculate_total(self):
        """Compute total_sum based on product's buying_price."""
        if self.product:
            self.total_sum = abs(self.quantity) * self.product.buying_price

    def update_stock(self):
        """Adjust product stock/spoilage levels atomically."""
        if self.quantity > 0:
            self.product.quantity_in_stock += self.quantity
        else:
            self.product.quantity_spoilt += abs(self.quantity)

    # --- Static/Bulk Methods ---
    @staticmethod
    def create_single_entry(data):
        """Process and commit a single entry with error handling."""
        try:
            entry = Entry(**data)
            entry.calculate_total()
            entry.validate()
            entry.update_stock()
            db.session.add(entry)
            db.session.commit()
            return entry
        except (ValueError, SQLAlchemyError) as e:
            db.session.rollback()
            raise e

    @staticmethod
    def create_bulk_entries(entries_data):
        """Process multiple entries in a single transaction."""
        try:
            entries = []
            for data in entries_data:
                entry = Entry(**data)
                entry.calculate_total()
                entry.validate()
                entry.update_stock()
                entries.append(entry)
                db.session.add(entry)
            db.session.commit()
            return entries
        except (ValueError, SQLAlchemyError) as e:
            db.session.rollback()
            raise e
