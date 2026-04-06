require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

// 导入路由
const routes = require('./routes')

// 导入中间件
const errorHandler = require('./middleware/error.middleware')

// 导入配置
const { PORT, NODE_ENV, CORS_ORIGIN } = require('./config/env')

// Express配置
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS配置
app.use(
  cors({
    origin: CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  })
)

// 请求日志中间件
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
      query: req.query,
      body: req.body
    })
    next()
  })
}

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: NODE_ENV
  })
})

// API路由
app.use('/api', routes)

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '请求的资源不存在'
  })
})

// 错误处理中间件
app.use(errorHandler)

// 启动服务器
app.listen(PORT, () => {
  console.log(`
    ╔══════════════════════════════════════════╗
    ║                                          ║
    ║   羽世奇 AI - 后端服务已启动              ║
    ║                                          ║
    ║   环境: ${NODE_ENV.padEnd(26)}║
    ║   端口: ${PORT.toString().padEnd(26)}║
    ║   时间: ${new Date().toLocaleString('zh-CN')}       ║
    ║                                          ║
    ╚══════════════════════════════════════════╝
  `)
})

// 优雅退出
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('\n收到 SIGINT 信号，正在关闭服务器...')
  process.exit(0)
})

module.exports = app
