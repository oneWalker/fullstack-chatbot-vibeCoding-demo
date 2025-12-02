import { useState, useEffect } from "react";
import axios from "axios";
import "./conversation-history.component.css";

interface Conversation {
  conversationId: string;
  lastMessage: string;
  lastMessageRole: string;
  lastMessageTime: Date;
  messageCount: number;
  firstMessage: string;
}

interface ConversationHistoryProps {
  currentConversationId: string;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
}

const API_BASE_URL = "http://localhost:3000";

function ConversationHistory({
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, [currentConversationId]);

  const loadConversations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/chatbot/conversations`);
      setConversations(response.data);
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError("Failed to load conversation history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (
    conversationId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/chatbot/conversations/${conversationId}/delete`
      );
      setConversations((prev) =>
        prev.filter((conv) => conv.conversationId !== conversationId)
      );

      // If deleted current conversation, create a new one
      if (conversationId === currentConversationId) {
        onNewConversation();
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
      alert("Failed to delete conversation");
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const time = new Date(date);
    const diffInHours = (now.getTime() - time.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return time.toLocaleDateString();
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getConversationTitle = (conv: Conversation) => {
    // Use first user message as title
    if (conv.lastMessageRole === "user") {
      return truncateText(conv.lastMessage, 40);
    }
    return truncateText(conv.firstMessage, 40);
  };

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        className='history-toggle'
        onClick={() => setIsOpen(!isOpen)}
        aria-label='Toggle conversation history'
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div className={`conversation-history ${isOpen ? "open" : ""}`}>
        <div className='history-header'>
          <h2>💬 Conversations</h2>
          <button className='new-chat-btn' onClick={onNewConversation}>
            ➕ New Chat
          </button>
        </div>

        <div className='history-content'>
          {isLoading && (
            <div className='history-loading'>
              <div className='spinner'></div>
              <p>Loading...</p>
            </div>
          )}

          {error && <div className='history-error'>{error}</div>}

          {!isLoading && conversations.length === 0 && (
            <div className='history-empty'>
              <p>No conversations yet</p>
              <p>Start chatting to create your first conversation!</p>
            </div>
          )}

          {!isLoading && conversations.length > 0 && (
            <div className='conversation-list'>
              {conversations.map((conv) => (
                <div
                  key={conv.conversationId}
                  className={`conversation-item ${
                    conv.conversationId === currentConversationId
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    onSelectConversation(conv.conversationId);
                    setIsOpen(false);
                  }}
                >
                  <div className='conversation-info'>
                    <div className='conversation-title'>
                      {getConversationTitle(conv)}
                    </div>
                    <div className='conversation-meta'>
                      <span className='message-count'>
                        💬 {conv.messageCount}
                      </span>
                      <span className='conversation-time'>
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                  </div>
                  <button
                    className='delete-btn'
                    onClick={(e) => handleDeleteConversation(conv.conversationId, e)}
                    aria-label='Delete conversation'
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='history-footer'>
          <button className='refresh-btn' onClick={loadConversations}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className='history-overlay' onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}

export default ConversationHistory;

