/**
 * 认证API
 */
import request from '../request'

export default {
  /**
   * 用户登录
   */
  login(data) {
    return request({
      url: '/auth/login',
      method: 'post',
      data
    })
  },

  /**
   * 用户注册
   */
  register(data) {
    return request({
      url: '/auth/register',
      method: 'post',
      data
    })
  },

  /**
   * 用户登出
   */
  logout() {
    return request({
      url: '/auth/logout',
      method: 'post'
    })
  }
}
