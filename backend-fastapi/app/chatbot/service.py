import asyncio
from typing import List, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.models.message import Message
from app.schemas.message import CreateMessageRequest
from app.database.connection import get_collection
from app.utils.openai_client import openai_client

class ChatbotService:
    def __init__(self):
        self.messages_collection = None
        
    def _ensure_collection(self):
        """Ensure the messages collection is initialized"""
        if self.messages_collection is None:
            self.messages_collection = get_collection("messages")
        return self.messages_collection

    async def process_message(self, create_message_dto: CreateMessageRequest) -> Dict[str, Any]:
        """Process a message and generate AI response"""
        self._ensure_collection()
        
        # Save user message to database
        user_message = Message(
            conversation_id=create_message_dto.conversationId,
            role="user",
            content=create_message_dto.message,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        await self.messages_collection.insert_one({
            "conversationId": user_message.conversation_id,
            "role": user_message.role,
            "content": user_message.content,
            "createdAt": user_message.created_at,
            "updatedAt": user_message.updated_at
        })

        # Get conversation history for context
        history = await self.get_conversation_history(create_message_dto.conversationId)

        # Prepare messages for OpenAI
        messages = [
            {
                "role": "system",
                "content": "You are a helpful assistant. Be concise and friendly."
            }
        ]
        
        for msg in history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })

        try:
            # Call OpenAI API
            completion = await openai_client.create_chat_completion(messages)
            
            ai_response = completion.choices[0].message.content if completion.choices[0].message.content else "Sorry, I could not generate a response."

            # Save AI response to database
            assistant_message = Message(
                conversation_id=create_message_dto.conversationId,
                role="assistant",
                content=ai_response,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            await self.messages_collection.insert_one({
                "conversationId": assistant_message.conversation_id,
                "role": assistant_message.role,
                "content": assistant_message.content,
                "createdAt": assistant_message.created_at,
                "updatedAt": assistant_message.updated_at
            })

            return {
                "message": ai_response,
                "conversationId": create_message_dto.conversationId,
                "timestamp": assistant_message.created_at
            }
        except Exception as error:
            print(f"Error calling OpenAI: {error}")
            return {
                "message": "Sorry, I encountered an error processing your request.",
                "conversationId": create_message_dto.conversationId,
                "error": str(error)
            }

    async def get_conversation_history(self, conversation_id: str) -> List[Dict]:
        """Get conversation history"""
        self._ensure_collection()
        cursor = self.messages_collection.find({"conversationId": conversation_id}).sort("createdAt", 1)
        messages = await cursor.to_list(length=None)
        # Convert ObjectId to string for JSON serialization
        for message in messages:
            if "_id" in message:
                message["_id"] = str(message["_id"])
        return messages

    async def get_all_conversations(self) -> List[Dict]:
        """Get all conversations with their latest message"""
        self._ensure_collection()
        pipeline = [
            {"$sort": {"createdAt": -1}},
            {
                "$group": {
                    "_id": "$conversationId",
                    "lastMessage": {"$first": "$content"},
                    "lastMessageRole": {"$first": "$role"},
                    "lastMessageTime": {"$first": "$createdAt"},
                    "messageCount": {"$sum": 1},
                    "firstMessage": {"$last": "$content"}
                }
            },
            {"$sort": {"lastMessageTime": -1}},
            {
                "$project": {
                    "conversationId": "$_id",
                    "lastMessage": 1,
                    "lastMessageRole": 1,
                    "lastMessageTime": 1,
                    "messageCount": 1,
                    "firstMessage": 1,
                    "_id": 0
                }
            }
        ]
        
        result = await self.messages_collection.aggregate(pipeline).to_list(length=None)
        # Ensure all ObjectIds are converted to strings
        for conversation in result:
            if "_id" in conversation:
                conversation["_id"] = str(conversation["_id"])
        return result

    async def delete_conversation(self, conversation_id: str) -> bool:
        """Delete a conversation"""
        self._ensure_collection()
        result = await self.messages_collection.delete_many({"conversationId": conversation_id})
        return result.deleted_count > 0

    async def process_message_stream(self, create_message_dto: CreateMessageRequest):
        """Process a message and stream AI response"""
        self._ensure_collection()
        
        # Save user message to database
        user_message = Message(
            conversation_id=create_message_dto.conversationId,
            role="user",
            content=create_message_dto.message,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        await self.messages_collection.insert_one({
            "conversationId": user_message.conversation_id,
            "role": user_message.role,
            "content": user_message.content,
            "createdAt": user_message.created_at,
            "updatedAt": user_message.updated_at
        })

        # Get conversation history for context
        history = await self.get_conversation_history(create_message_dto.conversationId)

        # Prepare messages for OpenAI
        messages = [
            {
                "role": "system",
                "content": "You are a helpful assistant. Be concise and friendly."
            }
        ]
        
        for msg in history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })

        try:
            # Call OpenAI API with streaming
            stream = await openai_client.create_chat_completion(messages, stream=True)
            
            full_response = ""
            
            # Send initial metadata
            yield f"data: {{\"type\": \"start\", \"conversationId\": \"{create_message_dto.conversationId}\"}}\n\n"
            
            # Stream the response chunks
            async for chunk in stream:
                content = chunk.choices[0].delta.content if chunk.choices[0].delta.content else ""
                if content:
                    full_response += content
                    yield f"data: {{\"type\": \"content\", \"content\": \"{content}\"}}\n\n"
            
            # Save AI response to database
            assistant_message = Message(
                conversation_id=create_message_dto.conversationId,
                role="assistant",
                content=full_response,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            await self.messages_collection.insert_one({
                "conversationId": assistant_message.conversation_id,
                "role": assistant_message.role,
                "content": assistant_message.content,
                "createdAt": assistant_message.created_at,
                "updatedAt": assistant_message.updated_at
            })
            
            # Send completion signal with metadata
            yield f"data: {{\"type\": \"end\", \"conversationId\": \"{create_message_dto.conversationId}\", \"timestamp\": \"{assistant_message.created_at}\"}}\n\n"
            
        except Exception as error:
            print(f"Error in stream: {error}")
            yield f"data: {{\"type\": \"error\", \"message\": \"Sorry, I encountered an error processing your request.\", \"error\": \"{str(error)}\"}}\n\n"

# Create singleton instance lazily
_chatbot_service = None

def get_chatbot_service():
    global _chatbot_service
    if _chatbot_service is None:
        _chatbot_service = ChatbotService()
    return _chatbot_service