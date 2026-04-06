/**
 * 支付控制器
 */
const { v4: uuidv4 } = require('uuid')
const Order = require('../models/Order')
const Package = require('../models/Package')
const User = require('../models/User')
const { wechatPay } = require('../config/env')

/**
 * 获取套餐列表
 */
exports.getPackages = async (req, res, next) => {
  try {
    const packages = await Package.findAll({
      where: { isActive: true },
      order: [['price', 'ASC']]
    })

    res.json({
      code: 200,
      data: packages
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 创建支付订单
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { packageId } = req.body

    if (!packageId) {
      return res.status(400).json({
        code: 400,
        message: '请选择套餐'
      })
    }

    // 获取套餐信息
    const packageInfo = await Package.findByPk(packageId)

    if (!packageInfo || !packageInfo.isActive) {
      return res.status(404).json({
        code: 404,
        message: '套餐不存在或已下架'
      })
    }

    // 生成订单号
    const orderNo = generateOrderNo()

    // 创建订单
    const order = await Order.create({
      orderNo,
      userId: req.user.id,
      packageId,
      packageName: packageInfo.name,
      amount: packageInfo.price,
      status: 'pending'
    })

    // TODO: 创建支付订单
    // 可以调用微信支付、支付宝等支付接口
    let paymentParams = null

    // 模拟返回支付参数
    paymentParams = {
      orderNo: order.orderNo,
      amount: packageInfo.price,
      description: packageInfo.name
    }

    res.json({
      code: 200,
      data: {
        orderId: order.id,
        orderNo: order.orderNo,
        amount: packageInfo.price,
        paymentParams
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 微信支付回调
 */
exports.wechatNotify = async (req, res, next) => {
  try {
    // TODO: 验证微信支付签名
    // TODO: 解析微信支付回调数据

    const { order_no, transaction_id, total_fee } = req.body

    // 查找订单
    const order = await Order.findOne({
      where: { orderNo: order_no }
    })

    if (!order) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在'
      })
    }

    // 检查订单状态
    if (order.status === 'paid') {
      return res.json({ code: 0, message: 'OK' })
    }

    // 更新订单状态
    await order.update({
      status: 'paid',
      payType: 'wechat',
      transactionId: transaction_id,
      paidAt: new Date()
    })

    // 更新用户会员信息
    const packageInfo = await Package.findByPk(order.packageId)
    const user = await User.findByPk(order.userId)

    const now = new Date()
    let expireAt = now

    // 如果当前会员未过期，则在原基础上延长
    if (user.membershipExpireAt && new Date(user.membershipExpireAt) > now) {
      expireAt = new Date(user.membershipExpireAt)
    }

    // 计算新的过期时间
    expireAt.setDate(expireAt.getDate() + packageInfo.duration)

    await user.update({
      membershipLevel: packageInfo.level,
      membershipExpireAt: expireAt
    })

    // 返回微信支付要求的格式
    res.json({ code: 0, message: 'OK' })
  } catch (error) {
    next(error)
  }
}

/**
 * 查询订单状态
 */
exports.getOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params

    const order = await Order.findOne({
      where: { id, userId: req.user.id }
    })

    if (!order) {
      return res.status(404).json({
        code: 404,
        message: '订单不存在'
      })
    }

    res.json({
      code: 200,
      data: {
        id: order.id,
        orderNo: order.orderNo,
        packageName: order.packageName,
        amount: order.amount,
        status: order.status,
        payType: order.payType,
        paidAt: order.paidAt,
        createdAt: order.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 生成订单号
 */
function generateOrderNo() {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `YSQ${timestamp}${random}`
}
