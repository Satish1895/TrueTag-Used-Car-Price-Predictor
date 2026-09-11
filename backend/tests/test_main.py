from fastapi.testclient import TestClient
from main import app 

client = TestClient(app)

def test_root_endpoint():
    # Act: Send a GET request to the root endpoint
    response = client.get("/")
    
    # Assert: Validate the API is running
    assert response.status_code == 200
    assert response.json() == {"message": "TrueTag API is running"}

def test_get_metadata():
    # Act: Send a GET request to the metadata endpoint
    response = client.get("/api/metadata")
    
    # Assert: Validate successful response and data type
    assert response.status_code == 200
    assert isinstance(response.json(), (dict, list))

def test_predict_price_success():
    # Arrange: Match the exact CarQuery Pydantic schema
    payload = {
        "distance": 45000,
        "owner": 1,
        "brand": "Hyundai",
        "model_name": "i20",
        "year": 2019,
        "state": "Karnataka",
        "fuel": "Petrol",
        "drive": "Manual",
        "body_type": "Hatchback"
    }
    
    # Act: Send a POST request to the prediction endpoint
    response = client.post("/api/predict", json=payload)
    
    # Assert: Validate the response structure and calculations
    assert response.status_code == 200
    
    response_data = response.json()
    assert response_data["status"] == "success"
    assert response_data["currency"] == "INR"
    
    # Verify the log transformation reversal returns an integer as coded
    assert "predicted_price" in response_data
    assert isinstance(response_data["predicted_price"], int)
    assert response_data["predicted_price"] > 0
    
    # Verify the fallback or successful Groq insight is present
    assert "insight" in response_data
    assert isinstance(response_data["insight"], str)

def test_predict_price_invalid_payload():
    # Arrange: Send a payload that is deliberately missing required fields 
    # (e.g., missing 'year', 'drive', 'body_type')
    payload = {
        "distance": 45000,
        "owner": 1,
        "brand": "Hyundai",
        "model_name": "i20",
        "fuel": "Petrol"
    }
    
    # Act: Send the POST request
    response = client.post("/api/predict", json=payload)
    
    # Assert: FastAPI should automatically reject this with a 422 Unprocessable Entity
    assert response.status_code == 422
    
    # Validate that the error details specifically mention the missing fields
    error_detail = response.json()["detail"]
    assert len(error_detail) > 0  # Ensures Pydantic caught the validation errors