// Server Component - 无需 "use client"
// 这个组件会在服务端渲染，内容会直接包含在初始 HTML 中
import "./Header.css";

export default function Header() {
  return (
    <header className="page-header" style={{ "--header-height": "100px" } as React.CSSProperties}>
      <h1>AI Chatbot Assistant</h1>
      <p>Powered by OpenAI - Ask me anything!</p>
    </header>
  );
}

