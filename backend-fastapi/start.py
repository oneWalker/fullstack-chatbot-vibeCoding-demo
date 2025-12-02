#!/usr/bin/env python3
"""
Startup script for the FastAPI chatbot backend.
"""

import uvicorn
import os
from dotenv import load_dotenv

if __name__ == "__main__":
    # Load environment variables
    load_dotenv()
    
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 3000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print(f"Starting FastAPI server on {host}:{port}")
    print(f"Debug mode: {debug}")
    
    # Run the application
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=debug
    )