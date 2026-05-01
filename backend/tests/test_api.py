import pytest
from src.app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config.update({
        "TESTING": True,
    })
    # Disable rate limiter for testing
    from src.extensions import limiter
    limiter.enabled = False
    
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json["status"] == "healthy"

def test_get_booths_no_pincode(client):
    response = client.get("/api/booth")
    assert response.status_code == 400

def test_get_booths_invalid_pincode(client):
    response = client.get("/api/booth?pincode=invalid")
    assert response.status_code == 400

def test_get_booths_valid_mock(client):
    response = client.get("/api/booth?pincode=110001")
    assert response.status_code == 200
    data = response.json
    assert "booths" in data
    assert len(data["booths"]) > 0

def test_chat_missing_query(client):
    response = client.post("/api/chat", json={})
    assert response.status_code == 400
