/**
 * 用户API
 */
import request from '../request'

export default {
  /**
   * 获取用户信息
   */
  getInfo() {
    return request({
      url: '/user/info',
      method: 'get'
    })
  },

  /**
   * 更新用户信息
   */
  updateInfo(data) {
    return request({
      url: '/user/info',
      method: 'put',
      data
    })
  },

  /**
   * 修改密码
   */
  changePassword(data) {
    return request({
      url: '/user/change-password',
      method: 'post',
      data
    })
  },

  /**
   * 获取订单列表
   */
  getOrders(params) {
    return request({
      url: '/user/orders',
      method: 'get',
      params
    })
  }
}
