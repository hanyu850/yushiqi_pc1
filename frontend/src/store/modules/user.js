/**
 * 用户模块
 */
import { getToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  userInfo: null,
  isAuthenticated: !!getToken()
}

const getters = {
  token: (state) => state.token,
  userInfo: (state) => state.userInfo,
  isAuthenticated: (state) => state.isAuthenticated,
  membershipLevel: (state) => state.userInfo?.membershipLevel || 0
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    state.isAuthenticated = !!token
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
  CLEAR_AUTH(state) {
    state.token = null
    state.userInfo = null
    state.isAuthenticated = false
  }
}

const actions = {
  /**
   * 登录
   */
  async login({ commit }, { username, password }) {
    const response = await this.$api.auth.login({ username, password })
    const { token, user } = response.data

    commit('SET_TOKEN', token)
    commit('SET_USER_INFO', user)

    return response
  },

  /**
   * 注册
   */
  async register({ commit }, { username, email, password }) {
    const response = await this.$api.auth.register({ username, email, password })
    const { token, user } = response.data

    commit('SET_TOKEN', token)
    commit('SET_USER_INFO', user)

    return response
  },

  /**
   * 登出
   */
  logout({ commit }) {
    commit('CLEAR_AUTH')
    removeToken()
  },

  /**
   * 获取用户信息
   */
  async getUserInfo({ commit, state }) {
    if (!state.token) {
      throw new Error('未登录')
    }

    const response = await this.$api.user.getInfo()
    commit('SET_USER_INFO', response.data)

    return response
  },

  /**
   * 更新用户信息
   */
  async updateUserInfo({ commit }, data) {
    const response = await this.$api.user.updateInfo(data)
    commit('SET_USER_INFO', response.data)

    return response
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
