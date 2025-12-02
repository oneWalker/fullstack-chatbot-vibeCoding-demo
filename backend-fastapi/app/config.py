from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    OPENAI_API_KEY: str
    MONGODB_URI: str = "mongodb://localhost:27017/chatbot"
    PORT: int = 3000
    DEBUG: bool = True
    MODEL: str = "gpt-3.5-turbo"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"
settings = Settings()