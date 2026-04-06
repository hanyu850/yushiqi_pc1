/**
 * 用户模型
 */
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '用户名'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      comment: '邮箱'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '密码（bcrypt加密）'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '手机号'
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '头像URL'
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '状态：1-正常，0-禁用'
    },
    membershipLevel: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      comment: '会员等级：0-免费，1-基础，2-高级'
    },
    membershipExpireAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '会员过期时间'
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      comment: '最后登录时间'
    }
  },
  {
    tableName: 'users',
    indexes: [
      { fields: ['username'] },
      { fields: ['email'] },
      { fields: ['phone'] },
      { fields: ['status'] }
    ]
  }
)

module.exports = User
