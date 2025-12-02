# Quick Start Guide - FastAPI Backend

This guide will help you get the FastAPI backend up and running quickly.

## Prerequisites

- Python 3.8 or higher
- MongoDB 6.0 or higher
- An OpenAI API key

## Installation

1. **Clone the repository** (if you haven't already):

   ```bash
   cd backend-fastapi
   ```

2. **Install uv** (if you haven't already):

   ```bash
   pip install uv
   ```

3. **Install dependencies using uv**:

   ```bash
   uv sync
   ```

   Or using pip:

   ```bash
   pip install -e .
   ```

   For development dependencies:

   ```bash
   pip install -e ".[dev]"
   ```

## Configuration

1. **Create environment file**:

   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your configuration:
   ```env
   OPENAI_API_KEY=your_actual_openai_api_key_here
   MONGODB_URI=mongodb://localhost:27017/chatbot
   PORT=3000
   DEBUG=True
   MODEL=gpt-3.5-turbo
   ```

## Database Setup

Make sure MongoDB is running:

```bash
# Start MongoDB (if using macOS with Homebrew)
brew services start mongodb-community

# Or start MongoDB manually
mongod
```

The application will automatically create the database and collections when needed.

## Running the Application

### Development Mode

For development with auto-reload:

```bash
uvicorn app.main:app --reload
```

Or using the built-in script:

```bash
python app/main.py
```

### Production Mode

For production:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 3000
```

## Testing the API

Once the server is running, you can test the API endpoints:

1. **Health Check**:

   ```bash
   curl http://localhost:3000/chatbot/health
   ```

2. **Send a Message**:

   ```bash
   curl -X POST http://localhost:3000/chatbot/message \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello!", "conversationId": "test-conversation"}'
   ```

3. **Get Conversation History**:
   ```bash
   curl http://localhost:3000/chatbot/history/test-conversation
   ```

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: http://localhost:3000/docs
- **ReDoc**: http://localhost:3000/redoc

## Project Structure

```
backend-fastapi/
├── app/
│   ├── main.py              # Application entry point
│   ├── config.py            # Configuration settings
│   ├── models/              # Database models
│   ├── schemas/             # Pydantic schemas
│   ├── database/            # Database connection
│   ├── chatbot/             # Chatbot module
│   │   ├── router.py        # API routes
│   │   └── service.py       # Business logic
│   └── utils/               # Utility functions
├── .env.example             # Environment variables template
├── .env                     # Your environment variables (not in version control)
├── requirements.txt         # Python dependencies
├── README.md                # Project documentation
└── QUICKSTART.md            # This file
```

## Troubleshooting

### Common Issues

1. **Module not found errors**:
   Make sure you've installed dependencies with `uv sync` or `pip install -e .`

2. **MongoDB connection errors**:
   Ensure MongoDB is running and the `MONGODB_URI` in your `.env` file is correct

3. **OpenAI API errors**:
   Verify your `OPENAI_API_KEY` is correct and has sufficient credits

### Logging

The application logs to the console. In production, you might want to configure proper logging to files.

## Development

### Code Formatting

We use Black and isort for code formatting:

```bash
black .
isort .
```

### Running Tests

```bash
python -m pytest
```

## Next Steps

1. Integrate with the frontend applications
2. Customize the OpenAI prompt in `chatbot/service.py`
3. Add authentication if needed
4. Implement rate limiting for production use
