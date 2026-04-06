/**
 * 搜索API
 */
import request from '../request'

export default {
  /**
   * 智能搜索
   */
  search(query) {
    return request({
      url: '/search',
      method: 'get',
      params: { q: query }
    })
  },

  /**
   * 获取热门搜索
   */
  getHotSearch() {
    return request({
      url: '/search/hot',
      method: 'get'
    })
  }
}
