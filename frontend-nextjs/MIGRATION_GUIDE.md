# 从 Vite + React 迁移到 Next.js 指南

本文档详细说明如何将 `frontend` 项目迁移到 `frontend-nextjs`。

## 📋 迁移清单

### 1. 项目初始化

```bash
# 创建 Next.js 项目
npx create-next-app@latest frontend-nextjs --typescript --eslint --no-tailwind --app --no-src-dir

# 或手动创建目录结构
mkdir -p frontend-nextjs/{app,components,public}
```

### 2. 依赖迁移

#### 删除 Vite 相关依赖

```json
// 不需要的依赖
"vite"
"@vitejs/plugin-react"
"vite-tsconfig-paths"
```

#### 添加 Next.js 依赖

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### 3. 文件迁移对照表

| 原文件 (Vite) | 新文件 (Next.js) | 说明 |
|---------------|------------------|------|
| `src/main.tsx` | `app/page.tsx` | 入口文件 |
| `src/App.tsx` | `app/layout.tsx` | 应用布局 |
| `src/index.css` | `app/globals.css` | 全局样式 |
| `src/components/*.tsx` | `components/*.tsx` | 组件文件 |
| `public/*` | `public/*` | 静态资源（无变化） |
| `vite.config.ts` | `next.config.js` | 配置文件 |

### 4. 代码修改

#### A. 添加 "use client" 指令

**所有使用以下特性的组件都需要添加**:

```typescript
"use client"; // 文件第一行

import { useState } from "react";
// ... 其他代码
```

**需要添加的情况**:
- ✅ 使用 hooks (`useState`, `useEffect`, `useRef`, 等)
- ✅ 使用事件处理 (`onClick`, `onChange`, 等)
- ✅ 使用浏览器 API (`window`, `document`, `localStorage`, 等)
- ✅ 使用 Context API
- ✅ 使用第三方 UI 库（大多数）

#### B. 环境变量修改

```typescript
// Vite
const apiUrl = import.meta.env.VITE_API_URL;

// Next.js
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

**重要**: Next.js 中，客户端可访问的环境变量必须有 `NEXT_PUBLIC_` 前缀。

#### C. 导入路径别名

```typescript
// Vite (需要配置 vite-tsconfig-paths)
import Component from "~/components/Component";

// Next.js (内置支持)
import Component from "@/components/Component";
```

#### D. 静态资源引用

```typescript
// 两者相同
<img src="/logo.png" alt="Logo" />

// Next.js 优化版本（推荐）
import Image from 'next/image';
<Image src="/logo.png" width={200} height={100} alt="Logo" />
```

### 5. 配置文件迁移

#### vite.config.ts → next.config.js

```javascript
// vite.config.ts
export default defineConfig({
  server: {
    port: 5174,
  },
});

// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/:path*',
      },
    ];
  },
};

// 端口配置移到 package.json
"dev": "next dev -p 5174"
```

### 6. 组件迁移示例

#### 原组件 (Vite)

```typescript
// src/components/Counter.tsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

#### 迁移后 (Next.js)

```typescript
// components/Counter.tsx
"use client"; // ← 添加这一行

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### 7. 路由迁移

#### Vite + React Router

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### Next.js App Router

```
app/
├── page.tsx          # / 路由
├── about/
│   └── page.tsx      # /about 路由
└── layout.tsx        # 共享布局
```

```typescript
// app/page.tsx
export default function Home() {
  return <div>Home Page</div>;
}

// app/about/page.tsx
export default function About() {
  return <div>About Page</div>;
}
```

### 8. API 调用迁移

#### 保持不变的部分

```typescript
// 在客户端组件中，API 调用方式完全相同
const response = await axios.get('/api/data');
const data = await fetch('/api/data');
```

#### Next.js 特有优化

```typescript
// 服务端组件可以直接获取数据
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store', // 或 'force-cache'
  });
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts(); // 服务端获取
  return (
    <div>
      {posts.map(post => <div key={post.id}>{post.title}</div>)}
    </div>
  );
}
```

### 9. 样式迁移

#### 全局样式

```typescript
// 原: src/main.tsx
import './index.css';

// 新: app/layout.tsx
import './globals.css';
```

#### 组件样式

```typescript
// 完全相同
import './component.css';
```

#### CSS Modules (可选)

```typescript
// 原: import './component.css';
// 新: import styles from './component.module.css';
<div className={styles.container}>
```

### 10. TypeScript 配置

#### tsconfig.json 主要差异

```json
{
  "compilerOptions": {
    // Vite
    "target": "ES2020",
    "module": "ESNext",
    
    // Next.js
    "target": "ES2017",
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve", // Next.js 特有
    "plugins": [{ "name": "next" }], // Next.js 插件
    "paths": {
      "@/*": ["./*"] // 路径别名
    }
  }
}
```

### 11. 常见错误及解决方案

#### Error 1: "window is not defined"

```typescript
// ❌ 错误
const width = window.innerWidth;

// ✅ 方案 1: 添加 "use client"
"use client";
const width = window.innerWidth;

// ✅ 方案 2: 条件判断
const width = typeof window !== 'undefined' ? window.innerWidth : 0;

// ✅ 方案 3: useEffect
useEffect(() => {
  const width = window.innerWidth;
}, []);
```

#### Error 2: "You're importing a component that needs..."

```typescript
// ❌ 错误：服务端组件导入客户端组件
// app/page.tsx
import ClientComponent from './ClientComponent'; // 有 "use client"

// ✅ 解决：使用动态导入
import dynamic from 'next/dynamic';
const ClientComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false,
});
```

#### Error 3: "Hydration failed"

```typescript
// ❌ 错误：服务端和客户端渲染不一致
<div>{new Date().toISOString()}</div>

// ✅ 解决：使用 useEffect 或 suppressHydrationWarning
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
return <div>{new Date().toISOString()}</div>;
```

### 12. 性能优化迁移

#### 懒加载

```typescript
// Vite
const Component = React.lazy(() => import('./Component'));

// Next.js
import dynamic from 'next/dynamic';
const Component = dynamic(() => import('./Component'));
```

#### 预加载

```typescript
// Next.js 自动处理
import Link from 'next/link';
<Link href="/about" prefetch>About</Link>
```

### 13. 部署迁移

#### Vite (静态部署)

```bash
npm run build
# dist/ 目录可以部署到任何静态服务器
```

#### Next.js (需要 Node.js)

```bash
npm run build
npm run start
# 需要 Node.js 服务器运行
```

**部署选项**:
- Vercel (推荐，零配置)
- Docker + Node.js
- PM2 进程管理

### 14. 测试迁移

```bash
# 安装测试依赖
npm install -D @testing-library/react @testing-library/jest-dom jest

# 配置 jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

### 15. 最终检查清单

- [ ] 所有组件都添加了 "use client"（如需要）
- [ ] 环境变量使用 NEXT_PUBLIC_ 前缀
- [ ] 导入路径使用 @ 别名
- [ ] 移除所有 Vite 相关代码
- [ ] 更新 package.json 脚本
- [ ] 测试所有功能
- [ ] 检查控制台无错误
- [ ] 验证 SSR 正常工作
- [ ] 性能测试通过

## 🎯 迁移时间估计

| 项目规模 | 预计时间 |
|---------|---------|
| 小型 (< 10 组件) | 1-2 小时 |
| 中型 (10-50 组件) | 半天 - 1 天 |
| 大型 (> 50 组件) | 2-5 天 |

## 📚 推荐阅读

1. [Next.js 官方迁移指南](https://nextjs.org/docs/migrating)
2. [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
3. [App Router 路由](https://nextjs.org/docs/app/building-your-application/routing)

## 💡 提示

- 先迁移小组件，再迁移大页面
- 使用 Git 分支进行迁移
- 保持原项目运行，便于对比测试
- 逐步迁移，而不是一次性全部改变

---

**更新日期**: 2025年11月3日

