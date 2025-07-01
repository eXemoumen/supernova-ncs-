import logging
import time
import re
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# Entity memory to track mentioned entities across conversations
# Structure: {session_id: {"clients": [{"id": 1, "name": "Acme Inc", "last_mentioned": timestamp}]}}
entity_store = {}

class Memory:
    def __init__(self):
        # In-memory storage for conversation history
        # Structure: {session_id: [{"role": "user"|"assistant", "content": "message", "timestamp": timestamp}]}
        self.conversations = {}
        # TTL for sessions in minutes
        self.session_ttl = 60
    
    def add_interaction(self, session_id: str, role: str, content: str) -> None:
        """
        Add a user or assistant interaction to the conversation history.
        """
        if session_id not in self.conversations:
            self.conversations[session_id] = []
        
        interaction = {
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        }
        
        self.conversations[session_id].append(interaction)
        
        # Limit history size to prevent memory issues
        if len(self.conversations[session_id]) > 50:
            self.conversations[session_id] = self.conversations[session_id][-50:]
        
        logger.debug(f"Added interaction to session {session_id}, history size: {len(self.conversations[session_id])}")
        
        # Extract and track entities from the message
        if "assistant" in role:
            self.extract_and_track_entities(session_id, content)
    
    def get_conversation_history(self, session_id: str, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Get the conversation history for a specific session.
        """
        if session_id not in self.conversations:
            return []
        
        history = self.conversations[session_id]
        
        if limit is not None and limit > 0:
            history = history[-limit:]
        
        return history
    
    def cleanup_old_sessions(self) -> int:
        """
        Remove sessions that have been inactive for longer than the TTL.
        Returns the number of sessions removed.
        """
        now = datetime.now()
        sessions_to_remove = []
        
        for session_id, interactions in self.conversations.items():
            if not interactions:
                sessions_to_remove.append(session_id)
                continue
            
            last_interaction = interactions[-1]
            last_timestamp = datetime.fromisoformat(last_interaction["timestamp"])
            
            if now - last_timestamp > timedelta(minutes=self.session_ttl):
                sessions_to_remove.append(session_id)
        
        for session_id in sessions_to_remove:
            del self.conversations[session_id]
            if session_id in entity_store:
                del entity_store[session_id]
        
        return len(sessions_to_remove)
    
    def extract_and_track_entities(self, session_id: str, content: str) -> None:
        """
        Extract entities from the message content and track them in entity store.
        """
        if session_id not in entity_store:
            entity_store[session_id] = {"clients": []}
        
        # Extract client information from list responses
        if "### Client List" in content:
            client_blocks = re.findall(r'\d+\.\s+\*\*([^*]+)\*\*\s+- ID:\s+(\d+).*?(?=\d+\.\s+\*\*|$)', content, re.DOTALL)
            
            for client_block in client_blocks:
                client_name = client_block[0].strip()
                client_id = client_block[1].strip()
                
                # Check if client already exists in entity store
                client_exists = False
                for client in entity_store[session_id]["clients"]:
                    if client["id"] == int(client_id):
                        client["last_mentioned"] = time.time()
                        client_exists = True
                        break
                
                if not client_exists:
                    # Extract other details
                    niche_match = re.search(r'Niche:\s+([^\n]+)', client_block[0], re.DOTALL)
                    email_match = re.search(r'Email:\s+([^\n]+)', client_block[0], re.DOTALL)
                    
                    entity_store[session_id]["clients"].append({
                        "id": int(client_id),
                        "name": client_name,
                        "niche": niche_match.group(1).strip() if niche_match else "",
                        "contact_email": email_match.group(1).strip() if email_match else "",
                        "last_mentioned": time.time()
                    })
        
        # Extract client information from client addition responses
        elif "Successfully added client:" in content:
            client_match = re.search(r'Successfully added client:\s+\*\*([^*]+)\*\*\s+with ID:\s+\*\*(\d+)\*\*', content)
            if client_match:
                client_name = client_match.group(1).strip()
                client_id = client_match.group(2).strip()
                
                # Check if client already exists in entity store
                client_exists = False
                for client in entity_store[session_id]["clients"]:
                    if client["id"] == int(client_id):
                        client["last_mentioned"] = time.time()
                        client_exists = True
                        break
                
                if not client_exists:
                    entity_store[session_id]["clients"].append({
                        "id": int(client_id),
                        "name": client_name,
                        "last_mentioned": time.time()
                    })
        
        # Extract client information from client details responses
        elif "### Client Details" in content:
            client_match = re.search(r'\*\*([^*]+)\*\*\s+\(ID:\s+(\d+)\)', content)
            if client_match:
                client_name = client_match.group(1).strip()
                client_id = client_match.group(2).strip()
                
                # Check if client already exists in entity store
                client_exists = False
                for client in entity_store[session_id]["clients"]:
                    if client["id"] == int(client_id):
                        client["last_mentioned"] = time.time()
                        client_exists = True
                        break
                
                if not client_exists:
                    # Extract other details
                    niche_match = re.search(r'\*\*Niche:\*\*\s+([^\n]+)', content)
                    email_match = re.search(r'\*\*Contact Email:\*\*\s+([^\n]+)', content)
                    
                    entity_store[session_id]["clients"].append({
                        "id": int(client_id),
                        "name": client_name,
                        "niche": niche_match.group(1).strip() if niche_match else "",
                        "contact_email": email_match.group(1).strip() if email_match else "",
                        "last_mentioned": time.time()
                    })

    def get_recent_entities(self, session_id: str, entity_type: str = "clients", limit: int = 5) -> List[Dict[str, Any]]:
        """
        Get the most recently mentioned entities of a specific type.
        """
        if session_id not in entity_store or entity_type not in entity_store[session_id]:
            return []
        
        # Sort by last_mentioned timestamp (most recent first) and limit the results
        entities = sorted(
            entity_store[session_id][entity_type],
            key=lambda x: x.get("last_mentioned", 0),
            reverse=True
        )
        
        return entities[:limit]

    def get_session_summary(self, session_id: str) -> Dict[str, Any]:
        """
        Get a summary of the session including conversation history and tracked entities.
        """
        return {
            "conversation_history": self.get_conversation_history(session_id),
            "entities": entity_store.get(session_id, {}),
            "message_count": len(self.conversations.get(session_id, [])),
            "session_id": session_id
        }

    def get_all_sessions(self) -> List[str]:
        """
        Get a list of all active session IDs.
        """
        return list(self.conversations.keys())

# Create a singleton instance
memory = Memory() 