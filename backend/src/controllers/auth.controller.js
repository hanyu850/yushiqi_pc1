/**
 * 认证控制器
 */
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env')
const User = require('../models/User')

/**
 * 用户注册
 */
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空'
      })
    }

    // 检查用户名是否存在
    const existingUser = await User.findOne({
      where: { username }
    })

    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: '用户名已存在'
      })
    }

    // 检查邮箱是否存在
    if (email) {
      const existingEmail = await User.findOne({
        where: { email }
      })

      if (existingEmail) {
        return res.status(400).json({
          code: 400,
          message: '邮箱已被使用'
        })
      }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })

    // 生成JWT
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.status(201).json({
      code: 200,
      message: '注册成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          membershipLevel: user.membershipLevel
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 用户登录
 */
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '用户名和密码不能为空'
      })
    }

    // 查找用户
    const user = await User.findOne({
      where: { username }
    })

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      })
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      })
    }

    // 检查账号状态
    if (user.status !== 1) {
      return res.status(403).json({
        code: 403,
        message: '账号已被禁用'
      })
    }

    // 更新最后登录时间
    await user.update({ lastLoginAt: new Date() })

    // 生成JWT
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          membershipLevel: user.membershipLevel,
          membershipExpireAt: user.membershipExpireAt
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 用户登出
 */
exports.logout = async (req, res, next) => {
  try {
    // JWT是无状态的，客户端删除token即可
    res.json({
      code: 200,
      message: '登出成功'
    })
  } catch (error) {
    next(error)
  }
}
