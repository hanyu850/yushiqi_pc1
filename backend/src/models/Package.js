/**
 * 套餐模型
 */
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Package = sequelize.define(
  'Package',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '套餐名称'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '套餐描述'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '价格（分）'
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '有效期（天）'
    },
    level: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '会员等级：1-基础，2-高级'
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '功能列表'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '是否启用'
    }
  },
  {
    tableName: 'packages',
    indexes: [
      { fields: ['level'] },
      { fields: ['isActive'] }
    ]
  }
)

module.exports = Package
