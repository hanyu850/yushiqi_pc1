/**
 * 模型导入和关联
 */
const sequelize = require('../config/database')
const User = require('./User')
const ChatSession = require('./ChatSession')
const ChatMessage = require('./ChatMessage')
const Order = require('./Order')
const Package = require('./Package')

// 定义关联关系
User.hasMany(ChatSession, { foreignKey: 'userId', as: 'chatSessions' })
ChatSession.belongsTo(User, { foreignKey: 'userId', as: 'user' })

ChatSession.hasMany(ChatMessage, { foreignKey: 'sessionId', as: 'messages' })
ChatMessage.belongsTo(ChatSession, { foreignKey: 'sessionId', as: 'session' })

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' })
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Order.belongsTo(Package, { foreignKey: 'packageId', as: 'package' })

// 同步数据库
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true })
    console.log('数据库模型同步成功')
  } catch (error) {
    console.error('数据库模型同步失败:', error.message)
  }
}

syncDatabase()

module.exports = {
  sequelize,
  User,
  ChatSession,
  ChatMessage,
  Order,
  Package
}
