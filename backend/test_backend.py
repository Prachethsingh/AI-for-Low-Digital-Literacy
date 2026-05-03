import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    try:
        resp = requests.get(f"{BASE_URL}/health")
        print(f"Health Check: {resp.status_code} - {resp.json()}")
    except Exception as e:
        print(f"Health Check Failed: {e}")

def test_eligibility():
    payload = {
        "is_farmer": True,
        "has_aadhaar": True,
        "is_woman": True,
        "language": "kannada"
    }
    try:
        resp = requests.post(f"{BASE_URL}/eligibility", json=payload)
        print(f"Eligibility Check: {resp.status_code}")
        data = resp.json()
        print(f"Eligible Schemes: {[s['id'] for s in data['eligible_schemes']]}")
    except Exception as e:
        print(f"Eligibility Check Failed: {e}")

if __name__ == "__main__":
    test_health()
    test_eligibility()
