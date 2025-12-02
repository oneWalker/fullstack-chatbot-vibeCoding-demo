from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from typing import List
import json
from bson import ObjectId
from app.schemas.message import (
    CreateMessageRequest,
    CreateMessageResponse,
    ConversationInfo,
    DeleteConversationResponse,
    HealthCheckResponse
)
from app.chatbot.service import get_chatbot_service

router = APIRouter()

@router.post("/message", response_model=CreateMessageResponse)
async def send_message(create_message_dto: CreateMessageRequest):
    """Send a message to the chatbot"""
    chatbot_service = get_chatbot_service()
    try:
        result = await chatbot_service.process_message(create_message_dto)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/message/stream")
async def send_message_stream(create_message_dto: CreateMessageRequest):
    """Send a message to the chatbot and stream the response"""
    chatbot_service = get_chatbot_service()
    
    async def event_generator():
        async for event in chatbot_service.process_message_stream(create_message_dto):
            yield event
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
        }
    )

@router.get("/conversations", response_model=List[ConversationInfo])
async def get_all_conversations(response: Response):
    """Get all conversations"""
    chatbot_service = get_chatbot_service()
    # Disable cache
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    
    try:
        conversations = await chatbot_service.get_all_conversations()
        # Ensure proper JSON serialization
        serialized_conversations = []
        for conversation in conversations:
            serialized_conversation = {}
            for key, value in conversation.items():
                if isinstance(value, ObjectId):
                    serialized_conversation[key] = str(value)
                else:
                    serialized_conversation[key] = value
            serialized_conversations.append(serialized_conversation)
        return serialized_conversations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{conversation_id}")
async def get_history(conversation_id: str, response: Response):
    """Get conversation history"""
    chatbot_service = get_chatbot_service()
    # Disable cache
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    
    try:
        history = await chatbot_service.get_conversation_history(conversation_id)
        # Ensure proper JSON serialization
        serialized_history = []
        for message in history:
            serialized_message = {}
            for key, value in message.items():
                if isinstance(value, ObjectId):
                    serialized_message[key] = str(value)
                else:
                    serialized_message[key] = value
            serialized_history.append(serialized_message)
        return serialized_history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/conversations/{conversation_id}/delete", response_model=DeleteConversationResponse)
async def delete_conversation(conversation_id: str):
    """Delete a conversation"""
    chatbot_service = get_chatbot_service()
    try:
        success = await chatbot_service.delete_conversation(conversation_id)
        if success:
            return {
                "success": True,
                "message": "Conversation deleted successfully"
            }
        else:
            raise HTTPException(status_code=404, detail="Conversation not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Chatbot service is running"
    }