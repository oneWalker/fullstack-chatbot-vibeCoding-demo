# AI Chatbot 功能完整指南

## 📋 目录

1. [项目概述](#项目概述)
2. [流式响应功能](#流式响应功能)
3. [历史记录功能](#历史记录功能)
4. [快速开始](#快速开始)
5. [API 接口文档](#api-接口文档)

---

## 项目概述

这是一个基于 NestJS + React + MongoDB 的 AI 聊天机器人项目，集成了 OpenAI API，提供了流式响应和完整的历史记录管理功能。

### 技术栈

- **后端**: NestJS, MongoDB, OpenAI API, TypeScript
- **前端**: React 18, TypeScript, Axios, CSS3
- **数据库**: MongoDB

---

## 流式响应功能

### 功能特点

- ✅ 实时流式输出 AI 回复
- ✅ 打字机效果显示
- ✅ 闪烁光标动画
- ✅ 平滑的文本过渡
- ✅ 自动滚动到最新消息

### 实现原理

#### 后端

使用 Server-Sent Events (SSE) 实时推送 AI 响应：

```typescript
// chatbot.controller.ts
@Post('message/stream')
async sendMessageStream(@Body() dto, @Res() res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  // 流式推送数据
}
```

#### 前端

使用 Fetch API 的 ReadableStream 处理流式数据：

```typescript
const reader = response.body?.getReader();
while (true) {
  const { done, value } = await reader.read();
  // 实时更新 UI
}
```

### 数据格式

```
data: {"type": "start", "conversationId": "..."}
data: {"type": "content", "content": "文字内容"}
data: {"type": "end", "timestamp": "..."}
```

---

## 历史记录功能

### 功能特点

- 📋 查看所有历史会话
- 🔄 快速切换会话
- ➕ 创建新会话
- 🗑️ 删除会话
- 🕐 智能时间显示
- 💬 显示消息数量
- 📱 响应式设计

### 界面布局

**桌面端**

```
┌────────────────┬──────────────────────────┐
│                │      Header              │
│ History        ├──────────────────────────┤
│ Sidebar        │                          │
│ (320px)        │   Chat Messages          │
│                │                          │
│ ○ Conv 1       │                          │
│ ○ Conv 2       │                          │
│ ● Conv 3       ├──────────────────────────┤
│                │      Footer              │
└────────────────┴──────────────────────────┘
```

**移动端**

- 侧边栏可折叠
- 汉堡菜单按钮
- 半透明遮罩

### 会话信息显示

每个会话项显示：

- 📝 会话标题（基于首条消息）
- 💬 消息总数
- 🕐 最后活动时间
- 🗑️ 删除按钮

### 时间格式化

- < 1 小时: "Just now"
- < 24 小时: "5h ago"
- < 48 小时: "Yesterday"
- ≥ 48 小时: "2025/11/03"

---

## 快速开始

### 1. 环境要求

```bash
Node.js >= 18
MongoDB >= 5.0
npm or yarn
```

### 2. 后端启动

```bash
cd backend
npm install

# 配置环境变量 (.env)
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=your_base_url
MONGODB_URI=mongodb://localhost:27017/chatbot

# 启动开发服务器
npm run start:dev
```

后端服务运行在 `http://localhost:3000`

### 3. 前端启动

```bash
cd frontend
npm install

# 启动开发服务器
npm run dev
```

前端应用运行在 `http://localhost:5173`

### 4. 体验功能

**测试流式响应**

1. 打开前端应用
2. 输入任意问题
3. 观察 AI 回复的流式显示效果

**测试历史记录**

1. 发送几条消息创建对话
2. 点击 "New Chat" 创建新会话
3. 在左侧历史列表中切换会话
4. 点击删除按钮删除会话

---

## API 接口文档

### Base URL

```
http://localhost:3000/chatbot
```

### 1. 发送消息（非流式）

```http
POST /message
Content-Type: application/json

{
  "message": "你好",
  "conversationId": "conv_123"
}
```

**响应**

```json
{
  "message": "AI 回复内容",
  "conversationId": "conv_123",
  "timestamp": "2025-11-03T10:30:00.000Z"
}
```

### 2. 发送消息（流式）

```http
POST /message/stream
Content-Type: application/json

{
  "message": "你好",
  "conversationId": "conv_123"
}
```

**响应** (Server-Sent Events)

```
data: {"type":"start","conversationId":"conv_123"}

data: {"type":"content","content":"你"}

data: {"type":"content","content":"好"}

data: {"type":"end","timestamp":"2025-11-03T10:30:00.000Z"}
```

### 3. 获取会话历史

```http
GET /history/:conversationId
```

**响应**

```json
[
  {
    "conversationId": "conv_123",
    "role": "user",
    "content": "你好",
    "createdAt": "2025-11-03T10:30:00.000Z"
  },
  {
    "conversationId": "conv_123",
    "role": "assistant",
    "content": "你好！有什么可以帮助你的吗？",
    "createdAt": "2025-11-03T10:30:05.000Z"
  }
]
```

### 4. 获取所有会话列表

```http
GET /conversations
```

**响应**

```json
[
  {
    "conversationId": "conv_123",
    "lastMessage": "最后一条消息",
    "lastMessageRole": "assistant",
    "lastMessageTime": "2025-11-03T10:30:00.000Z",
    "messageCount": 10,
    "firstMessage": "第一条消息"
  }
]
```

### 5. 删除会话

```http
POST /conversations/:conversationId/delete
```

**响应**

```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

### 6. 健康检查

```http
GET /health
```

**响应**

```json
{
  "status": "ok",
  "message": "Chatbot service is running"
}
```

---

## 前端组件结构

```
src/
├── components/
│   ├── chatbot.component.tsx          # 主聊天组件
│   ├── chatbot.component.css          # 聊天组件样式
│   ├── conversation-history.component.tsx  # 历史记录侧边栏
│   └── conversation-history.component.css  # 侧边栏样式
├── pages/
│   ├── chatbot.page.tsx               # 聊天页面
│   └── chatbot.page.css               # 页面样式
├── App.tsx
└── main.tsx
```

---

## 后端模块结构

```
src/
├── chatbot/
│   ├── chatbot.controller.ts          # 路由控制器
│   ├── chatbot.service.ts             # 业务逻辑
│   ├── chatbot.module.ts              # 模块定义
│   ├── dto/
│   │   └── create-message.dto.ts      # 数据传输对象
│   └── entities/
│       └── message.entity.ts          # 消息实体
├── app.module.ts
└── main.ts
```

---

## 数据模型

### Message（消息）

```typescript
{
  conversationId: string; // 会话ID
  role: string; // user | assistant | system
  content: string; // 消息内容
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
}
```

### Conversation（会话聚合）

```typescript
{
  conversationId: string; // 会话ID
  lastMessage: string; // 最后消息
  lastMessageRole: string; // 最后消息角色
  lastMessageTime: Date; // 最后消息时间
  messageCount: number; // 消息总数
  firstMessage: string; // 首条消息
}
```

---

## 性能优化

### 后端

- ✅ MongoDB 索引优化（conversationId）
- ✅ 聚合管道优化查询
- ✅ 流式响应降低内存占用

### 前端

- ✅ React key 优化重渲染
- ✅ 防抖优化滚动
- ✅ CSS 动画使用 GPU 加速
- ✅ 懒加载历史会话

---

## 错误处理

### 后端

- ✅ Try-catch 捕获异常
- ✅ 错误日志记录
- ✅ 友好的错误消息

### 前端

- ✅ 网络请求错误提示
- ✅ 加载状态显示
- ✅ 空状态处理
- ✅ 确认对话框

---

## 安全性

- ✅ API Key 环境变量管理
- ✅ CORS 配置
- ✅ 输入验证
- ✅ XSS 防护

---

## 浏览器兼容性

| 浏览器        | 版本 | 支持 |
| ------------- | ---- | ---- |
| Chrome        | ≥ 90 | ✅   |
| Edge          | ≥ 90 | ✅   |
| Firefox       | ≥ 88 | ✅   |
| Safari        | ≥ 14 | ✅   |
| Mobile Safari | ≥ 14 | ✅   |
| Chrome Mobile | ≥ 90 | ✅   |

---

## 常见问题

### Q: 流式响应不工作？

**A**: 检查以下几点：

1. 浏览器是否支持 ReadableStream
2. 网络是否稳定
3. 后端 SSE 头是否正确设置

### Q: 历史记录不显示？

**A**: 检查：

1. MongoDB 连接是否正常
2. 是否有会话数据
3. API 接口是否正常返回

### Q: 移动端侧边栏不显示？

**A**: 点击左上角汉堡菜单按钮（☰）

---

## 未来功能规划

- [ ] 搜索历史会话
- [ ] 会话标签分类
- [ ] 导出会话记录
- [ ] 多语言支持
- [ ] 语音输入/输出
- [ ] Markdown 实时渲染
- [ ] 代码高亮
- [ ] 图片上传识别
- [ ] 会话分享
- [ ] 用户系统

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

---

## 许可证

MIT License

---

**项目创建日期**: 2025 年 11 月 3 日
**当前版本**: 2.0.0
**文档更新**: 2025 年 11 月 3 日
