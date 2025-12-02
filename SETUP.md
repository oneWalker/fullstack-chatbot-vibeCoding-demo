# Chatbot Project Setup Guide

This guide will help you set up and run the AI Chatbot application with NestJS backend and React frontend.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v6.0 or higher)
- **OpenAI API Key** (get one from https://platform.openai.com/api-keys)

## Project Structure

```
interviewProjects/
├── backend/          # NestJS backend
│   ├── src/
│   │   ├── chatbot/
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── index.html
└── README.md
```

## Database Setup

### 1. Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows:**
Download and install from: https://www.mongodb.com/try/download/community

### 2. Verify MongoDB Installation

```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"
```

The database and collection will be created automatically when the application runs for the first time.

**Optional:** Create indexes for better performance:
```bash
mongosh
use chatbot
db.messages.createIndex({ "conversationId": 1 })
db.messages.createIndex({ "createdAt": 1 })
exit
```

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/chatbot

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Application Configuration
PORT=3000
NODE_ENV=development
```

**Important:** Replace `your_openai_api_key_here` with your actual OpenAI API key.

**For MongoDB Atlas (cloud):** Use this format for MONGODB_URI:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatbot?retryWrites=true&w=majority
```

### 4. Start the backend server

**Development mode:**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

The backend will be running at: `http://localhost:3000`

### 5. Verify backend is running

Open your browser or use curl:
```bash
curl http://localhost:3000/chatbot/health
```

You should see: `{"status":"ok","message":"Chatbot service is running"}`

## Frontend Setup

### 1. Open a new terminal and navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the frontend development server
```bash
npm run dev
```

The frontend will be running at: `http://localhost:5173`

## Usage

1. Open your browser and go to `http://localhost:5173`
2. You'll see the AI Chatbot interface
3. Type a message in the input field and click "Send" or press Enter
4. The chatbot will respond using OpenAI's GPT model
5. Your conversation history is saved in the MongoDB database

## API Endpoints

### Backend API

- `GET /chatbot/health` - Health check endpoint
- `POST /chatbot/message` - Send a message to the chatbot
  ```json
  {
    "message": "Hello!",
    "conversationId": "conv_123456"
  }
  ```
- `GET /chatbot/history/:conversationId` - Get conversation history

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Verify MongoDB is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status mongod
   
   # Check connection
   mongosh --eval "db.adminCommand('ping')"
   ```

2. Check your `.env` file has correct MongoDB URI

3. Test database connection:
   ```bash
   mongosh "mongodb://localhost:27017/chatbot"
   ```

4. View stored messages:
   ```bash
   mongosh
   use chatbot
   db.messages.find().pretty()
   ```

### OpenAI API Issues

If you get OpenAI errors:

1. Verify your API key is valid at https://platform.openai.com/api-keys
2. Check you have credits/billing set up in your OpenAI account
3. Make sure the API key is correctly set in the `.env` file

### Port Already in Use

If port 3000 or 5173 is already in use:

**Backend (change port 3000):**
- Update `PORT` in backend `.env` file
- Update `API_BASE_URL` in `frontend/src/components/chatbot.component.tsx`

**Frontend (change port 5173):**
- Update `server.port` in `frontend/vite.config.ts`
- Update CORS origin in `backend/src/main.ts`

## Development

### Backend Development

- Run tests: `npm test` (in backend directory)
- Lint code: `npm run lint`
- Format code: `npm run format`

### Frontend Development

- Build for production: `npm run build`
- Preview production build: `npm run preview`
- Lint code: `npm run lint`

## Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Mongoose** - MongoDB ODM (Object Document Mapper)
- **MongoDB** - NoSQL document database
- **OpenAI API** - AI chatbot capabilities

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Modern styling with animations

## Features

- ✅ Real-time AI chatbot powered by OpenAI GPT-3.5
- ✅ Persistent conversation history in MongoDB
- ✅ Beautiful, modern UI with animations
- ✅ Dark/Light mode support
- ✅ Responsive design for mobile and desktop
- ✅ Error handling and loading states
- ✅ TypeScript for type safety
- ✅ RESTful API architecture
- ✅ Flexible NoSQL schema for easy extensions

## Next Steps

To enhance this application, consider adding:

- User authentication and authorization
- Multiple conversation threads
- File upload support
- Voice input/output
- Streaming responses
- Rate limiting
- Caching layer (Redis)
- Docker containerization
- CI/CD pipeline
- Automated tests

## License

MIT

