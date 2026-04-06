/**
 * 路由配置
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

Vue.use(VueRouter)

const routes = [
  // 需要主布局的页面
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: {
          title: '羽世奇 AI - 智启未来'
        }
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/Search.vue'),
        meta: {
          title: 'AI 智能搜索 - 羽世奇 AI'
        }
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/Chat.vue'),
        meta: {
          title: 'AI 对话 - 羽世奇 AI'
        }
      },
      {
        path: 'payment',
        name: 'Payment',
        component: () => import('@/views/Payment.vue'),
        meta: {
          title: '会员订阅 - 羽世奇 AI',
          requiresAuth: true
        }
      },
      {
        path: 'user',
        name: 'UserCenter',
        component: () => import('@/views/UserCenter.vue'),
        meta: {
          title: '个人中心 - 羽世奇 AI',
          requiresAuth: true
        }
      }
    ]
  },
  // 独立页面（不含主布局）
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录 - 羽世奇 AI'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: {
      title: '注册 - 羽世奇 AI'
    }
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth'
      }
    }
    return { x: 0, y: 0 }
  }
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '羽世奇 AI - 智启未来'
  next()
})

export default router
