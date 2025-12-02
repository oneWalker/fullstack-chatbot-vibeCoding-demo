# Chatbot Backend

NestJS backend with TypeScript, PostgreSQL, and OpenAI integration.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (see SETUP.md in root directory)

3. Start development server:
```bash
npm run start:dev
```

## Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with watch
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run lint` - Lint the code
- `npm run format` - Format the code with Prettier

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

### Get Conversation History
```
GET /chatbot/history/:conversationId
```

## Environment Variables

Required environment variables (create `.env` file):

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/chatbot

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App
PORT=3000
NODE_ENV=development
```

## Project Structure

```
src/
├── chatbot/
│   ├── chatbot.controller.ts    # HTTP request handlers
│   ├── chatbot.service.ts       # Business logic & OpenAI integration
│   ├── chatbot.module.ts        # Module definition
│   ├── chatbot.routes.ts        # Route configuration
│   ├── entities/
│   │   └── message.entity.ts    # Database entity
│   └── dto/
│       └── create-message.dto.ts # Data transfer object
├── main.ts                       # Application entry point
└── app.module.ts                 # Root module
```

## Technologies

- NestJS 10
- TypeScript 5
- Mongoose
- MongoDB
- OpenAI API

