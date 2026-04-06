<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <router-link to="/" class="logo">
          <span class="logo-icon">🤖</span>
          <span class="logo-text">羽世奇 AI</span>
        </router-link>
        <h1 class="login-title">登录</h1>
        <p class="login-subtitle">欢迎回来！请登录您的账户</p>
      </div>

      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        class="login-form"
        @submit.native.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            prefix-icon="el-icon-user"
            size="large"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            prefix-icon="el-icon-lock"
            size="large"
            show-password
            @keyup.enter.native="handleLogin"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>

        <div class="login-footer">
          <span>还没有账户？</span>
          <router-link to="/register" class="link">立即注册</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    ...mapActions('user', ['login']),

    async handleLogin() {
      try {
        await this.$refs.loginForm.validate()
        this.loading = true

        await this.login({
          username: this.form.username,
          password: this.form.password
        })

        this.$message.success('登录成功')

        // 跳转到之前的页面或首页
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
      } catch (error) {
        if (error.message) {
          this.$message.error(error.message)
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d1117;
  padding: 24px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  text-decoration: none;
}

.logo-icon {
  font-size: 36px;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #e6edf3;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #e6edf3;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #6e7681;
}

.login-form {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 32px;
}

::v-deep .el-input__inner {
  background: #0d1117;
  border: 1px solid #30363d;
  color: #e6edf3;

  &:focus {
    border-color: #58a6ff;
  }

  &::placeholder {
    color: #6e7681;
  }
}

::v-deep .el-input__prefix {
  color: #6e7681;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  border: none;

  &:hover {
    opacity: 0.9;
  }
}

.login-footer {
  text-align: center;
  color: #6e7681;
  margin-top: 16px;
}

.link {
  color: #58a6ff;
  margin-left: 4px;

  &:hover {
    text-decoration: underline;
  }
}
</style>
