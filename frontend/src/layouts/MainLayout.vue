<template>
  <div class="main-layout">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="navbar-logo">
          <span class="logo-icon">🤖</span>
          <span class="logo-text">羽世奇 AI</span>
        </router-link>

        <nav class="navbar-nav" :class="{ 'nav-visible': navVisible }">
          <router-link to="/" class="nav-link" @click="navVisible = false">
            <span class="nav-icon">🏠</span>
            <span>首页</span>
          </router-link>
          <router-link to="/search" class="nav-link" @click="navVisible = false">
            <span class="nav-icon">🔍</span>
            <span>搜索</span>
          </router-link>
          <router-link to="/chat" class="nav-link" @click="navVisible = false">
            <span class="nav-icon">💬</span>
            <span>对话</span>
          </router-link>
        </nav>

        <div class="navbar-actions">
          <template v-if="isAuthenticated">
            <router-link to="/user" class="user-link">
              <span class="user-avatar">{{ userInfo?.username?.charAt(0).toUpperCase() || 'U' }}</span>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-text">登录</router-link>
            <router-link to="/register" class="btn btn-primary">注册</router-link>
          </template>

          <!-- 移动端菜单按钮 -->
          <button class="menu-btn" @click="navVisible = !navVisible" :class="{ active: navVisible }">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h4 class="footer-title">羽世奇 AI</h4>
            <p class="footer-text">智启未来，引领AI新时代</p>
          </div>
          <div class="footer-section">
            <h4 class="footer-title">产品</h4>
            <ul class="footer-links">
              <li><router-link to="/search">智能搜索</router-link></li>
              <li><router-link to="/chat">AI 对话</router-link></li>
              <li><router-link to="/payment">会员订阅</router-link></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4 class="footer-title">关于</h4>
            <ul class="footer-links">
              <li><a href="#">关于我们</a></li>
              <li><a href="#">使用条款</a></li>
              <li><a href="#">隐私政策</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 羽世奇 AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MainLayout',
  data() {
    return {
      navVisible: false
    }
  },
  computed: {
    ...mapGetters('user', ['isAuthenticated', 'userInfo'])
  }
}
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 导航栏 */
.navbar {
  background: #161b22;
  border-bottom: 1px solid #30363d;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #e6edf3;
  text-decoration: none;
}

.logo-icon {
  font-size: 28px;
}

.navbar-nav {
  display: flex;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #8b949e;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #e6edf3;
  background: #21262d;
}

.nav-icon {
  font-size: 18px;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-text {
  color: #8b949e;
}

.btn-text:hover {
  color: #e6edf3;
}

.btn-primary {
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  color: #e6edf3;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(88, 166, 255, 0.3);
}

/* 移动端菜单按钮 */
.menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  width: 32px;
  height: 32px;
  background: transparent;
  padding: 4px;
}

.menu-btn span {
  width: 100%;
  height: 2px;
  background: #8b949e;
  border-radius: 2px;
  transition: all 0.3s;
}

.menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(4px, 4px);
}

.menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(4px, -4px);
}

/* 主内容 */
.main-content {
  flex: 1;
}

/* 页脚 */
.footer {
  background: #161b22;
  border-top: 1px solid #30363d;
  padding: 40px 24px 20px;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 30px;
}

.footer-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #e6edf3;
}

.footer-text {
  color: #6e7681;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #6e7681;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #58a6ff;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #30363d;
  color: #6e7681;
  font-size: 13px;
}

/* 响应式 */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 16px;
  }

  .navbar-nav {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: #161b22;
    border-bottom: 1px solid #30363d;
    padding: 16px;
    gap: 4px;
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s;
    pointer-events: none;
  }

  .navbar-nav.nav-visible {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav-link {
    padding: 12px 16px;
    border-radius: 8px;
  }

  .menu-btn {
    display: flex;
  }

  .navbar-actions .btn {
    display: none;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
