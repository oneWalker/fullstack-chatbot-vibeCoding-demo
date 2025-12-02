#!/bin/bash

# ============================================
# Git 配置检查脚本
# ============================================

echo "🔍 检查 Git 配置..."
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否在项目根目录
if [ ! -f ".gitignore" ]; then
    echo -e "${RED}❌ 错误：请在项目根目录运行此脚本${NC}"
    exit 1
fi

echo "✅ 当前目录：$(pwd)"
echo ""

# 1. 检查 .gitignore 文件
echo "📄 检查 .gitignore 文件..."
if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✅ 根目录 .gitignore 存在${NC}"
else
    echo -e "${RED}❌ 根目录 .gitignore 不存在${NC}"
fi

if [ -f "backend/.gitignore" ]; then
    echo -e "${GREEN}✅ backend/.gitignore 存在${NC}"
fi

if [ -f "frontend/.gitignore" ]; then
    echo -e "${GREEN}✅ frontend/.gitignore 存在${NC}"
fi

if [ -f "frontend-nextjs/.gitignore" ]; then
    echo -e "${GREEN}✅ frontend-nextjs/.gitignore 存在${NC}"
fi

echo ""

# 2. 检查敏感文件是否会被提交
echo "🔐 检查敏感文件..."

SENSITIVE_FILES=(
    ".env"
    "backend/.env"
    "backend/.env.local"
    "frontend-nextjs/.env"
    "frontend-nextjs/.env.local"
)

for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        # 检查文件是否被 Git 忽略
        if git check-ignore -q "$file" 2>/dev/null; then
            echo -e "${GREEN}✅ $file 已被忽略${NC}"
        else
            echo -e "${RED}❌ 警告：$file 存在但未被忽略！${NC}"
            echo -e "${YELLOW}   请检查 .gitignore 配置${NC}"
        fi
    fi
done

echo ""

# 3. 检查大文件目录
echo "📦 检查大文件目录..."

LARGE_DIRS=(
    "node_modules"
    "backend/node_modules"
    "frontend/node_modules"
    "frontend-nextjs/node_modules"
    "backend/dist"
    "frontend/dist"
    "frontend-nextjs/.next"
)

for dir in "${LARGE_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        if git check-ignore -q "$dir" 2>/dev/null; then
            echo -e "${GREEN}✅ $dir 已被忽略${NC}"
        else
            echo -e "${RED}❌ 警告：$dir 存在但未被忽略！${NC}"
        fi
    fi
done

echo ""

# 4. 检查 Git 状态
echo "📊 Git 状态检查..."

if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Git 仓库已初始化${NC}"
    
    # 检查是否有未跟踪的大文件
    echo ""
    echo "未跟踪的文件："
    git status --short | head -20
    
    # 统计将要提交的文件数量
    UNTRACKED=$(git ls-files --others --exclude-standard | wc -l | tr -d ' ')
    MODIFIED=$(git ls-files --modified | wc -l | tr -d ' ')
    
    echo ""
    echo "📈 统计："
    echo "  - 未跟踪文件: $UNTRACKED"
    echo "  - 已修改文件: $MODIFIED"
else
    echo -e "${YELLOW}⚠️  Git 仓库未初始化${NC}"
    echo "   运行: git init"
fi

echo ""

# 5. 检查是否有敏感信息
echo "🔎 扫描敏感信息..."

SENSITIVE_PATTERNS=(
    "password"
    "secret"
    "api_key"
    "apikey"
    "private_key"
    "token"
)

echo "正在扫描可能包含敏感信息的文件..."
FOUND_SENSITIVE=false

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    # 只搜索将要提交的文件
    if [ -d ".git" ]; then
        MATCHES=$(git diff --cached --name-only 2>/dev/null | xargs grep -li "$pattern" 2>/dev/null || true)
        if [ ! -z "$MATCHES" ]; then
            echo -e "${YELLOW}⚠️  发现可能包含 '$pattern' 的文件：${NC}"
            echo "$MATCHES" | sed 's/^/   /'
            FOUND_SENSITIVE=true
        fi
    fi
done

if [ "$FOUND_SENSITIVE" = false ]; then
    echo -e "${GREEN}✅ 未发现明显的敏感信息${NC}"
fi

echo ""

# 6. 建议
echo "💡 建议："
echo ""
echo "1. 首次提交前运行："
echo "   ${GREEN}git status${NC}"
echo "   ${GREEN}git add .${NC}"
echo "   ${GREEN}git commit -m \"Initial commit\"${NC}"
echo ""
echo "2. 确保创建了示例环境变量文件："
echo "   ${GREEN}cp backend/.env backend/.env.example${NC}"
echo "   然后删除 .env.example 中的实际密钥"
echo ""
echo "3. 推送到远程仓库："
echo "   ${GREEN}git remote add origin <your-repo-url>${NC}"
echo "   ${GREEN}git push -u origin main${NC}"
echo ""

# 7. 输出摘要
echo "============================================"
echo "📋 检查完成！"
echo "============================================"
echo ""
echo "查看详细文档："
echo "  - GIT_GUIDE.md     (Git 使用指南)"
echo "  - .gitignore       (忽略文件配置)"
echo "  - .gitattributes   (文件属性配置)"
echo ""

