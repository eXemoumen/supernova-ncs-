import requests
import uuid
import json
import time

# Create a session ID
session_id = str(uuid.uuid4())
print(f"Test session ID: {session_id}")

# Base URL for the API
base_url = "http://localhost:8000"

def make_request(prompt):
    """Make a request to the AGI service and print the response."""
    print(f"\n>>> Sending prompt: '{prompt}'")
    
    response = requests.post(
        f"{base_url}/chat",
        json={
            "session_id": session_id,
            "prompt": prompt
        }
    )
    
    # Print the response
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Response: {result['response']}")
        return result
    else:
        print(f"Error: {response.text}")
        return None

def run_tests():
    """Run a series of tests for the new tools."""
    
    # Test 1: Help command
    print("\n=== Test 1: Help Command ===")
    make_request("help")
    time.sleep(1)
    
    # Test 2: List campaigns
    print("\n=== Test 2: List Campaigns ===")
    make_request("list campaigns")
    time.sleep(1)
    
    # Test 3: Add a campaign
    print("\n=== Test 3: Add Campaign ===")
    make_request("add campaign named Summer Promotion for client Acme Corporation")
    time.sleep(1)
    
    # Test 4: List content ideas
    print("\n=== Test 4: List Content Ideas ===")
    make_request("list content ideas")
    time.sleep(1)
    
    # Test 5: Add a content idea
    print("\n=== Test 5: Add Content Idea ===")
    make_request("add idea titled '10 Ways to Improve Your Marketing' with type blog")
    time.sleep(1)
    
    # Test 6: Get marketing data
    print("\n=== Test 6: Get Marketing Data ===")
    make_request("show marketing data")
    time.sleep(1)

if __name__ == "__main__":
    run_tests()