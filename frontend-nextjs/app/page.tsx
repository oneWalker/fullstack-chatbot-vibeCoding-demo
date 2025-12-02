import Header from "@/components/Header";
import ChatbotPageClient from "@/components/ChatbotPageClient";
import { getConversations } from "@/lib/api";

/**
 * 服务端组件 (默认) - 实现 SSR
 * 在服务端执行数据预取，提升首屏加载速度和 SEO
 */
export default async function Home() {
  // 生成初始会话 ID (服务端执行)
  const generateConversationId = () => {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const initialConversationId = generateConversationId();

  // 服务端数据预取 - 在渲染前获取对话列表
  // 这部分会在服务端执行，客户端直接接收到渲染好的 HTML
  const conversations = await getConversations();

  return (
    <>
      {/* 服务端渲染的静态 Header */}
      <Header />
      
      {/* 客户端交互组件 */}
      <ChatbotPageClient initialConversationId={initialConversationId} />
      
      {/* 可选：显示服务端获取到的对话数量，证明 SSR 工作 */}
      {conversations.length > 0 && (
        <div style={{ display: 'none' }} data-ssr-conversations={conversations.length}>
          {/* 这个 div 只是为了在 HTML 源码中显示 SSR 数据，不会显示在页面上 */}
          SSR loaded {conversations.length} conversations
        </div>
      )}
    </>
  );
}

// 元数据配置 (只能在服务端组件中使用)
export const metadata = {
  title: "AI Chatbot Assistant - SSR Enhanced",
  description: "A modern AI chatbot with Next.js Server-Side Rendering for better performance and SEO",
};
