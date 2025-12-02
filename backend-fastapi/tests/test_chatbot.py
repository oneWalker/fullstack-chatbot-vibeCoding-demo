import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/chatbot/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "message" in data

def test_send_message_validation():
    """Test message validation"""
    # Test missing fields
    response = client.post("/chatbot/message", json={})
    assert response.status_code == 422  # Validation error

def test_conversation_endpoints_validation():
    """Test conversation endpoints validation"""
    # Test with invalid conversation ID
    response = client.get("/chatbot/history/")
    assert response.status_code == 404  # Not found

    # Test delete with invalid conversation ID
    response = client.post("/chatbot/conversations//delete")
    assert response.status_code == 404  # Not found