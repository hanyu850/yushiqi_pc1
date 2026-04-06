/**
 * 支付路由
 */
const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/payment.controller')
const { verifyToken: authMiddleware } = require('../middleware/auth.middleware')

// 所有支付路由都需要认证
router.use(authMiddleware)

/**
 * @route GET /api/payment/packages
 * @desc 获取套餐列表
 */
router.get('/packages', paymentController.getPackages)

/**
 * @route POST /api/payment/create-order
 * @desc 创建支付订单
 */
router.post('/create-order', paymentController.createOrder)

/**
 * @route POST /api/payment/wechat/notify
 * @desc 微信支付回调
 */
router.post('/wechat/notify', paymentController.wechatNotify)

/**
 * @route GET /api/payment/orders/:id
 * @desc 查询订单状态
 */
router.get('/orders/:id', paymentController.getOrderStatus)

module.exports = router
