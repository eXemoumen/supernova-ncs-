import httpx
import logging

logger = logging.getLogger(__name__)

# Base URL for the backend API
API_BASE_URL = "http://localhost:3001/api"

# Client Tools
async def list_clients(params=None):
    """
    Returns a list of all clients in the database.
    """
    async with httpx.AsyncClient() as client:
        try:
            logger.info("Calling backend API to list clients")
            response = await client.get(f"{API_BASE_URL}/clients")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error listing clients: {e}")
            raise

async def get_client(params):
    """
    Gets a specific client by ID.
    """
    client_id = params.get("id")
    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Getting client with ID: {client_id}")
            response = await client.get(f"{API_BASE_URL}/clients/{client_id}")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error getting client: {e}")
            raise

async def add_client(params):
    """
    Adds a new client to the database.
    """
    # Ensure niche is always provided to avoid not-null constraint
    if "niche" not in params or params["niche"] is None:
        params["niche"] = ""  # Default empty string if not provided
        
    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Adding new client: {params}")
            response = await client.post(f"{API_BASE_URL}/clients", json=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error adding client: {e}")
            raise

async def update_client(params):
    """
    Updates an existing client.
    """
    client_id = params.pop("id")
    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Updating client {client_id}: {params}")
            response = await client.put(f"{API_BASE_URL}/clients/{client_id}", json=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error updating client: {e}")
            raise

async def delete_client(params):
    """
    Deletes a client from the database.
    """
    client_id = params.get("id")
    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Deleting client {client_id}")
            response = await client.delete(f"{API_BASE_URL}/clients/{client_id}")
            response.raise_for_status()
            return response.status_code
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error deleting client: {e}")
            raise

# Campaign Tools
async def list_campaigns(params=None):
    """
    Returns a list of all campaigns in the database.
    """
    async with httpx.AsyncClient() as client:
        try:
            logger.info("Calling backend API to list campaigns")
            response = await client.get(f"{API_BASE_URL}/campaigns")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error listing campaigns: {e}")
            raise

async def get_campaign(params):
    """
    Gets a specific campaign by ID.
    """
    campaign_id = params.get("id")
    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Getting campaign with ID: {campaign_id}")
            response = await client.get(f"{API_BASE_URL}/campaigns/{campaign_id}")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error getting campaign: {e}")
            raise

async def add_campaign(params):
    """
    Adds a new campaign to the database.
    """
    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Adding new campaign: {params}")
            response = await client.post(f"{API_BASE_URL}/campaigns", json=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error adding campaign: {e}")
            raise

# Content Ideas Tools
async def list_content_ideas(params=None):
    """
    Returns a list of all content ideas in the database.
    """
    async with httpx.AsyncClient() as client:
        try:
            logger.info("Calling backend API to list content ideas")
            response = await client.get(f"{API_BASE_URL}/content-ideas")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error listing content ideas: {e}")
            raise

async def get_content_idea(params):
    """
    Gets a specific content idea by ID.
    """
    idea_id = params.get("id")
    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Getting content idea with ID: {idea_id}")
            response = await client.get(f"{API_BASE_URL}/content-ideas/{idea_id}")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error getting content idea: {e}")
            raise

async def add_content_idea(params):
    """
    Adds a new content idea to the database.
    """
    async with httpx.AsyncClient() as client:
        try:
            logger.info(f"Adding new content idea: {params}")
            response = await client.post(f"{API_BASE_URL}/content-ideas", json=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error adding content idea: {e}")
            raise

# Marketing Data Tools
async def get_marketing_data(params=None):
    """
    Returns marketing performance data.
    """
    async with httpx.AsyncClient() as client:
        try:
            logger.info("Calling backend API to get marketing data")
            response = await client.get(f"{API_BASE_URL}/marketing-data")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error getting marketing data: {e}")
            raise

def get_tools():
    """
    Returns a list of all available tools with their metadata.
    This registry is used by the agent to determine which tool to use.
    """
    return [
        # Client Tools
        {
            "name": "list_clients",
            "description": "Returns a list of all clients in the database.",
            "parameters": {},
            "execute": list_clients,
        },
        {
            "name": "get_client",
            "description": "Gets a specific client by ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "description": "The ID of the client to retrieve"},
                },
                "required": ["id"]
            },
            "execute": get_client,
        },
        {
            "name": "add_client",
            "description": "Adds a new client to the database.",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "The name of the client"},
                    "niche": {"type": "string", "description": "The client's industry niche"},
                    "contact_person": {"type": "string", "description": "Primary contact person"},
                    "contact_email": {"type": "string", "description": "Contact email address"},
                    "notes": {"type": "string", "description": "Additional notes about the client"},
                },
                "required": ["name"]
            },
            "execute": add_client,
        },
        {
            "name": "update_client",
            "description": "Updates an existing client in the database.",
            "parameters": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "description": "The ID of the client to update"},
                    "name": {"type": "string", "description": "The updated name of the client"},
                    "niche": {"type": "string", "description": "The updated industry niche"},
                    "contact_person": {"type": "string", "description": "Updated contact person"},
                    "contact_email": {"type": "string", "description": "Updated email address"},
                    "notes": {"type": "string", "description": "Updated notes about the client"},
                },
                "required": ["id"]
            },
            "execute": update_client,
        },
        {
            "name": "delete_client",
            "description": "Deletes a client from the database.",
            "parameters": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "description": "The ID of the client to delete"},
                },
                "required": ["id"]
            },
            "execute": delete_client,
            "requires_confirmation": True,
        },
        
        # Campaign Tools
        {
            "name": "list_campaigns",
            "description": "Returns a list of all marketing campaigns in the database.",
            "parameters": {},
            "execute": list_campaigns,
        },
        {
            "name": "get_campaign",
            "description": "Gets a specific marketing campaign by ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "description": "The ID of the campaign to retrieve"},
                },
                "required": ["id"]
            },
            "execute": get_campaign,
        },
        {
            "name": "add_campaign",
            "description": "Adds a new marketing campaign to the database.",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "The name of the campaign"},
                    "status": {"type": "string", "description": "Campaign status (active, draft, completed)"},
                    "budget": {"type": "string", "description": "The campaign budget"},
                    "startDate": {"type": "string", "description": "Start date of the campaign (YYYY-MM-DD)"},
                    "endDate": {"type": "string", "description": "End date of the campaign (YYYY-MM-DD)"},
                    "targetAudience": {"type": "string", "description": "Target audience description"},
                    "channels": {"type": "array", "description": "Marketing channels for the campaign"},
                    "client": {"type": "string", "description": "The client this campaign is for"},
                    "niche": {"type": "string", "description": "The industry niche for this campaign"},
                },
                "required": ["name", "client"]
            },
            "execute": add_campaign,
        },
        
        # Content Ideas Tools
        {
            "name": "list_content_ideas",
            "description": "Returns a list of all content ideas in the database.",
            "parameters": {},
            "execute": list_content_ideas,
        },
        {
            "name": "get_content_idea",
            "description": "Gets a specific content idea by ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "description": "The ID of the content idea to retrieve"},
                },
                "required": ["id"]
            },
            "execute": get_content_idea,
        },
        {
            "name": "add_content_idea",
            "description": "Adds a new content idea to the database.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "The title of the content idea"},
                    "type": {"type": "string", "description": "Type of content (blog, social, email, video, other)"},
                    "status": {"type": "string", "description": "Status of the idea (new, approved, deleted)"},
                    "priority": {"type": "string", "description": "Priority level (low, medium, high)"},
                    "client": {"type": "string", "description": "The client this content is for"},
                    "niche": {"type": "string", "description": "The industry niche for this content"},
                },
                "required": ["title", "type"]
            },
            "execute": add_content_idea,
        },
        
        # Marketing Data Tools
        {
            "name": "get_marketing_data",
            "description": "Returns marketing performance data.",
            "parameters": {},
            "execute": get_marketing_data,
        },
    ] 