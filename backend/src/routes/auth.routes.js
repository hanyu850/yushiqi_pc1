/**
 * 认证路由
 */
const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

/**
 * @route POST /api/auth/register
 * @desc 用户注册
 */
router.post('/register', authController.register)

/**
 * @route POST /api/auth/login
 * @desc 用户登录
 */
router.post('/login', authController.login)

/**
 * @route POST /api/auth/logout
 * @desc 用户登出
 */
router.post('/logout', authController.logout)

module.exports = router
