<template>
  <div class="user-page">
    <div class="user-container">
      <div class="user-header card">
        <div class="user-avatar">{{ userInfo?.username?.charAt(0).toUpperCase() || 'U' }}</div>
        <div class="user-info">
          <h2>{{ userInfo?.username || '用户' }}</h2>
          <p>{{ userInfo?.email || '未设置邮箱' }}</p>
          <div class="user-membership">
            <span class="membership-badge" :class="`membership-${membershipLevel}`">
              {{ membershipText }}
            </span>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>

      <div class="user-content">
        <div class="user-menu">
          <div
            v-for="item in menuItems"
            :key="item.key"
            :class="['menu-item', { active: activeMenu === item.key }]"
            @click="activeMenu = item.key"
          >
            <span class="menu-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </div>
        </div>

        <div class="user-main card">
          <div v-if="activeMenu === 'profile'" class="content-section">
            <h3>个人信息</h3>
            <el-form :model="profileForm" label-width="100px">
              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" disabled></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="profileForm.email"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateProfile" :loading="loading">保存</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div v-if="activeMenu === 'password'" class="content-section">
            <h3>修改密码</h3>
            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="100px">
              <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="passwordForm.oldPassword" type="password" show-password></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="passwordForm.newPassword" type="password" show-password></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="passwordForm.confirmPassword" type="password" show-password></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="changePassword" :loading="loading">修改密码</el-button>
              </el-form-item>
            </el-form>
          </div>

          <div v-if="activeMenu === 'orders'" class="content-section">
            <h3>我的订单</h3>
            <el-table :data="orders" style="width: 100%" v-loading="ordersLoading">
              <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
              <el-table-column prop="packageName" label="套餐名称"></el-table-column>
              <el-table-column prop="amount" label="金额" width="100">
                <template slot-scope="scope">
                  ¥{{ (scope.row.amount / 100).toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template slot-scope="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ getStatusText(scope.row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createdAt" label="创建时间" width="180">
                <template slot-scope="scope">
                  {{ formatDate(scope.row.createdAt) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UserCenter',
  data() {
    // 验证确认密码
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    return {
      activeMenu: 'profile',
      menuItems: [
        { key: 'profile', label: '个人信息', icon: '👤' },
        { key: 'password', label: '修改密码', icon: '🔒' },
        { key: 'orders', label: '我的订单', icon: '📋' }
      ],
      profileForm: {
        username: '',
        email: ''
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      orders: [],
      loading: false,
      ordersLoading: false
    }
  },
  computed: {
    ...mapGetters('user', ['userInfo']),
    membershipLevel() {
      return this.userInfo?.membershipLevel || 0
    },
    membershipText() {
      const levels = ['免费用户', '基础会员', '高级会员']
      return levels[this.membershipLevel] || '免费用户'
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    ...mapActions('user', ['logout', 'getUserInfo']),

    async initData() {
      try {
        await this.getUserInfo()
        this.profileForm = {
          username: this.userInfo.username,
          email: this.userInfo.email || ''
        }
        this.loadOrders()
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    },

    async loadOrders() {
      this.ordersLoading = true
      try {
        const response = await this.$api.user.getOrders()
        this.orders = response.data.list || []
      } catch (error) {
        console.error('获取订单列表失败:', error)
      } finally {
        this.ordersLoading = false
      }
    },

    async updateProfile() {
      this.loading = true
      try {
        await this.$api.user.updateInfo({ email: this.profileForm.email })
        this.$message.success('更新成功')
        await this.getUserInfo()
      } catch (error) {
        this.$message.error('更新失败')
      } finally {
        this.loading = false
      }
    },

    async changePassword() {
      this.loading = true
      try {
        await this.$refs.passwordForm.validate()
        await this.$api.user.changePassword({
          oldPassword: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword
        })
        this.$message.success('密码修改成功，请重新登录')
        this.handleLogout()
      } catch (error) {
        if (error.message) {
          this.$message.error(error.message)
        }
      } finally {
        this.loading = false
      }
    },

    handleLogout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
        this.$router.push('/')
      }).catch(() => {})
    },

    getStatusType(status) {
      const types = {
        pending: 'info',
        paid: 'success',
        cancelled: 'warning',
        refunded: 'danger'
      }
      return types[status] || 'info'
    },

    getStatusText(status) {
      const texts = {
        pending: '待支付',
        paid: '已支付',
        cancelled: '已取消',
        refunded: '已退款'
      }
      return texts[status] || status
    },

    formatDate(date) {
      return new Date(date).toLocaleString('zh-CN')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-page {
  min-height: 100vh;
  background: #0d1117;
  padding: 24px;
}

.user-container {
  max-width: 1000px;
  margin: 0 auto;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  margin-bottom: 20px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}

.user-info {
  flex: 1;
}

.user-info h2 {
  font-size: 20px;
  margin-bottom: 4px;
  color: #e6edf3;
}

.user-info p {
  color: #8b949e;
  margin-bottom: 8px;
}

.membership-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.membership-0 {
  background: #21262d;
  color: #8b949e;
}

.membership-1 {
  background: rgba(88, 166, 255, 0.1);
  color: #58a6ff;
}

.membership-2 {
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  color: white;
}

.logout-btn {
  padding: 8px 16px;
  border: 1px solid #30363d;
  background: #21262d;
  color: #e6edf3;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #58a6ff;
  }
}

.user-content {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 20px;
}

.user-menu {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s;
  color: #8b949e;

  &:hover {
    background: #21262d;
  }

  &.active {
    background: rgba(88, 166, 255, 0.1);
    color: #58a6ff;
  }
}

.menu-icon {
  font-size: 18px;
}

.user-main {
  padding: 24px;
  min-height: 400px;
}

.content-section h3 {
  font-size: 18px;
  margin-bottom: 24px;
  color: #e6edf3;
}

::v-deep .el-form-item__label {
  color: #8b949e;
}

::v-deep .el-input__inner {
  background: #0d1117;
  border: 1px solid #30363d;
  color: #e6edf3;

  &:focus {
    border-color: #58a6ff;
  }

  &:disabled {
    background: #21262d;
    color: #6e7681;
  }
}

::v-deep .el-table {
  background: #0d1117;
  color: #e6edf3;

  th {
    background: #161b22;
    color: #8b949e;
  }

  tr {
    background: #0d1117;

    &:hover > td {
      background: #161b22 !important;
    }
  }

  td {
    border-color: #21262d;
  }
}

@media (max-width: 768px) {
  .user-content {
    grid-template-columns: 1fr;
  }

  .user-menu {
    display: flex;
    overflow-x: auto;
  }

  .menu-item {
    flex-shrink: 0;
  }

  .user-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
