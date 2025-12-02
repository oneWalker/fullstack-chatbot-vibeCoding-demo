# AI Chatbot Application

A full-stack chatbot application with AI capabilities powered by OpenAI. This project offers multiple implementation options to suit different needs:

- **NestJS + React (Vite)** - The original implementation
- **FastAPI + React (Vite)** - Python backend alternative
- **NestJS + Next.js** - Enhanced frontend with SSR capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6.0+
- OpenAI API Key

### Setup Steps

This project offers multiple tech stack options. Follow the instructions for your preferred combination:

1. **Install Backend Dependencies**

```bash
cd backend
npm install
```

2. **Configure Backend Environment**

Create `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/chatbot
OPENAI_API_KEY=your_openai_api_key
PORT=3000
NODE_ENV=development
```

3. **Setup MongoDB**

```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Verify MongoDB is running
mongosh --eval "db.adminCommand('ping')"
```

The database and collection will be created automatically when you run the application.

4. **Start Backend**

```bash
cd backend
npm run start:dev
```

5. **Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

6. **Start Frontend**

```bash
npm run dev
```

7. **Open Application**

Navigate to `http://localhost:5173` in your browser

## 📚 Documentation

For detailed setup instructions, see [SETUP.md](./SETUP.md)

### Sub-project Documentation

- [FastAPI Backend README](./backend-fastapi/README.md)
- [Next.js Frontend README](./frontend-nextjs/README.md)

## 🏗️ Project Structure

```
interviewProjects/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── chatbot/     # Chatbot module
│   │   ├── main.ts      # Entry point
│   │   └── app.module.ts
│   └── package.json
├── backend-fastapi/      # FastAPI backend (Python)
│   ├── app/
│   │   ├── main.py       # Application entry point
│   │   ├── chatbot/      # Chatbot module
│   │   ├── database/     # Database connection
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   └── utils/        # Utility functions
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # FastAPI backend documentation
├── frontend/             # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── App.tsx
│   └── package.json
├── frontend-nextjs/      # Next.js frontend
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── next.config.js    # Next.js configuration
│   └── README.md         # Next.js frontend documentation
├── database/
│   └── mongodb-setup.md # MongoDB setup guide
├── SETUP.md             # Detailed setup guide
└── README.md            # This file
```

## ✨ Features

- 🤖 AI-powered chatbot using OpenAI GPT-3.5
- 💬 Real-time conversation interface
- 💾 Persistent chat history in MongoDB
- 🎨 Modern, responsive UI with animations
- 🌙 Dark/Light mode support
- 🔒 Type-safe with TypeScript
- ⚡ Fast development with multiple frameworks (Vite, Next.js)
- 🏗️ Scalable architecture with multiple backend options (NestJS, FastAPI)
- 📊 Flexible NoSQL document storage

## 🛠️ Technology Stack

### Backend Options

#### NestJS (Node.js)

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Mongoose** - MongoDB ODM
- **MongoDB** - NoSQL document database
- **OpenAI API** - AI capabilities

#### FastAPI (Python)

- **FastAPI** - High-performance Python web framework
- **Python 3.8+** - Modern Python runtime
- **Motor** - Asynchronous MongoDB driver
- **Pydantic v2** - Data validation using Python type hints
- **Uvicorn** - Lightning-fast ASGI server

### Frontend Options

#### React + Vite (SPA)

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS3** - Modern styling

#### Next.js (SSR)

- **Next.js 14** - The React Framework for the Web
- **App Router** - File-system based routing
- **Server Components** - Improved performance and bundle size
- **SSR** - Server-Side Rendering for better SEO
- **Hybrid Rendering** - Mix of static and dynamic content

## 📡 API Endpoints

- `GET /chatbot/health` - Health check
- `POST /chatbot/message` - Send message to chatbot
- `GET /chatbot/history/:conversationId` - Get conversation history

## 🔧 Development

### Backend Commands

```bash
cd backend
npm run start:dev    # Development mode
npm run build        # Build for production
npm run lint         # Lint code
```

### Frontend Commands

```bash
cd frontend
npm run dev          # Development mode
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📝 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📧 Support

For questions and support, please refer to [SETUP.md](./SETUP.md) for troubleshooting tips.
