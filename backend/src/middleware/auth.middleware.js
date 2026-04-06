/**
 * JWT认证中间件
 */
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env')
const User = require('../models/User')

/**
 * 验证Token中间件
 */
const verifyToken = async (req, res, next) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: 401,
        message: '请先登录'
      })
    }

    const token = authHeader.substring(7)

    // 验证token
    const decoded = jwt.verify(token, JWT_SECRET)

    // 查找用户
    const user = await User.findByPk(decoded.userId)

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在'
      })
    }

    if (user.status !== 1) {
      return res.status(403).json({
        code: 403,
        message: '账号已被禁用'
      })
    }

    // 将用户信息附加到请求对象
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      membershipLevel: user.membershipLevel
    }

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * 可选的Token验证（不强制登录）
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = jwt.verify(token, JWT_SECRET)
      const user = await User.findByPk(decoded.userId)

      if (user && user.status === 1) {
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          membershipLevel: user.membershipLevel
        }
      }
    }

    next()
  } catch (error) {
    // 忽略错误，继续处理请求
    next()
  }
}

module.exports = {
  verifyToken,
  optionalAuth
}
