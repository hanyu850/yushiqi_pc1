/**
 * 订单模型
 */
const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderNo: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      comment: '订单号'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '用户ID'
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '套餐ID'
    },
    packageName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '套餐名称'
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '金额（分）'
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'cancelled', 'refunded'),
      defaultValue: 'pending',
      comment: '订单状态'
    },
    payType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '支付方式'
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '第三方交易号'
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '支付时间'
    }
  },
  {
    tableName: 'orders',
    indexes: [
      { fields: ['orderNo'] },
      { fields: ['userId'] },
      { fields: ['status'] }
    ]
  }
)

module.exports = Order
