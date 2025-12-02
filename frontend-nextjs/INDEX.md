# Frontend-Next.js 项目索引

欢迎来到 AI Chatbot 的 Next.js 版本！这个文档帮助你快速导航项目。

## 📚 文档导航

### 🚀 快速开始
- **[QUICK_START.md](./QUICK_START.md)** - 5分钟快速启动指南
  - 3步启动项目
  - 环境配置
  - 常见问题解决

### 📖 项目文档
- **[README.md](./README.md)** - 完整项目文档
  - 目录结构
  - 启动命令
  - 配置说明
  - 技术栈详解

### 🔄 迁移指南
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Vite 到 Next.js 迁移
  - 详细迁移步骤
  - 代码修改示例
  - 常见错误解决

### 📊 项目对比
- **[PROJECT_COMPARISON.md](./PROJECT_COMPARISON.md)** - 两版本对比
  - 性能对比
  - 功能差异
  - 使用场景建议

## 📁 项目文件结构

```
frontend-nextjs/
│
├── 📄 文档文件
│   ├── INDEX.md                    # 本文件（项目索引）
│   ├── README.md                   # 主文档
│   ├── QUICK_START.md              # 快速开始
│   ├── MIGRATION_GUIDE.md          # 迁移指南
│   └── PROJECT_COMPARISON.md       # 项目对比
│
├── ⚙️ 配置文件
│   ├── package.json                # 依赖和脚本
│   ├── next.config.js              # Next.js 配置
│   ├── tsconfig.json               # TypeScript 配置
│   ├── .eslintrc.json              # ESLint 配置
│   ├── .env.example                # 环境变量示例
│   ├── .gitignore                  # Git 忽略文件
│   └── .env.local                  # 环境变量（需创建）
│
├── 🎨 应用目录 (app/)
│   ├── layout.tsx                  # 根布局
│   ├── page.tsx                    # 首页
│   └── globals.css                 # 全局样式
│
├── 🧩 组件目录 (components/)
│   ├── chatbot-page.tsx            # 聊天页面
│   ├── chatbot-page.css
│   ├── chatbot.component.tsx       # 聊天组件
│   ├── chatbot.component.css
│   ├── conversation-history.component.tsx
│   └── conversation-history.component.css
│
└── 📦 静态资源 (public/)
    └── (图片、字体等)
```

## 🎯 阅读建议

### 如果你是...

#### 👨‍💻 新手开发者
1. 先读 [QUICK_START.md](./QUICK_START.md)
2. 再读 [README.md](./README.md) 的"快速开始"部分
3. 遇到问题查看"常见问题"章节

#### 🔧 从 Vite 迁移
1. 先读 [PROJECT_COMPARISON.md](./PROJECT_COMPARISON.md) 了解差异
2. 再读 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) 详细步骤
3. 参考 [README.md](./README.md) 的配置说明

#### 👨‍🏫 项目负责人
1. 阅读 [PROJECT_COMPARISON.md](./PROJECT_COMPARISON.md) 评估技术选型
2. 查看 [README.md](./README.md) 的"性能对比"和"使用场景"
3. 参考成本和复杂度分析

#### 🚀 准备部署
1. 阅读 [README.md](./README.md) 的"生产构建"部分
2. 查看 [QUICK_START.md](./QUICK_START.md) 的"Docker 部署"
3. 参考环境配置说明

## 🔑 核心概念速查

### Next.js 关键概念

| 概念 | 说明 | 文件位置 |
|------|------|---------|
| App Router | 基于文件系统的路由 | `app/` 目录 |
| Server Components | 服务端组件（默认） | 无标记的组件 |
| Client Components | 客户端组件 | 带 `"use client"` |
| Layout | 共享布局 | `app/layout.tsx` |
| Page | 页面组件 | `app/page.tsx` |
| Dynamic Import | 动态导入 | `app/page.tsx` |

### 项目特有概念

| 概念 | 说明 | 相关文件 |
|------|------|---------|
| 流式响应 | AI 回复逐字显示 | `chatbot.component.tsx` |
| 会话历史 | 历史记录管理 | `conversation-history.component.tsx` |
| SSR | 服务端渲染 | `app/layout.tsx` |

## 📖 代码示例速查

### 创建客户端组件

```typescript
"use client";

import { useState } from "react";

export default function MyComponent() {
  const [state, setState] = useState(0);
  return <div onClick={() => setState(s => s + 1)}>{state}</div>;
}
```

### 访问环境变量

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

### 动态导入组件

```typescript
import dynamic from 'next/dynamic';

const Component = dynamic(() => import('./Component'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});
```

## 🛠️ 常用命令速查

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
npm run lint             # 代码检查

# 依赖管理
npm install              # 安装依赖
npm install [package]    # 安装新包
npm update              # 更新依赖

# 清理
rm -rf .next node_modules  # 清理构建和依赖
npm install              # 重新安装
```

## 🔗 相关链接

### 项目相关
- [原 Frontend 项目](../frontend)
- [后端项目](../backend)
- [数据库配置](../database)

### 官方文档
- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

### 学习资源
- [Next.js Learn](https://nextjs.org/learn)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Next.js Discord](https://nextjs.org/discord)

## 📊 项目统计

- **创建日期**: 2025年11月3日
- **版本**: 2.0.0
- **技术栈**: Next.js 14 + React 18 + TypeScript
- **文档页数**: 5 个主要文档
- **代码行数**: ~800 行（不含依赖）
- **组件数量**: 3 个主要组件

## ✅ 检查清单

### 首次使用
- [ ] 阅读 QUICK_START.md
- [ ] 安装依赖 `npm install`
- [ ] 创建 `.env.local`
- [ ] 启动开发服务器
- [ ] 测试基本功能

### 开发中
- [ ] 了解 "use client" 使用场景
- [ ] 熟悉环境变量使用
- [ ] 理解 SSR/CSR 区别
- [ ] 掌握 Next.js 路由

### 部署前
- [ ] 运行 `npm run build`
- [ ] 测试生产版本
- [ ] 检查环境变量
- [ ] 运行 Lighthouse 测试
- [ ] 检查控制台无错误

## 🎯 快速链接

### 我想...

- **快速启动项目** → [QUICK_START.md](./QUICK_START.md)
- **了解项目详情** → [README.md](./README.md)
- **从 Vite 迁移** → [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- **对比两个版本** → [PROJECT_COMPARISON.md](./PROJECT_COMPARISON.md)
- **解决具体问题** → 各文档的"常见问题"章节
- **学习 Next.js** → [官方文档](https://nextjs.org/docs)

## 💡 提示

- 🔖 将本文件加入书签，作为项目导航
- 📝 所有文档都支持 Markdown 渲染
- 🔍 使用 Ctrl+F 快速搜索内容
- 📱 文档在移动设备上同样易读

## 📞 获取帮助

遇到问题时的解决顺序：

1. 查看相关文档的"常见问题"章节
2. 检查 GitHub Issues
3. 参考 Next.js 官方文档
4. 在项目中搜索类似代码
5. 向团队寻求帮助

---

**Happy Coding!** 🚀

最后更新: 2025年11月3日

