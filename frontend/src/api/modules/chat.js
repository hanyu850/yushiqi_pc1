/**
 * 聊天API
 */
import request from '../request'

export default {
  /**
   * 发送消息
   */
  sendMessage(data) {
    return request({
      url: '/chat/message',
      method: 'post',
      data
    })
  },

  /**
   * 获取聊天历史
   */
  getHistory(params) {
    return request({
      url: '/chat/history',
      method: 'get',
      params
    })
  },

  /**
   * 获取会话列表
   */
  getSessions(params) {
    return request({
      url: '/chat/sessions',
      method: 'get',
      params
    })
  },

  /**
   * 删除会话
   */
  deleteSession(id) {
    return request({
      url: `/chat/sessions/${id}`,
      method: 'delete'
    })
  },

  /**
   * 清空聊天记录
   */
  clearChat(id) {
    return request({
      url: `/chat/sessions/${id}/clear`,
      method: 'post'
    })
  }
}
