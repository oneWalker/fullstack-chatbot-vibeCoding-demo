# 快速开始指南

5 分钟内启动 Next.js 版本的 AI Chatbot！

## 🚀 快速启动（3 步）

### 1. 安装依赖

```bash
cd frontend-nextjs
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
# 复制示例文件
cp .env.example .env.local

# 或手动创建
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3000" > .env.local
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5174 🎉

## ✅ 前置条件

- ✅ Node.js >= 18
- ✅ npm or yarn
- ✅ 后端服务运行在 `localhost:3000`

## 📋 完整步骤

### Step 1: 克隆/定位项目

```bash
cd /path/to/interviewProjects/frontend-nextjs
```

### Step 2: 安装依赖

```bash
npm install
# 或
yarn install
```

预计时间: 2-3 分钟

### Step 3: 环境配置

创建 `.env.local`:

```env
# API 后端地址
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# 可选：开发环境
NODE_ENV=development
```

### Step 4: 启动后端

**重要**: 确保后端服务正在运行！

```bash
# 在另一个终端
cd ../backend
npm run start:dev
```

后端应该运行在: http://localhost:3000

### Step 5: 启动前端

```bash
npm run dev
```

你应该看到:

```
  ▲ Next.js 14.1.0
  - Local:        http://localhost:5174
  - Network:      http://192.168.x.x:5174

 ✓ Ready in 2.3s
```

### Step 6: 打开浏览器

访问: http://localhost:5174

## 🎯 验证安装

### 1. 检查页面加载

- ✅ 页面标题显示 "AI Chatbot Assistant"
- ✅ 左侧显示会话历史侧边栏
- ✅ 中间显示聊天界面
- ✅ 欢迎消息 "👋 Welcome!"

### 2. 测试基本功能

```
1. 输入消息: "Hello"
2. 点击 Send 按钮
3. 观察 AI 回复是否流式显示
4. 检查历史记录是否保存
```

### 3. 检查控制台

打开浏览器开发者工具 (F12):

- ✅ 无红色错误
- ✅ 可能有一些警告（正常）

## 🐛 常见问题快速解决

### 问题 1: 端口被占用

```bash
# 错误: Port 5174 is already in use
# 解决: 更改端口
npm run dev -- -p 5175
```

### 问题 2: "npm install" 失败

```bash
# 清理缓存
npm cache clean --force

# 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题 3: 连接后端失败

**检查后端是否运行**:

```bash
curl http://localhost:3000/chatbot/health
```

应该返回:
```json
{"status":"ok","message":"Chatbot service is running"}
```

**如果后端未运行**:

```bash
cd ../backend
npm install
npm run start:dev
```

### 问题 4: 环境变量未生效

**确保**:
1. 文件名是 `.env.local`（注意前面的点）
2. 变量有 `NEXT_PUBLIC_` 前缀
3. 重启开发服务器

```bash
# 停止服务器 (Ctrl+C)
# 重新启动
npm run dev
```

### 问题 5: 样式未加载

**检查**:
- 浏览器控制台是否有 CSS 错误
- 尝试清除浏览器缓存 (Ctrl+Shift+R)
- 检查 `globals.css` 是否正确导入

```bash
# 重新构建
rm -rf .next
npm run dev
```

## 📱 测试不同设备

### 桌面端

- ✅ 侧边栏固定显示
- ✅ 宽度 >= 769px

### 移动端

- ✅ 侧边栏可折叠
- ✅ 汉堡菜单按钮（左上角 ☰）
- ✅ 宽度 < 769px

## 🔧 开发工具推荐

### VS Code 扩展

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Chrome 扩展

- React Developer Tools
- Redux DevTools (如果使用)

## 📊 性能检查

### Lighthouse 测试

1. 打开 Chrome DevTools (F12)
2. 切换到 "Lighthouse" 标签
3. 选择 "Performance" 和 "Best practices"
4. 点击 "Generate report"

**预期分数**:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## 🚢 生产构建

### 构建

```bash
npm run build
```

预计时间: 30-60 秒

### 启动生产服务器

```bash
npm run start
```

访问: http://localhost:5174

### 验证构建

```bash
# 检查构建输出
ls -lh .next/

# 应该看到
.next/
├── cache/
├── server/
├── static/
└── BUILD_ID
```

## 📦 Docker 部署（可选）

### 创建 Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5174

CMD ["npm", "start"]
```

### 构建镜像

```bash
docker build -t chatbot-nextjs .
```

### 运行容器

```bash
docker run -p 5174:5174 \
  -e NEXT_PUBLIC_API_BASE_URL=http://backend:3000 \
  chatbot-nextjs
```

## 🎓 下一步

现在你已经成功运行项目了，可以：

1. 📖 阅读 [README.md](./README.md) 了解详细信息
2. 🔄 查看 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) 学习如何迁移
3. 📊 阅读 [PROJECT_COMPARISON.md](./PROJECT_COMPARISON.md) 了解与 Vite 版本的区别
4. 💡 开始开发你的功能！

## 📞 需要帮助？

- 📚 [Next.js 官方文档](https://nextjs.org/docs)
- 🐛 [GitHub Issues](https://github.com/vercel/next.js/issues)
- 💬 [Discord 社区](https://nextjs.org/discord)

## ✨ 提示

- 使用 `Ctrl+C` 停止开发服务器
- 使用 `npm run lint` 检查代码质量
- 修改代码会自动热重载
- 保存文件时自动格式化（如果配置了 Prettier）

---

**祝你开发愉快！** 🚀

如有问题，请查看 [README.md](./README.md) 或 [常见问题](#-常见问题快速解决) 部分。

