import pytest
import json

class TestRoutes:
    """Test route endpoints and error handling."""

    def test_create_merchant(self, client):
        """Test POST /api/merchants."""
        data = {"name": "New Merchant", "email": "new@example.com"}
        response = client.post("/api/merchants", json=data)
        assert response.status_code == 201
        assert response.json["name"] == "New Merchant"

    def test_create_merchant_missing_name(self, client):
        """Test missing name in POST /api/merchants."""
        response = client.post("/api/merchants", json={"email": "test@example.com"})
        assert response.status_code == 400

    def test_get_merchants(self, client, sample_merchant):
        """Test GET /api/merchants."""
        response = client.get("/api/merchants")
        assert response.status_code == 200
        assert len(response.json) == 1
        assert response.json[0]["name"] == sample_merchant.name

    def test_create_user(self, client):
        """Test POST /api/register."""
        data = {"username": "testuser", "email": "user@example.com", "password": "password"}
        response = client.post("/api/register", json=data)
        assert response.status_code == 201
        assert response.json["username"] == "testuser"