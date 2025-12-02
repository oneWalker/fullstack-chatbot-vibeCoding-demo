from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

from app.config import Settings
from app.database.connection import connect_to_mongo, close_mongo_connection
from app.chatbot.router import router as chatbot_router

load_dotenv()

settings = Settings()

app = FastAPI(
    title="Chatbot Backend - FastAPI",
    description="FastAPI backend with MongoDB and OpenAI integration",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite frontend
        "http://localhost:5174",  # Next.js frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chatbot_router, prefix="/chatbot", tags=["chatbot"])

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo(settings.MONGODB_URI)

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "Welcome to the Chatbot Backend - FastAPI"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 3000)),
        reload=settings.DEBUG
    )