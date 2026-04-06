/**
 * 路由入口
 */
const express = require('express')
const router = express.Router()

// 导入各模块路由
const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')
const chatRoutes = require('./chat.routes')
const searchRoutes = require('./search.routes')
const paymentRoutes = require('./payment.routes')

// 注册路由
router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/chat', chatRoutes)
router.use('/search', searchRoutes)
router.use('/payment', paymentRoutes)

module.exports = router
