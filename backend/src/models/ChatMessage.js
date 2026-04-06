/**
 * 聊天消息模型
 */
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const ChatMessage = sequelize.define(
  'ChatMessage',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '会话ID'
    },
    role: {
      type: DataTypes.ENUM('user', 'assistant', 'system'),
      allowNull: false,
      comment: '角色'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '消息内容'
    },
    tokens: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '消耗的token数'
    }
  },
  {
    tableName: 'chat_messages',
    indexes: [
      { fields: ['sessionId'] },
      { fields: ['createdAt'] }
    ]
  }
)

module.exports = ChatMessage
