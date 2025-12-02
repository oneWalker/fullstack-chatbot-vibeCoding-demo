import { useState } from "react";
import ChatbotComponent from "../components/chatbot.component";
import ConversationHistory from "../components/conversation-history.component";
import "./chatbot.page.css";

function ChatbotPage() {
  const generateConversationId = () => {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const [conversationId, setConversationId] = useState(() =>
    generateConversationId()
  );
  const [key, setKey] = useState(0);

  const handleSelectConversation = (newConversationId: string) => {
    setConversationId(newConversationId);
    setKey((prev) => prev + 1); // Force remount to load new conversation
  };

  const handleNewConversation = () => {
    setConversationId(generateConversationId());
    setKey((prev) => prev + 1); // Force remount to start fresh
  };

  return (
    <div className='chatbot-page'>
      <ConversationHistory
        currentConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />

      <div className='chatbot-main'>
        <header className='page-header'>
          <h1>AI Chatbot Assistant</h1>
          <p>Powered by OpenAI - Ask me anything!</p>
        </header>
        <main className='page-content'>
          <ChatbotComponent key={key} conversationId={conversationId} />
        </main>
        <footer className='page-footer'>
          <p>Conversation ID: {conversationId}</p>
        </footer>
      </div>
    </div>
  );
}

export default ChatbotPage;

