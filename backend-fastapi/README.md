# Chatbot Backend - FastAPI Implementation

FastAPI backend with Python, MongoDB, and OpenAI integration, mirroring the functionality of the NestJS backend.

## Quick Start

1. Install dependencies using uv:

```bash
# Install uv if you haven't already
pip install uv

# Install project dependencies
uv sync
```

Or install dependencies without uv:

```bash
pip install -e .
```

2. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

3. Configure environment variables in `.env` file

4. Start development server:

```bash
uvicorn app.main:app --reload
```

## Available Scripts

- `uvicorn app.main:app --reload` - Start in development mode with watch
- `uvicorn app.main:app --host 0.0.0.0 --port 3000` - Start production server
- `python -m pytest` - Run tests

## API Endpoints

### Health Check

```
GET /chatbot/health
```

### Send Message

```
POST /chatbot/message
Content-Type: application/json

{
  "message": "Hello, chatbot!",
  "conversationId": "unique-conversation-id"
}
```

### Send Message with Streaming

```
POST /chatbot/message/stream
Content-Type: application/json

{
  "message": "Hello, chatbot!",
  "conversationId": "unique-conversation-id"
}
```

### Get All Conversations

```
GET /chatbot/conversations
```

### Get Conversation History

```
GET /chatbot/history/{conversationId}
```

### Delete Conversation

```
POST /chatbot/conversations/{conversationId}/delete
```

## Environment Variables

Required environment variables (configure in `.env` file):

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/chatbot

# OpenAI
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=your_openai_api_key
MODEL=gpt-3.5-turbo

# App
PORT=3000
DEBUG=True
```

## Project Structure

```
app/
├── main.py                  # Application entry point
├── config.py                # Configuration settings
├── models/
│   └── message.py           # Database models
├── schemas/
│   └── message.py           # Pydantic schemas
├── database/
│   └── connection.py        # Database connection
├── chatbot/
│   ├── router.py            # API routes
│   ├── service.py           # Business logic & OpenAI integration
│   └── __init__.py
├── utils/
│   └── openai_client.py     # OpenAI client wrapper
└── __init__.py
```

## Technologies

- FastAPI 0.104.0+
- Python 3.8+
- Motor (Async MongoDB driver)
- OpenAI Python API
- Pydantic v2
- Uvicorn ASGI server

## Development

### Installing Dependencies

Using uv (recommended):

```bash
# Install uv if you haven't already
pip install uv

# Install project dependencies
uv sync
```

Using pip:

```bash
pip install -e .
```

For development dependencies:

```bash
pip install -e ".[dev]"
```

### Running Tests

```bash
python -m pytest
```

### Code Formatting

```bash
black .
isort .
```
