from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CreateMessageRequest(BaseModel):
    message: str
    conversationId: str

class CreateMessageResponse(BaseModel):
    message: str
    conversationId: str
    timestamp: Optional[datetime] = None

class ConversationInfo(BaseModel):
    conversationId: str
    lastMessage: str
    lastMessageRole: str
    lastMessageTime: datetime
    messageCount: int
    firstMessage: str

class DeleteConversationResponse(BaseModel):
    success: bool
    message: str

class HealthCheckResponse(BaseModel):
    status: str
    message: str