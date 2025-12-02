import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./chatbot.component.css";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

interface ChatbotComponentProps {
  conversationId: string;
}

const API_BASE_URL = "http://localhost:3000";

function ChatbotComponent({ conversationId }: ChatbotComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation history on mount
  useEffect(() => {
    loadHistory();
  }, [conversationId]);

  const loadHistory = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/chatbot/history/${conversationId}`
      );
      if (response.data && response.data.length > 0) {
        setMessages(response.data);
      }
    } catch (err) {
      console.error("Error loading history:", err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    // Add user message to UI
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      // Use streaming endpoint
      const response = await fetch(`${API_BASE_URL}/chatbot/message/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response reader available");
      }

      // Add empty assistant message that we'll update as content streams in
      let assistantMessageIndex = -1;
      setMessages((prev) => {
        assistantMessageIndex = prev.length;
        return [
          ...prev,
          { role: "assistant", content: "", timestamp: new Date() },
        ];
      });

      let buffer = "";
      let fullContent = "";
      let finalTimestamp: Date | undefined;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "content") {
                fullContent += data.content;
                // Update the assistant message with streaming content
                setMessages((prev) => {
                  const newMessages = [...prev];
                  if (
                    assistantMessageIndex >= 0 &&
                    assistantMessageIndex < newMessages.length
                  ) {
                    newMessages[assistantMessageIndex] = {
                      ...newMessages[assistantMessageIndex],
                      content: fullContent,
                    };
                  }
                  return newMessages;
                });
              } else if (data.type === "end") {
                finalTimestamp = new Date(data.timestamp);
                // Update with final timestamp
                setMessages((prev) => {
                  const newMessages = [...prev];
                  if (
                    assistantMessageIndex >= 0 &&
                    assistantMessageIndex < newMessages.length
                  ) {
                    newMessages[assistantMessageIndex] = {
                      ...newMessages[assistantMessageIndex],
                      timestamp: finalTimestamp,
                    };
                  }
                  return newMessages;
                });
              } else if (data.type === "error") {
                throw new Error(data.message || "Error processing message");
              }
            } catch (parseError) {
              console.error("Error parsing SSE data:", parseError);
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message. Please try again.");

      // Remove the user message and any partial assistant message if there was an error
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg !== userMessage);
        return filtered.filter(
          (msg) => msg.role !== "assistant" || msg.content
        );
      });
      setInputMessage(userMessage.content);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='chatbot-container'>
      <div className='messages-container'>
        {messages.length === 0 && (
          <div className='welcome-message'>
            <h2>👋 Welcome!</h2>
            <p>Start a conversation by typing a message below.</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.role === "user" ? "user-message" : "assistant-message"
            }`}
          >
            <div className='message-avatar'>
              {msg.role === "user" ? "👤" : "🤖"}
            </div>
            <div className='message-content'>
              <div className='message-text'>{msg.content}</div>
              {msg.timestamp && (
                <div className='message-timestamp'>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className='message assistant-message'>
            <div className='message-avatar'>🤖</div>
            <div className='message-content'>
              <div className='typing-indicator'>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className='error-message'>⚠️ {error}</div>}

      <form onSubmit={sendMessage} className='input-form'>
        <input
          type='text'
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder='Type your message...'
          disabled={isLoading}
          className='message-input'
        />
        <button
          type='submit'
          disabled={isLoading || !inputMessage.trim()}
          className='send-button'
        >
          {isLoading ? "⏳" : "📤"} Send
        </button>
      </form>
    </div>
  );
}

export default ChatbotComponent;
