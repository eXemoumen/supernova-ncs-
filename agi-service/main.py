import logging
import os
import uuid
from fastapi import FastAPI, HTTPException, Depends, Header, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime

import agent
from memory import memory
from agent import process_prompt

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Agi Agent Service",
    description="AI-powered agent that serves as a central command interface",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ChatRequest(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    prompt: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

class SessionRequest(BaseModel):
    session_id: str

async def get_or_create_session_id(session_id: Optional[str] = Header(None, alias="X-Session-ID")):
    """
    Get the session ID from header or generate a new one.
    """
    if not session_id:
        session_id = str(uuid.uuid4())
    return session_id

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Process a chat request and return a response.
    """
    # Use provided session_id or generate a new one
    active_session_id = request.session_id
    
    logger.info(f"Received prompt for session {active_session_id}: {request.prompt}")
    
    # Get conversation history
    conversation_history = memory.get_conversation_history(active_session_id)
    
    # Add user message to history
    memory.add_interaction(active_session_id, "user", request.prompt)
    
    # Generate response using the agent
    response = await process_prompt(request.prompt, active_session_id, conversation_history)
    
    # Add agent response to history
    memory.add_interaction(active_session_id, "assistant", response)
    
    logger.info(f"Sending response for session {active_session_id}: {response}")
    
    return ChatResponse(response=response, session_id=active_session_id)

@app.get("/conversation/{session_id}")
async def get_conversation(session_id: str):
    """
    Get the conversation history for a session.
    """
    conversation = memory.get_conversation_history(session_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return {"conversation": conversation, "session_id": session_id}

@app.delete("/conversation/{session_id}")
async def clear_conversation(session_id: str):
    """
    Clear the conversation history for a session.
    """
    # This is a placeholder - we need to implement this in the Memory class
    # For now, we'll just reset the conversation to an empty list
    if session_id in memory.conversations:
        memory.conversations[session_id] = []
    
    return {"message": "Conversation cleared", "session_id": session_id}

@app.get("/sessions/{session_id}/history")
async def get_session_history(session_id: str, limit: int = None):
    """
    Get conversation history for a specific session.
    """
    history = memory.get_conversation_history(session_id, limit)
    return {"session_id": session_id, "history": history}

@app.get("/sessions/{session_id}/entities")
async def get_session_entities(session_id: str, entity_type: str = "clients"):
    """
    Get entities tracked for a specific session.
    """
    entities = memory.get_recent_entities(session_id, entity_type)
    return {"session_id": session_id, "entity_type": entity_type, "entities": entities}

@app.get("/sessions/{session_id}/summary")
async def get_session_summary(session_id: str):
    """
    Get a complete summary of a session including history and entities.
    """
    return memory.get_session_summary(session_id)

@app.get("/sessions")
async def list_sessions():
    """
    List all active sessions.
    """
    sessions = memory.get_all_sessions()
    return {"sessions": sessions}

@app.delete("/sessions/{session_id}")
async def clear_session(session_id: str):
    """
    Clear a specific session.
    """
    # This is a temporary solution until we implement a proper clear method
    memory.cleanup_old_sessions()
    return {"message": f"Session {session_id} cleared"}

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify the service is running.
    """
    return {
        "status": "healthy", 
        "version": "1.0.0",
        "active_sessions": len(memory.get_all_sessions()),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/")
async def root():
    """
    Root endpoint with API information.
    """
    return {
        "name": "AGI Agent Service",
        "version": "0.1.0",
        "description": "An AI-powered agent service that can perform operations through natural language commands."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 