// Server-side API utilities
// 这些函数只在服务端运行，用于 SSR 数据预取

export interface Conversation {
  conversationId: string;
  lastMessage: string;
  lastMessageRole: string;
  lastMessageTime: Date;
  messageCount: number;
  firstMessage: string;
}

/**
 * 在服务端获取对话列表
 * 这个函数会在 SSR 时执行
 */
export async function getConversations(): Promise<Conversation[]> {
  try {
    const response = await fetch('http://localhost:3000/chatbot/conversations', {
      cache: 'no-store', // 不缓存，每次都获取最新数据
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

/**
 * 在服务端获取特定对话的历史记录
 */
export async function getConversationHistory(conversationId: string) {
  try {
    const response = await fetch(
      `http://localhost:3000/chatbot/history/${conversationId}`,
      {
        cache: 'no-store',
      }
    );
    
    if (!response.ok) {
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return [];
  }
}

