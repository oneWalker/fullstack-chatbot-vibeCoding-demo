# Chatbot Frontend

React frontend with TypeScript and Vite.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open browser at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint the code

## Project Structure

```
src/
├── components/
│   ├── chatbot.component.tsx      # Main chatbot UI component
│   └── chatbot.component.css      # Component styles
├── pages/
│   ├── chatbot.page.tsx           # Chatbot page wrapper
│   └── chatbot.page.css           # Page styles
├── App.tsx                         # Root component
├── App.css                         # App styles
├── main.tsx                        # Application entry point
└── index.css                       # Global styles
```

## Features

- 💬 Real-time chat interface
- 🎨 Beautiful gradient UI with animations
- 📱 Responsive design
- 🌙 Dark/Light mode support
- ⏳ Loading indicators
- ⚠️ Error handling
- 💾 Persistent conversation history
- 🔄 Auto-scroll to new messages

## Configuration

To change the backend API URL, update `API_BASE_URL` in `src/components/chatbot.component.tsx`:

```typescript
const API_BASE_URL = 'http://localhost:3000';
```

## Technologies

- React 18
- TypeScript 5
- Vite 5
- Axios
- CSS3 with animations

