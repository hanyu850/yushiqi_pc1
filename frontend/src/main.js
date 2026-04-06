import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'
import store from './store'
import api from './api'

import '@/assets/css/global.scss'

// Vue插件注册
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(api)

// 全局配置
Vue.config.productionTip = false

// 路由守卫 - 需要登录的页面
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuthenticated = store.state.user.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

// 创建Vue实例
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
