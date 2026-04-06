/**
 * 用户控制器
 */
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Order = require('../models/Order')

/**
 * 获取用户信息
 */
exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    })

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      })
    }

    // 检查会员是否过期
    let membershipLevel = user.membershipLevel
    if (user.membershipExpireAt && new Date(user.membershipExpireAt) < new Date()) {
      membershipLevel = 0
      await user.update({ membershipLevel: 0 })
    }

    res.json({
      code: 200,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        membershipLevel,
        membershipExpireAt: user.membershipExpireAt
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 更新用户信息
 */
exports.updateUserInfo = async (req, res, next) => {
  try {
    const { email, phone, avatar } = req.body
    const user = await User.findByPk(req.user.id)

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      })
    }

    // 更新邮箱
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        where: { email }
      })

      if (existingEmail) {
        return res.status(400).json({
          code: 400,
          message: '邮箱已被使用'
        })
      }

      user.email = email
    }

    // 更新手机号
    if (phone) {
      user.phone = phone
    }

    // 更新头像
    if (avatar) {
      user.avatar = avatar
    }

    await user.save()

    res.json({
      code: 200,
      message: '更新成功',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 修改密码
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        code: 400,
        message: '请输入原密码和新密码'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        code: 400,
        message: '新密码长度不能少于6位'
      })
    }

    const user = await User.findByPk(req.user.id)

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      })
    }

    // 验证原密码
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)

    if (!isPasswordValid) {
      return res.status(400).json({
        code: 400,
        message: '原密码错误'
      })
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await user.update({ password: hashedPassword })

    res.json({
      code: 200,
      message: '密码修改成功'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 获取订单列表
 */
exports.getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query

    const { count, rows } = await Order.findAndCountAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
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
