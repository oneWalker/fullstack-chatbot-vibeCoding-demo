import type { Metadata, Viewport } from "next";
import "./globals.css";

// 服务端组件 - 根布局配置
export const metadata: Metadata = {
  title: "AI Chatbot Assistant - SSR Enhanced",
  description: "Powered by OpenAI with Next.js Server-Side Rendering for better performance",
  keywords: ["AI", "Chatbot", "OpenAI", "Next.js", "SSR", "Server Components"],
  authors: [{ name: "Your Name" }],
};

// Viewport 配置需要单独导出（Next.js 14+ 要求）
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 额外的 meta 标签可以在这里添加 */}
      </head>
      <body>{children}</body>
    </html>
  );
}

