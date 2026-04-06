/**
 * 聊天会话模型
 */
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const ChatSession = sequelize.define(
  'ChatSession',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户ID'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '会话标题'
    },
    model: {
      type: DataTypes.STRING(50),
      defaultValue: 'default',
      comment: '使用的AI模型'
    },
    messageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '消息数量'
    }
  },
  {
    tableName: 'chat_sessions',
    indexes: [
      { fields: ['userId'] },
      { fields: ['createdAt'] }
    ]
  }
)

module.exports = ChatSession
