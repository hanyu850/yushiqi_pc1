/**
 * API插件
 */
import request from './request'
import user from './modules/user'
import auth from './modules/auth'
import chat from './modules/chat'
import search from './modules/search'
import payment from './modules/payment'

// API插件对象
const api = {
  request,
  user,
  auth,
  chat,
  search,
  payment
}

// 导出插件安装函数
export default {
  install(Vue) {
    Vue.prototype.$api = api
    Vue.$api = api
  }
}

export { request, user, auth, chat, search, payment }
