/**
 * Axios请求封装
 */
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data

    // 如果code不是200，则判断为错误
    if (res.code !== 200) {
      // 处理特定错误码
      if (res.code === 401) {
        // 未登录或token过期
        localStorage.removeItem('token')
        window.location.href = '/login'
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  (error) => {
    console.error('Request error:', error)

    // 处理网络错误
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          error.message = '未授权，请登录'
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = '请求的资源不存在'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        default:
          error.message = data?.message || '请求失败'
      }
    } else if (error.request) {
      error.message = '网络连接失败，请检查网络'
    }

    return Promise.reject(error)
  }
)

export default request
