from openai import AsyncOpenAI
from app.config import settings

class OpenAIClient:
    def __init__(self):
        self.client = AsyncOpenAI(
            base_url=settings.OPENAI_BASE_URL,
            api_key=settings.OPENAI_API_KEY
        )
        self.model = settings.MODEL

    async def create_chat_completion(self, messages, stream=False):
        """Create a chat completion using the OpenAI API"""
        return await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=500,
            stream=stream
        )

openai_client = OpenAIClient()