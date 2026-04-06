# 羽世奇 AI - yushiqi-ai-v5

智启未来，引领AI新时代

## 项目简介

羽世奇 AI 是一个基于人工智能的智能服务平台，提供智能搜索、AI对话、会员订阅等功能。

## 技术栈

### 后端
- Node.js + Express
- Sequelize ORM
- MySQL
- JWT 认证

### 前端
- Vue 2
- Vite
- Element UI
- Vue Router
- Vuex
- Axios

## 项目结构

```
yushiqi-ai-v5/
├── backend/              # 后端服务
│   └── src/
│       ├── config/      # 配置文件
│       ├── controllers/ # 控制器
│       ├── middleware/  # 中间件
│       ├── models/      # 数据模型
│       ├── routes/      # 路由
│       ├── services/    # 服务
│       └── utils/       # 工具函数
└── frontend/            # 前端项目
    └── src/
        ├── api/        # API 接口
        ├── assets/     # 静态资源
        ├── components/ # 组件
        ├── layouts/    # 布局
        ├── router/     # 路由
        ├── store/      # 状态管理
        ├── utils/      # 工具函数
        └── views/      # 页面视图
```

## 快速开始

### 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 配置环境变量

1. 复制后端环境变量配置文件：
```bash
cd backend
cp .env.example .env
```

2. 编辑 `.env` 文件，配置数据库和JWT密钥等信息

### 初始化数据库

1. 创建 MySQL 数据库：
```sql
CREATE DATABASE yushiqi_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 启动后端服务会自动创建数据表

### 启动服务

```bash
# 启动后端服务（端口 3001）
cd backend
npm run dev

# 启动前端服务（端口 3000）
cd frontend
npm run dev
```

访问 http://localhost:3000 查看网站

## 功能特性

- 🔍 **智能搜索** - AI 驱动的智能搜索
- 💬 **AI 对话** - 自然语言交互
- 💳 **会员订阅** - 多种套餐选择
- 👤 **用户中心** - 个人信息管理
- 📱 **响应式设计** - 支持移动端和PC端

## 待完成功能

- [ ] AI 服务集成（接入 OpenAI/Claude 等）
- [ ] 微信支付集成
- [ ] 更多 AI 功能
- [ ] 管理后台

## 许可证

MIT License
