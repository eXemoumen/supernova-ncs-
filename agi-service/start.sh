#!/bin/bash

# Start the Agi Agent Service
echo "Starting Agi Agent Service..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload 