# Agi Agent Service

An AI-powered agent that serves as a central command interface for the application.

## Overview

This service implements the "brain" of the Agi agent, which processes natural language commands from users and executes the appropriate actions by calling the backend API.

## Architecture

The service follows the Think-Act-Observe loop:

1. **Think**: The agent decides which tool to use based on the user's prompt
2. **Act**: The agent executes the chosen tool
3. **Observe**: The agent processes the result and formulates a response

## Setup

### Prerequisites

- Python 3.10+
- Backend API running on http://localhost:3001

### Installation

1. Create a virtual environment:

```bash
python -m venv agi-env
source agi-env/bin/activate  # On Windows: agi-env\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Running the Service

Start the FastAPI server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The service will be available at http://localhost:8000

## Testing

Run the test script to verify the service is working:

```bash
python test_agent.py
```

## API Endpoints

- `POST /chat`: Process a user prompt
- `GET /health`: Health check endpoint

## Development Roadmap

This service is being developed in phases:

1. **Phase 1 (Current)**: Foundation & Proof of Concept
2. **Phase 2**: Expanding Core Capabilities (CRUD)
3. **Phase 3**: Advanced Reasoning & Memory
4. **Phase 4**: Pro-activity & Deployment 