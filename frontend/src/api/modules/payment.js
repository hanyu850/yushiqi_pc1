/**
 * 支付API
 */
import request from '../request'

export default {
  /**
   * 获取套餐列表
   */
  getPackages() {
    return request({
      url: '/payment/packages',
      method: 'get'
    })
  },

  /**
   * 创建订单
   */
  createOrder(data) {
    return request({
      url: '/payment/create-order',
      method: 'post',
      data
    })
  },

  /**
   * 获取订单状态
   */
  getOrderStatus(id) {
    return request({
      url: `/payment/orders/${id}`,
      method: 'get'
    })
  }
}
