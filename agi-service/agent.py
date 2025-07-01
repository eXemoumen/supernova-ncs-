import logging
import re
import json
from typing import Dict, Any, List, Optional, Tuple
import tools
import asyncio

logger = logging.getLogger(__name__)

# Regular expressions for parsing user commands
REGEX_PATTERNS = {
    # Client patterns
    "list_clients": r"(?i)^(?:list|show|get)\s+(?:all\s+)?clients$",
    "get_client": r"(?i)^(?:tell|show|get|give)\s+(?:me\s+)?(?:about|details\s+(?:for|about)|info(?:rmation)?\s+(?:for|about)|details\s+on)?\s+client\s+(?:with\s+id\s+)?(\d+)$",
    "add_client": r"(?i)^(?:add|create)\s+(?:a\s+)?(?:new\s+)?client\s+(?:named|called|with\s+name\s+)?\s*([^,]+?)(?:\s+with\s+niche\s+([^,]+?))?(?:\s+with\s+(?:email|contact|contact\s+email)\s+([^,]+?))?$",
    "update_client": r"(?i)^(?:update|change|modify)\s+client\s+(?:with\s+id\s+)?(\d+)\s+(?:set|change)\s+(\w+)\s+(?:to|as)\s+(.+)$",
    "delete_client": r"(?i)^(?:delete|remove)\s+client\s+(?:with\s+id\s+)?(\d+)$",
    
    # Campaign patterns
    "list_campaigns": r"(?i)^(?:list|show|get)\s+(?:all\s+)?campaigns$",
    "get_campaign": r"(?i)^(?:tell|show|get|give)\s+(?:me\s+)?(?:about|details\s+(?:for|about)|info(?:rmation)?\s+(?:for|about)|details\s+on)?\s+campaign\s+(?:with\s+id\s+)?(\d+)$",
    "add_campaign": r"(?i)^(?:add|create)\s+(?:a\s+)?(?:new\s+)?campaign\s+(?:named|called|with\s+name\s+)?\s*([^,]+?)(?:\s+for\s+client\s+([^,]+?))?(?:\s+with\s+(?:status|budget|start|end)\s+([^,]+?))?$",
    
    # Content idea patterns
    "list_content_ideas": r"(?i)^(?:list|show|get)\s+(?:all\s+)?(?:content\s+)?ideas$",
    "get_content_idea": r"(?i)^(?:tell|show|get|give)\s+(?:me\s+)?(?:about|details\s+(?:for|about)|info(?:rmation)?\s+(?:for|about)|details\s+on)?\s+(?:content\s+)?idea\s+(?:with\s+id\s+)?(\d+)$",
    "add_content_idea": r"(?i)^(?:add|create)\s+(?:a\s+)?(?:new\s+)?(?:content\s+)?idea\s+(?:titled|called|with\s+title\s+)?\s*([^,]+?)(?:\s+with\s+type\s+([^,]+?))?(?:\s+for\s+client\s+([^,]+?))?$",
    
    # Marketing data pattern
    "get_marketing_data": r"(?i)^(?:get|show|display)\s+(?:marketing\s+)?(?:data|performance|stats|analytics|metrics)$",
    
    # Help pattern
    "help": r"(?i)^(?:help|commands|what can you do|how to use)$"
}

def process_prompt(prompt: str, session_id: str, conversation_history: List[Dict[str, Any]]) -> Tuple[str, Dict[str, Any]]:
    """
    Process the user prompt to determine which tool to use and extract parameters.
    Returns a tuple of (tool_name, parameters).
    """
    logger.info(f"Processing prompt: {prompt}")
    
    # Use conversation history to enhance context understanding
    context = extract_context_from_history(conversation_history)
    
    # Try to match specific patterns for different tools
    if re.search(r'list\s+clients?', prompt, re.IGNORECASE):
        return "list_clients", {}
    
    # Add client pattern - fixed the regex pattern to use 'name' instead of 'n'
    add_client_match = re.search(r'add\s+(a\s+)?(new\s+)?client\s+(named|called)?\s+(?P<name>[^,\.]+)(\s+with\s+niche\s+(?P<niche>[^,\.]+))?(\s+(with\s+)?(contact|email)\s+(?P<email>[^,\.]+))?', prompt, re.IGNORECASE)
    if add_client_match:
        params = {
            "name": add_client_match.group('name').strip() if add_client_match.group('name') else None,
            "niche": add_client_match.group('niche').strip() if add_client_match.group('niche') else None,
            "contact_email": add_client_match.group('email').strip() if add_client_match.group('email') else None
        }
        return "add_client", {k: v for k, v in params.items() if v is not None}
    
    # Update client pattern
    update_client_match = re.search(r'update\s+client\s+(with\s+)?id\s+(?P<id>\d+)\s+set\s+(?P<field>\w+)\s+to\s+(?P<value>[^,\.]+)', prompt, re.IGNORECASE)
    if update_client_match:
        client_id = update_client_match.group('id').strip()
        field = update_client_match.group('field').strip()
        value = update_client_match.group('value').strip()
        
        params = {"id": client_id}
        params[field] = value
        return "update_client", params
    
    # Delete client pattern
    delete_client_match = re.search(r'delete\s+client\s+(with\s+)?id\s+(?P<id>\d+)', prompt, re.IGNORECASE)
    if delete_client_match:
        client_id = delete_client_match.group('id').strip()
        return "delete_client", {"id": client_id}
    
    # Get client details pattern - new functionality
    get_client_match = re.search(r'(tell\s+me\s+about|get|show|display)\s+client\s+(with\s+)?id\s+(?P<id>\d+)', prompt, re.IGNORECASE)
    if get_client_match:
        client_id = get_client_match.group('id').strip()
        return "get_client_details", {"id": client_id}
    
    # Handle references to entities from previous conversation
    if context and "clients" in context:
        # Check for references to clients by name
        for client in context["clients"]:
            if client["name"].lower() in prompt.lower():
                if "niche" in prompt.lower() or "industry" in prompt.lower():
                    return "respond", {"message": f"The niche for {client['name']} is: {client['niche']}"}
                if "email" in prompt.lower() or "contact" in prompt.lower():
                    return "respond", {"message": f"The contact email for {client['name']} is: {client['contact_email']}"}
                return "get_client_details", {"id": str(client["id"])}
        
        # Check for references to clients by ID
        id_match = re.search(r'(client|id)\s+(\#|number\s+)?(\d+)', prompt, re.IGNORECASE)
        if id_match:
            client_id = id_match.group(3)
            for client in context["clients"]:
                if str(client["id"]) == client_id:
                    if "niche" in prompt.lower() or "industry" in prompt.lower():
                        return "respond", {"message": f"The niche for client #{client_id} ({client['name']}) is: {client['niche']}"}
                    if "email" in prompt.lower() or "contact" in prompt.lower():
                        return "respond", {"message": f"The contact email for client #{client_id} ({client['name']}) is: {client['contact_email']}"}
                    return "get_client_details", {"id": client_id}
    
    # Help command
    if re.search(r'^help$', prompt, re.IGNORECASE):
        help_message = """
### Available Commands

**Client Management:**
- `list clients` - Show all clients
- `add client named [name] with niche [industry] with email [email]` - Add a new client
- `update client with id [ID] set [field] to [value]` - Update client information
- `delete client with id [ID]` - Remove a client
- `tell me about client with id [ID]` - Get detailed client information

You can also refer to clients by their ID or name in follow-up questions, such as:
- "What is the niche of client 5?"
- "Tell me the email for Acme Inc"
"""
        return "respond", {"message": help_message}
    
    # If no specific intent is detected, provide a helpful response
    logger.warning(f"No matching tool found for prompt: {prompt}")
    return "respond", {"message": "I'm sorry, I don't understand that request. You can try:\n- 'List clients'\n- 'Add a new client named Acme Inc with niche technology'\n- 'Update client with id 123 set name to Acme Technologies'\n- 'Delete client with id 123'\n- 'Tell me about client with id 123'\n- Type 'help' to see all available commands"}

def extract_context_from_history(conversation_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Extract relevant context from conversation history.
    """
    context = {}
    
    # Look for client list responses in the conversation history
    for message in reversed(conversation_history):
        if message["role"] == "assistant" and "### Client List" in message["content"]:
            # Try to parse client information from the formatted response
            clients = []
            client_blocks = re.findall(r'\d+\.\s+\*\*([^*]+)\*\*\s+- ID:\s+(\d+).*?(?=\d+\.\s+\*\*|$)', message["content"], re.DOTALL)
            
            for client_block in client_blocks:
                client_name = client_block[0].strip()
                client_id = client_block[1].strip()
                
                # Extract other details
                niche_match = re.search(r'Niche:\s+([^\n]+)', client_block[0], re.DOTALL)
                email_match = re.search(r'Email:\s+([^\n]+)', client_block[0], re.DOTALL)
                
                client = {
                    "id": int(client_id),
                    "name": client_name,
                    "niche": niche_match.group(1).strip() if niche_match else "",
                    "contact_email": email_match.group(1).strip() if email_match else ""
                }
                clients.append(client)
            
            if clients:
                context["clients"] = clients
                break
        
        # Also look for individual client additions
        elif message["role"] == "assistant" and "Successfully added client:" in message["content"]:
            client_match = re.search(r'Successfully added client:\s+\*\*([^*]+)\*\*\s+with ID:\s+\*\*(\d+)\*\*', message["content"])
            if client_match:
                client_name = client_match.group(1).strip()
                client_id = client_match.group(2).strip()
                
                if "clients" not in context:
                    context["clients"] = []
                
                context["clients"].append({
                    "id": int(client_id),
                    "name": client_name,
                    "niche": "",  # We don't have this info from the success message
                    "contact_email": ""
                })
    
    return context

async def execute_tool(tool_name: str, parameters: Dict[str, Any], session_id: str, conversation_history: List[Dict[str, Any]]) -> Any:
    """
    Execute the selected tool with the given parameters.
    """
    logger.info(f"Executing tool: {tool_name} with parameters: {parameters}")
    
    # Special case for the "respond" tool which just returns a message
    if tool_name == "respond":
        return parameters.get("message", "I don't understand that request.")
    
    # Special case for the new get_client_details tool
    if tool_name == "get_client_details":
        client_id = parameters.get("id")
        try:
            # Use the current event loop and await the coroutine directly
            client_result = await tools.get_client({"id": client_id})
            
            if client_result:
                # Format a nice response
                response = f"### Client Details\n\n"
                response += f"**{client_result['name']}** (ID: {client_result['id']})\n\n"
                response += f"- **Niche:** {client_result['niche'] or 'Not specified'}\n"
                response += f"- **Contact Person:** {client_result['contact_person'] or 'Not specified'}\n"
                response += f"- **Contact Email:** {client_result['contact_email'] or 'Not specified'}\n"
                response += f"- **Notes:** {client_result['notes'] or 'None'}\n"
                
                if client_result.get('industry'):
                    response += f"- **Industry:** {client_result['industry']}\n"
                if client_result.get('satisfaction') is not None:
                    response += f"- **Satisfaction:** {client_result['satisfaction']}\n"
                if client_result.get('tier'):
                    response += f"- **Tier:** {client_result['tier']}\n"
                
                response += f"\n*Created: {client_result['created_at']}*\n"
                response += f"*Last Updated: {client_result['updated_at']}*"
                
                # Add proactive suggestions
                response += "\n\n---\n\n**What would you like to do next?**\n"
                response += f"- Update this client's information\n"
                response += f"- Delete this client\n"
                response += f"- List all clients\n"
                response += f"- Add a campaign for this client\n"
                
                return response
            else:
                return f"I couldn't find a client with ID {client_id}. Please check the ID and try again."
        except Exception as e:
            logger.error(f"Error executing get_client_details: {e}")
            return f"Sorry, I encountered an error while trying to get client details: {str(e)}"
    
    # For other tools, find the tool in the registry and execute it
    available_tools = tools.get_tools()
    tool = next((t for t in available_tools if t["name"] == tool_name), None)
    
    if not tool:
        logger.error(f"Tool not found: {tool_name}")
        return f"Error: Tool '{tool_name}' not found."
    
    try:
        # Await the coroutine directly
        result = await tool["execute"](parameters)
        logger.info(f"Tool execution result: {result}")
        
        # Format the response based on the tool and result
        if tool_name == "list_clients":
            if not result:
                response = "No clients found."
            else:
                response = "### Client List\n"
                for i, client in enumerate(result, 1):
                    response += f"{i}. **{client['name']}**\n"
                    response += f"   - ID: {client['id']}\n"
                    response += f"   - Niche: {client['niche'] or 'Not specified'}\n"
                    if client.get('contact_person'):
                        response += f"   - Contact: {client['contact_person']}\n"
                    if client.get('contact_email'):
                        response += f"   - Email: {client['contact_email']}\n"
                
                # Add proactive suggestions
                response += "\n---\n\n**What would you like to do next?**\n"
                response += "- Add a new client\n"
                response += "- Get details about a specific client\n"
                response += "- Update a client's information\n"
                response += "- List campaigns\n"
            
            return response
        
        elif tool_name == "add_client":
            response = f"### Client Added\nSuccessfully added client: **{result['name']}** with ID: **{result['id']}**"
            
            # Add proactive suggestions
            response += "\n\n---\n\n**What would you like to do next?**\n"
            response += "- Add another client\n"
            response += f"- Update this client's information\n"
            response += "- List all clients\n"
            response += f"- Add a campaign for this client\n"
            
            return response
        
        elif tool_name == "update_client":
            return f"Client updated successfully! The changes have been applied to the client record."
        
        elif tool_name == "delete_client":
            return f"Client deleted successfully. The client has been removed from the database."
        
        # Campaign tools
        elif tool_name == "list_campaigns":
            if not result:
                response = "No campaigns found."
            else:
                response = "### Campaign List\n"
                for i, campaign in enumerate(result, 1):
                    response += f"{i}. **{campaign['name']}**\n"
                    response += f"   - ID: {campaign['id']}\n"
                    response += f"   - Status: {campaign['status'] or 'Not specified'}\n"
                    response += f"   - Client: {campaign['client'] or 'Not specified'}\n"
                    if campaign.get('budget'):
                        response += f"   - Budget: {campaign['budget']}\n"
                    if campaign.get('startDate'):
                        response += f"   - Start Date: {campaign['startDate']}\n"
                    if campaign.get('endDate'):
                        response += f"   - End Date: {campaign['endDate']}\n"
                
                # Add proactive suggestions
                response += "\n---\n\n**What would you like to do next?**\n"
                response += "- Add a new campaign\n"
                response += "- Get details about a specific campaign\n"
                response += "- List content ideas\n"
            
            return response
        
        elif tool_name == "get_campaign":
            if not result:
                return f"I couldn't find a campaign with ID {parameters.get('id')}. Please check the ID and try again."
            
            campaign = result
            response = f"### Campaign Details\n\n"
            response += f"**{campaign['name']}** (ID: {campaign['id']})\n\n"
            response += f"- **Status:** {campaign['status'] or 'Not specified'}\n"
            response += f"- **Client:** {campaign['client'] or 'Not specified'}\n"
            response += f"- **Budget:** {campaign['budget'] or 'Not specified'}\n"
            response += f"- **Start Date:** {campaign['startDate'] or 'Not specified'}\n"
            response += f"- **End Date:** {campaign['endDate'] or 'Not specified'}\n"
            response += f"- **Target Audience:** {campaign['targetAudience'] or 'Not specified'}\n"
            
            if campaign.get('channels'):
                channels = campaign['channels']
                if isinstance(channels, list):
                    response += f"- **Channels:** {', '.join(channels)}\n"
                else:
                    response += f"- **Channels:** {channels}\n"
            
            # Add proactive suggestions
            response += "\n\n---\n\n**What would you like to do next?**\n"
            response += f"- List all campaigns\n"
            response += f"- Add content ideas for this campaign\n"
            response += f"- View marketing data\n"
            
            return response
        
        elif tool_name == "add_campaign":
            response = f"### Campaign Added\nSuccessfully added campaign: **{result['name']}** with ID: **{result['id']}**"
            
            # Add proactive suggestions
            response += "\n\n---\n\n**What would you like to do next?**\n"
            response += "- Add another campaign\n"
            response += f"- Add content ideas for this campaign\n"
            response += "- List all campaigns\n"
            
            return response
        
        # Content Ideas tools
        elif tool_name == "list_content_ideas":
            if not result:
                response = "No content ideas found."
            else:
                response = "### Content Ideas List\n"
                for i, idea in enumerate(result, 1):
                    response += f"{i}. **{idea['title']}**\n"
                    response += f"   - ID: {idea['id']}\n"
                    response += f"   - Type: {idea['type'] or 'Not specified'}\n"
                    response += f"   - Status: {idea['status'] or 'New'}\n"
                    response += f"   - Priority: {idea['priority'] or 'Medium'}\n"
                    if idea.get('client'):
                        response += f"   - Client: {idea['client']}\n"
                
                # Add proactive suggestions
                response += "\n---\n\n**What would you like to do next?**\n"
                response += "- Add a new content idea\n"
                response += "- Get details about a specific idea\n"
                response += "- List campaigns\n"
            
            return response
        
        elif tool_name == "get_content_idea":
            if not result:
                return f"I couldn't find a content idea with ID {parameters.get('id')}. Please check the ID and try again."
            
            idea = result
            response = f"### Content Idea Details\n\n"
            response += f"**{idea['title']}** (ID: {idea['id']})\n\n"
            response += f"- **Type:** {idea['type'] or 'Not specified'}\n"
            response += f"- **Status:** {idea['status'] or 'New'}\n"
            response += f"- **Priority:** {idea['priority'] or 'Medium'}\n"
            response += f"- **Client:** {idea['client'] or 'Not specified'}\n"
            
            # Add proactive suggestions
            response += "\n\n---\n\n**What would you like to do next?**\n"
            response += f"- List all content ideas\n"
            response += f"- Add another content idea\n"
            
            return response
        
        elif tool_name == "add_content_idea":
            response = f"### Content Idea Added\nSuccessfully added content idea: **{result['title']}** with ID: **{result['id']}**"
            
            # Add proactive suggestions
            response += "\n\n---\n\n**What would you like to do next?**\n"
            response += "- Add another content idea\n"
            response += "- List all content ideas\n"
            response += "- View marketing data\n"
            
            return response
        
        # Marketing Data tools
        elif tool_name == "get_marketing_data":
            if not result:
                response = "No marketing data available."
            else:
                response = "### Marketing Performance Data\n\n"
                response += "| Month | Revenue | Spend | ROI | Client |\n"
                response += "|-------|---------|-------|-----|--------|\n"
                
                for data in result:
                    response += f"| {data['month']} | ${data['revenue']} | ${data['spend']} | {data['roi']}x | {data['client']} |\n"
                
                # Add proactive suggestions
                response += "\n---\n\n**What would you like to do next?**\n"
                response += "- List campaigns\n"
                response += "- List content ideas\n"
                response += "- List clients\n"
            
            return response
        
        # Generic response for other tools
        return f"Operation completed successfully. Result: {result}"
    
    except Exception as e:
        logger.error(f"Error executing tool {tool_name}: {e}")
        return f"Sorry, I encountered an error: {str(e)}"

async def process_prompt(prompt: str, session_id: str, conversation_history: List[Dict[str, Any]]) -> str:
    """
    Process a user prompt and determine which tool to use.
    """
    logger.info(f"Processing prompt: {prompt}")
    
    tool_name, parameters = select_tool(prompt, conversation_history)
    
    if tool_name:
        logger.info(f"Selected tool: {tool_name}, parameters: {parameters}")
        result = await execute_tool(tool_name, parameters, session_id, conversation_history)
        return result
    else:
        logger.warning(f"No matching tool found for prompt: {prompt}")
        return "I'm sorry, I don't understand that request. You can try:\n- 'List clients'\n- 'Add a new client named Acme Inc with niche technology'\n- 'Update client with id 123 set name to Acme Technologies'\n- 'Delete client with id 123'\n- 'Tell me about client with id 123'\n- Type 'help' to see all available commands"

def select_tool(prompt: str, conversation_history: List[Dict[str, Any]]) -> Tuple[Optional[str], Dict[str, Any]]:
    """
    Select the appropriate tool based on the user prompt.
    Returns a tuple of (tool_name, parameters).
    """
    # Check for help command
    if re.match(REGEX_PATTERNS["help"], prompt):
        return "respond", {
            "message": """
### Available Commands

**Client Management:**
- `list clients` - Show all clients
- `add client named [name] with niche [industry] with email [email]` - Add a new client
- `update client with id [ID] set [field] to [value]` - Update client information
- `delete client with id [ID]` - Remove a client
- `tell me about client with id [ID]` - Get detailed client information

**Campaign Management:**
- `list campaigns` - Show all campaigns
- `add campaign named [name] for client [client]` - Add a new campaign
- `tell me about campaign with id [ID]` - Get detailed campaign information

**Content Ideas:**
- `list ideas` - Show all content ideas
- `add idea titled [title] with type [type] for client [client]` - Add a new content idea
- `tell me about idea with id [ID]` - Get detailed content idea information

**Marketing Data:**
- `show marketing data` - Display marketing performance data

You can also refer to clients by their ID or name in follow-up questions, such as:
- "What is the niche of client 5?"
- "Tell me the email for Acme Inc"
"""
        }
    
    # CLIENT TOOLS
    # Check for list clients command
    if re.match(REGEX_PATTERNS["list_clients"], prompt):
        return "list_clients", {}
    
    # Check for get client details command
    match = re.match(REGEX_PATTERNS["get_client"], prompt)
    if match:
        client_id = match.group(1)
        return "get_client_details", {"id": client_id}
    
    # Check for add client command
    match = re.match(REGEX_PATTERNS["add_client"], prompt)
    if match:
        name = match.group(1).strip()
        niche = match.group(2).strip() if match.group(2) else ""
        email = match.group(3).strip() if match.group(3) else ""
        
        parameters = {"name": name}
        if niche:
            parameters["niche"] = niche
        if email:
            parameters["contact_email"] = email
            
        return "add_client", parameters
    
    # Check for update client command
    match = re.match(REGEX_PATTERNS["update_client"], prompt)
    if match:
        client_id = match.group(1)
        field = match.group(2).strip()
        value = match.group(3).strip()
        
        # Map user-friendly field names to actual database fields
        field_mapping = {
            "name": "name",
            "niche": "niche",
            "email": "contact_email",
            "contact": "contact_person",
            "notes": "notes",
        }
        
        db_field = field_mapping.get(field.lower(), field.lower())
        
        parameters = {
            "id": client_id,
            db_field: value
        }
        
        return "update_client", parameters
    
    # Check for delete client command
    match = re.match(REGEX_PATTERNS["delete_client"], prompt)
    if match:
        client_id = match.group(1)
        return "delete_client", {"id": client_id}
    
    # CAMPAIGN TOOLS
    # Check for list campaigns command
    if re.match(REGEX_PATTERNS["list_campaigns"], prompt):
        return "list_campaigns", {}
    
    # Check for get campaign details command
    match = re.match(REGEX_PATTERNS["get_campaign"], prompt)
    if match:
        campaign_id = match.group(1)
        return "get_campaign", {"id": campaign_id}
    
    # Check for add campaign command
    match = re.match(REGEX_PATTERNS["add_campaign"], prompt)
    if match:
        name = match.group(1).strip()
        client = match.group(2).strip() if match.group(2) else ""
        additional_info = match.group(3).strip() if match.group(3) else ""
        
        parameters = {"name": name}
        if client:
            parameters["client"] = client
        if additional_info:
            # Try to determine if it's status, budget, etc.
            if "budget" in prompt.lower():
                parameters["budget"] = additional_info
            elif "status" in prompt.lower():
                parameters["status"] = additional_info
            elif "start" in prompt.lower():
                parameters["startDate"] = additional_info
            elif "end" in prompt.lower():
                parameters["endDate"] = additional_info
            
        return "add_campaign", parameters
    
    # CONTENT IDEAS TOOLS
    # Check for list content ideas command
    if re.match(REGEX_PATTERNS["list_content_ideas"], prompt):
        return "list_content_ideas", {}
    
    # Check for get content idea details command
    match = re.match(REGEX_PATTERNS["get_content_idea"], prompt)
    if match:
        idea_id = match.group(1)
        return "get_content_idea", {"id": idea_id}
    
    # Check for add content idea command
    match = re.match(REGEX_PATTERNS["add_content_idea"], prompt)
    if match:
        title = match.group(1).strip()
        content_type = match.group(2).strip() if match.group(2) else "blog"
        client = match.group(3).strip() if match.group(3) else ""
        
        parameters = {
            "title": title,
            "type": content_type,
            "status": "new",
            "priority": "medium"
        }
        if client:
            parameters["client"] = client
            
        return "add_content_idea", parameters
    
    # MARKETING DATA TOOLS
    # Check for get marketing data command
    if re.match(REGEX_PATTERNS["get_marketing_data"], prompt):
        return "get_marketing_data", {}
    
    # No matching tool found
    return None, {}