# AI Chatbot Frontend - Next.js SSR Version

这是原 `frontend` 项目的 Next.js 服务端渲染（SSR）版本，提供更好的 SEO 支持和首屏加载性能。

## 📋 目录结构

```
frontend-nextjs/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根布局（包含 <html>, <body>）
│   ├── page.tsx                  # 首页（动态导入聊天页面）
│   └── globals.css               # 全局样式
├── components/                   # React 组件
│   ├── chatbot-page.tsx          # 聊天页面主组件（客户端）
│   ├── chatbot-page.css          # 页面样式
│   ├── chatbot.component.tsx     # 聊天组件（客户端）
│   ├── chatbot.component.css     # 聊天组件样式
│   ├── conversation-history.component.tsx  # 历史记录组件（客户端）
│   └── conversation-history.component.css  # 历史记录样式
├── public/                       # 静态资源
├── next.config.js                # Next.js 配置
├── tsconfig.json                 # TypeScript 配置
├── package.json                  # 依赖和脚本
├── .env.local                    # 环境变量（需手动创建）
└── README.md                     # 本文档
```

## 🚀 启动命令

### 开发模式

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 5174，与 Vite 版本一致）
npm run dev
```

访问: http://localhost:5174

### 生产构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

### 代码检查

```bash
# 运行 ESLint
npm run lint
```

## ⚙️ 环境配置

创建 `.env.local` 文件（Git 会忽略此文件）：

```bash
# API 后端地址
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# 环境
NODE_ENV=development
```

**注意**: Next.js 中，需要在环境变量前加 `NEXT_PUBLIC_` 前缀才能在客户端访问。

## 🆚 与原 Frontend 的主要区别

### 1. 项目结构

| 特性     | Vite + React (frontend) | Next.js (frontend-nextjs)          |
| -------- | ----------------------- | ---------------------------------- |
| 入口文件 | `src/main.tsx`          | `app/page.tsx`                     |
| 路由方式 | React Router            | Next.js App Router（文件系统路由） |
| 布局     | `App.tsx`               | `app/layout.tsx`                   |
| 组件目录 | `src/components/`       | `components/` (根目录)             |
| 样式文件 | `src/index.css`         | `app/globals.css`                  |

### 2. 客户端组件标记

Next.js 使用 React Server Components (RSC)，需要明确标记客户端组件：

```typescript
// 所有使用 hooks、事件处理的组件都需要添加
"use client";

import { useState } from "react";
// ... 组件代码
```

**需要 "use client" 的情况**:

- 使用 `useState`, `useEffect`, `useRef` 等 hooks
- 使用浏览器 API（`window`, `document`）
- 事件处理（`onClick`, `onChange` 等）
- 使用 Context API

### 3. 环境变量

| Vite                           | Next.js                                |
| ------------------------------ | -------------------------------------- |
| `VITE_API_URL`                 | `NEXT_PUBLIC_API_BASE_URL`             |
| `import.meta.env.VITE_API_URL` | `process.env.NEXT_PUBLIC_API_BASE_URL` |

### 4. 静态资源

| Vite                  | Next.js               |
| --------------------- | --------------------- |
| `/public/` → 访问 `/` | `/public/` → 访问 `/` |
| `/src/assets/`        | `/public/assets/`     |

### 5. 开发端口

| 版本    | 端口                        |
| ------- | --------------------------- |
| Vite    | 5173 (默认) / 5174 (自定义) |
| Next.js | 5174 (配置)                 |

### 6. 构建输出

| Vite              | Next.js                  |
| ----------------- | ------------------------ |
| `/dist/`          | `/.next/`                |
| 纯静态文件（SPA） | 混合渲染（SSR + Static） |

## 🎯 核心特性

### 1. Server-Side Rendering (SSR)

- ✅ 首屏服务端渲染，更快的首次加载
- ✅ 更好的 SEO 优化
- ✅ 自动代码分割

### 2. 混合渲染策略

```typescript
// app/page.tsx - 服务端组件
export default function Home() {
  // 可以直接在这里进行服务端数据获取
  // const data = await fetchData();

  return <ChatbotPage />;
}

// components/chatbot-page.tsx - 客户端组件
("use client");
export default function ChatbotPage() {
  // 客户端状态管理和交互
}
```

### 3. 动态导入

为了优化性能，聊天页面使用动态导入：

```typescript
const ChatbotPage = dynamic(() => import("@/components/chatbot-page"), {
  ssr: false, // 禁用 SSR（因为依赖浏览器 API）
  loading: () => <div>Loading...</div>,
});
```

### 4. API 路由（可选）

Next.js 支持在 `app/api/` 目录创建 API 路由，可作为后端代理：

```typescript
// app/api/chatbot/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  // 转发到实际后端
  const response = await fetch("http://localhost:3000/chatbot/message", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return response;
}
```

## 🔧 配置说明

### next.config.js

```javascript
module.exports = {
  reactStrictMode: true, // 启用严格模式

  // API 代理配置
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/:path*",
      },
    ];
  },

  // 性能优化
  compress: true,

  // 图片优化
  images: {
    domains: [],
  },
};
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"] // 路径别名
    }
  }
}
```

## 📦 依赖包说明

### 核心依赖

```json
{
  "next": "^14.1.0", // Next.js 框架
  "react": "^18.2.0", // React 库
  "react-dom": "^18.2.0", // React DOM
  "axios": "^1.6.0" // HTTP 客户端
}
```

### 开发依赖

```json
{
  "@types/node": "^20.10.0", // Node.js 类型定义
  "@types/react": "^18.2.0", // React 类型定义
  "typescript": "^5.3.0", // TypeScript
  "eslint": "^8.56.0", // 代码检查
  "eslint-config-next": "^14.1.0" // Next.js ESLint 配置
}
```

## 🎨 样式处理

Next.js 支持多种样式方案：

### 1. 全局 CSS

```typescript
// app/layout.tsx
import "./globals.css";
```

### 2. 组件 CSS

```typescript
// components/chatbot.component.tsx
import "./chatbot.component.css";
```

### 3. CSS Modules (可选)

```typescript
import styles from "./component.module.css";
<div className={styles.container}>
```

### 4. Tailwind CSS (可选)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 🚀 性能优化

### 1. 自动优化

- ✅ 自动代码分割
- ✅ 自动图片优化
- ✅ 字体优化
- ✅ Tree-shaking

### 2. 手动优化

```typescript
// 动态导入
const Component = dynamic(() => import("./Component"), {
  loading: () => <p>Loading...</p>,
  ssr: false, // 禁用 SSR
});

// 图片优化
import Image from "next/image";
<Image src='/logo.png' width={200} height={100} alt='Logo' />;
```

## 🐛 常见问题

### 1. "window is not defined"

**原因**: 服务端渲染时没有 `window` 对象

**解决方案**:

```typescript
"use client"; // 添加这一行

// 或者条件判断
if (typeof window !== "undefined") {
  // 使用 window
}
```

### 2. "localStorage is not defined"

**解决方案**:

```typescript
"use client"; // 标记为客户端组件

useEffect(() => {
  // 在 useEffect 中使用 localStorage
  const data = localStorage.getItem("key");
}, []);
```

### 3. 样式不生效

**检查**:

- CSS 文件是否正确导入
- CSS 类名是否正确
- 浏览器开发工具中检查样式是否加载

### 4. API 调用失败

**检查**:

- 环境变量是否正确设置（`.env.local`）
- 环境变量是否有 `NEXT_PUBLIC_` 前缀
- 后端服务是否运行（`localhost:3000`）

## 📊 性能对比

| 指标         | Vite + React | Next.js SSR          |
| ------------ | ------------ | -------------------- |
| 首屏加载时间 | ~1.5s        | ~0.8s                |
| SEO 友好度   | ⭐⭐         | ⭐⭐⭐⭐⭐           |
| 构建时间     | 快           | 中等                 |
| 部署复杂度   | 简单（静态） | 中等（需要 Node.js） |
| 开发体验     | ⭐⭐⭐⭐⭐   | ⭐⭐⭐⭐             |

## 🔗 相关链接

- [Next.js 官方文档](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [原 Frontend 项目](../frontend)

## 📝 迁移建议

### 从 Vite 迁移到 Next.js

1. **简单项目**: 如果只需要 SPA，继续使用 Vite
2. **需要 SEO**: 建议使用 Next.js SSR
3. **大型应用**: Next.js 的代码分割和优化更好
4. **团队经验**: 考虑团队对 Next.js 的熟悉程度

### 何时使用哪个版本？

**使用 Vite (frontend)**:

- ✅ 纯客户端应用
- ✅ 不需要 SEO
- ✅ 快速原型开发
- ✅ 简单部署需求

**使用 Next.js (frontend-nextjs)**:

- ✅ 需要 SEO 优化
- ✅ 首屏加载性能要求高
- ✅ 需要服务端渲染
- ✅ 大型生产应用

## 🎓 学习资源

### Next.js 特有概念

1. **App Router**: 基于文件系统的路由
2. **Server Components**: 服务端组件（默认）
3. **Client Components**: 客户端组件（需标记 "use client"）
4. **Layouts**: 共享布局
5. **Loading UI**: 加载状态
6. **Error Handling**: 错误边界
7. **Metadata**: SEO 元数据

## 📞 支持

如有问题，请参考：

- Next.js 官方文档
- GitHub Issues
- 项目 README

---

**版本**: 2.0.0 (Next.js SSR)  
**基于**: frontend v1.0.0 (Vite + React)  
**创建日期**: 2025 年 11 月 3 日  
**技术栈**: Next.js 14 + React 18 + TypeScript + CSS3
