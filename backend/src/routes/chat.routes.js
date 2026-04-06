/**
 * 聊天路由
 */
const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chat.controller')
const { verifyToken: authMiddleware } = require('../middleware/auth.middleware')

// 所有聊天路由都需要认证
router.use(authMiddleware)

/**
 * @route POST /api/chat/message
 * @desc 发送聊天消息
 */
router.post('/message', chatController.sendMessage)

/**
 * @route GET /api/chat/history
 * @desc 获取聊天历史
 */
router.get('/history', chatController.getHistory)

/**
 * @route GET /api/chat/sessions
 * @desc 获取会话列表
 */
router.get('/sessions', chatController.getSessions)

/**
 * @route DELETE /api/chat/sessions/:id
 * @desc 删除会话
 */
router.delete('/sessions/:id', chatController.deleteSession)

/**
 * @route POST /api/chat/sessions/:id/clear
 * @desc 清空聊天记录
 */
router.post('/sessions/:id/clear', chatController.clearChat)

module.exports = router
