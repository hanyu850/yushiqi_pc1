/**
 * 环境配置
 */
require('dotenv').config()

module.exports = {
  // 服务器配置
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'yushiqi_ai',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },

  // JWT配置
  JWT_SECRET: process.env.JWT_SECRET || 'yushiqi-ai-secret-key-2024',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // CORS配置
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // AI服务配置
  AI: {
    API_KEY: process.env.AI_API_KEY || '',
    API_URL: process.env.AI_API_URL || ''
  },

  // 微信支付配置
  wechatPay: {
    appId: process.env.WECHAT_APPID || '',
    mchId: process.env.WECHAT_MCHID || '',
    apiKey: process.env.WECHAT_API_KEY || '',
    certPath: process.env.WECHAT_CERT_PATH || '',
    notifyUrl: process.env.WECHAT_NOTIFY_URL || ''
  }
}
