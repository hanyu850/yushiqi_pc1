/**
 * 聊天控制器
 */
const { v4: uuidv4 } = require('uuid')
const ChatSession = require('../models/ChatSession')
const ChatMessage = require('../models/ChatMessage')

/**
 * 发送聊天消息
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { content, sessionId } = req.body

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        code: 400,
        message: '消息内容不能为空'
      })
    }

    // 获取或创建会话
    let session
    if (sessionId) {
      session = await ChatSession.findOne({
        where: { id: sessionId, userId: req.user.id }
      })
    }

    if (!session) {
      // 创建新会话
      session = await ChatSession.create({
        userId: req.user.id,
        title: content.slice(0, 50) + (content.length > 50 ? '...' : '')
      })
    }

    // 保存用户消息
    await ChatMessage.create({
      sessionId: session.id,
      role: 'user',
      content: content.trim()
    })

    // 更新会话消息数量
    await session.increment('messageCount')

    // 调用AI服务获取回复
    const aiResponse = await callAIService(content, session.id, req.user)

    // 保存AI回复
    await ChatMessage.create({
      sessionId: session.id,
      role: 'assistant',
      content: aiResponse.message,
      tokens: aiResponse.tokens || 0
    })

    res.json({
      code: 200,
      data: {
        sessionId: session.id,
        message: aiResponse.message
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 调用AI服务
 */
async function callAIService(content, sessionId, user) {
  // TODO: 接入实际的AI服务
  // 这里可以接入 OpenAI、Claude、或其他AI服务

  // 模拟回复
  const responses = [
    '您好！我是羽世奇AI助手，很高兴为您服务。',
    '这是一个很好的问题，让我来为您解答。',
    '根据我的理解，我可以这样回答您的问题...',
    '感谢您的提问，我会尽力帮助您。',
    '这个问题很有趣，让我思考一下...'
  ]

  return {
    message: responses[Math.floor(Math.random() * responses.length)],
    tokens: 50
  }
}

/**
 * 获取聊天历史
 */
exports.getHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.query

    if (!sessionId) {
      return res.status(400).json({
        code: 400,
        message: '请提供会话ID'
      })
    }

    // 验证会话属于当前用户
    const session = await ChatSession.findOne({
      where: { id: sessionId, userId: req.user.id }
    })

    if (!session) {
      return res.status(404).json({
        code: 404,
        message: '会话不存在'
      })
    }

    // 获取消息列表
    const messages = await ChatMessage.findAll({
      where: { sessionId },
      order: [['createdAt', 'ASC']]
    })

    res.json({
      code: 200,
      data: {
        sessionId: session.id,
        title: session.title,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.createdAt
        }))
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 获取会话列表
 */
exports.getSessions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query

    const { count, rows } = await ChatSession.findAndCountAll({
      where: { userId: req.user.id },
      order: [['updatedAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    })

    res.json({
      code: 200,
      data: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        list: rows
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 删除会话
 */
exports.deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params

    // 验证会话属于当前用户
    const session = await ChatSession.findOne({
      where: { id, userId: req.user.id }
    })

    if (!session) {
      return res.status(404).json({
        code: 404,
        message: '会话不存在'
      })
    }

    // 删除会话及其消息
    await ChatMessage.destroy({ where: { sessionId: id } })
    await session.destroy()

    res.json({
      code: 200,
      message: '会话已删除'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 清空聊天记录
 */
exports.clearChat = async (req, res, next) => {
  try {
    const { id } = req.params

    // 验证会话属于当前用户
    const session = await ChatSession.findOne({
      where: { id, userId: req.user.id }
    })

    if (!session) {
      return res.status(404).json({
        code: 404,
        message: '会话不存在'
      })
    }

    // 删除会话的所有消息
    await ChatMessage.destroy({ where: { sessionId: id } })

    // 重置消息数量
    await session.update({ messageCount: 0 })

    res.json({
      code: 200,
      message: '聊天记录已清空'
    })
  } catch (error) {
    next(error)
  }
}
