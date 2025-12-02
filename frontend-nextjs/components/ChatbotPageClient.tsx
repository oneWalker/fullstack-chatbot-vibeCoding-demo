"use client";

import { useState } from "react";
import ChatbotComponent from "./chatbot.component";
import ConversationHistory from "./conversation-history.component";
import Footer from "./Footer";
import "./chatbot-page.css";

interface ChatbotPageClientProps {
  initialConversationId: string;
}

/**
 * 客户端组件 - 负责状态管理和交互逻辑
 * 只有需要使用 useState、事件处理等客户端特性的部分才标记为 "use client"
 */
export default function ChatbotPageClient({ initialConversationId }: ChatbotPageClientProps) {
  const generateConversationId = () => {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const [conversationId, setConversationId] = useState(initialConversationId);
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
    <div className="chatbot-page">
      <ConversationHistory
        currentConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />

      <div className="chatbot-main">
        <main className="page-content">
          <ChatbotComponent key={key} conversationId={conversationId} />
        </main>
        <Footer conversationId={conversationId} />
      </div>
    </div>
  );
}

