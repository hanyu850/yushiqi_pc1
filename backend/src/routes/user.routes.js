/**
 * 用户路由
 */
const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const { verifyToken: authMiddleware } = require('../middleware/auth.middleware')

// 所有用户路由都需要认证
router.use(authMiddleware)

/**
 * @route GET /api/user/info
 * @desc 获取用户信息
 */
router.get('/info', userController.getUserInfo)

/**
 * @route PUT /api/user/info
 * @desc 更新用户信息
 */
router.put('/info', userController.updateUserInfo)

/**
 * @route POST /api/user/change-password
 * @desc 修改密码
 */
router.post('/change-password', userController.changePassword)

/**
 * @route GET /api/user/orders
 * @desc 获取订单列表
 */
router.get('/orders', userController.getOrders)

module.exports = router
