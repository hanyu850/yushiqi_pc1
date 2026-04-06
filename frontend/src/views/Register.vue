<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <router-link to="/" class="logo">
          <span class="logo-icon">🤖</span>
          <span class="logo-text">羽世奇 AI</span>
        </router-link>
        <h1 class="register-title">注册</h1>
        <p class="register-subtitle">创建您的账户，开启AI之旅</p>
      </div>

      <el-form
        ref="registerForm"
        :model="form"
        :rules="rules"
        class="register-form"
        @submit.native.prevent="handleRegister"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            prefix-icon="el-icon-user"
            size="large"
          ></el-input>
        </el-form-item>

        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="邮箱（可选）"
            prefix-icon="el-icon-message"
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
          ></el-input>
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="确认密码"
            prefix-icon="el-icon-lock"
            size="large"
            show-password
            @keyup.enter.native="handleRegister"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="register-btn"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>

        <div class="register-footer">
          <span>已有账户？</span>
          <router-link to="/login" class="link">立即登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Register',
  data() {
    // 验证确认密码
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    ...mapActions('user', ['register']),

    async handleRegister() {
      try {
        await this.$refs.registerForm.validate()
        this.loading = true

        await this.register({
          username: this.form.username,
          email: this.form.email,
          password: this.form.password
        })

        this.$message.success('注册成功')

        // 跳转到首页
        this.$router.push('/')
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
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d1117;
  padding: 24px;
}

.register-container {
  width: 100%;
  max-width: 400px;
}

.register-header {
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

.register-title {
  font-size: 28px;
  font-weight: 700;
  color: #e6edf3;
  margin-bottom: 8px;
}

.register-subtitle {
  color: #6e7681;
}

.register-form {
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

.register-btn {
  width: 100%;
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  border: none;

  &:hover {
    opacity: 0.9;
  }
}

.register-footer {
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
