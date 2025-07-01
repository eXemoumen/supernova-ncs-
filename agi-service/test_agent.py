import asyncio
import json
from agent import process_prompt
import logging
import requests
import uuid

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create a session ID
session_id = str(uuid.uuid4())
print(f"Test session ID: {session_id}")

# Base URL for the API
base_url = "http://localhost:8000"

async def test_agent():
    """
    Test the agent with a few sample prompts.
    """
    print("=== Testing Agi Agent ===\n")
    
    # Test 1: List clients
    print("Test 1: Listing clients")
    response = await process_prompt("list all clients")
    print(f"Response: {response}\n")
    
    # Test 2: Add client
    print("Test 2: Adding a client")
    response = await process_prompt("add a new client named Test Company with niche technology and contact John Doe and email john@example.com")
    print(f"Response: {response}\n")
    
    # Test 3: Update client
    print("Test 3: Updating a client")
    response = await process_prompt("update client with id 1 set name to Updated Company and niche to finance")
    print(f"Response: {response}\n")
    
    # Test 4: Delete client (should request confirmation)
    print("Test 4: Deleting a client (confirmation request)")
    response = await process_prompt("delete client with id 1")
    print(f"Response: {response}\n")
    
    # Test 5: Confirm deletion
    print("Test 5: Confirming deletion")
    response = await process_prompt("confirm delete client with id 1")
    print(f"Response: {response}\n")
    
    # Test 6: Unknown command
    print("Test 6: Unknown command")
    response = await process_prompt("what is the weather today?")
    print(f"Response: {response}\n")
    
    print("=== Test Complete ===")

# Test adding a client
def test_add_client():
    print("\n=== Testing Add Client ===")
    
    # Message to add a new client
    message = "add client named Test Company with niche education with email test@example.com"
    
    # Make the request
    response = requests.post(
        f"{base_url}/chat",
        json={
            "session_id": session_id,
            "prompt": message
        }
    )
    
    # Print the response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.json()

# Test adding a client with specific niche and email
def test_add_client_with_details():
    print("\n=== Testing Add Client With Details ===")
    
    # Message to add a new client with niche and email
    message = "add client named Acme Corporation with niche technology with email contact@acme.com"
    
    # Make the request
    response = requests.post(
        f"{base_url}/chat",
        json={
            "session_id": session_id,
            "prompt": message
        }
    )
    
    # Print the response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.json()

# Test listing clients
def test_list_clients():
    print("\n=== Testing List Clients ===")
    
    # Message to list clients
    message = "list all clients"
    
    # Make the request
    response = requests.post(
        f"{base_url}/chat",
        json={
            "session_id": session_id,
            "prompt": message
        }
    )
    
    # Print the response
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.json()

if __name__ == "__main__":
    # Run the tests
    test_add_client()
    test_add_client_with_details()
    test_list_clients() 