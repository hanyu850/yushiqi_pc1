<template>
  <div class="payment-page">
    <div class="payment-container">
      <div class="payment-header">
        <h1 class="payment-title">会员订阅</h1>
        <p class="payment-subtitle">选择适合您的套餐，解锁更多功能</p>
      </div>

      <div v-loading="loading" class="payment-content">
        <div class="packages-grid">
          <div
            v-for="pkg in packages"
            :key="pkg.id"
            :class="['package-card', 'card', { 'package-popular': pkg.level === 2 }]"
          >
            <div v-if="pkg.level === 2" class="popular-badge">推荐</div>
            <div class="package-icon">
              {{ pkg.level === 2 ? '⭐' : '💎' }}
            </div>
            <h3 class="package-name">{{ pkg.name }}</h3>
            <div class="package-price">
              <span class="price">¥{{ (pkg.price / 100).toFixed(0) }}</span>
              <span class="period">/{{ pkg.duration }}天</span>
            </div>
            <p class="package-description">{{ pkg.description }}</p>
            <ul class="package-features">
              <li v-for="(feature, index) in pkg.features" :key="index">
                ✓ {{ feature }}
              </li>
            </ul>
            <button
              class="package-btn"
              :class="{ 'btn-primary': pkg.level === 2, 'btn-outline': pkg.level === 1 }"
              @click="handlePurchase(pkg)"
              :disabled="orderLoading"
            >
              {{ orderLoading ? '处理中...' : '立即订阅' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 常见问题 -->
      <div class="faq-section">
        <h2 class="faq-title">常见问题</h2>
        <div class="faq-list">
          <div class="faq-item">
            <h3 class="faq-question">如何支付？</h3>
            <p class="faq-answer">支持微信支付、支付宝等多种支付方式，支付即时到账，会员立即生效。</p>
          </div>
          <div class="faq-item">
            <h3 class="faq-question">会员有效期多久？</h3>
            <p class="faq-answer">基础会员有效期为30天，高级会员有效期为90天。到期后可续费。</p>
          </div>
          <div class="faq-item">
            <h3 class="faq-question">可以退款吗？</h3>
            <p class="faq-answer">购买后7天内，如对服务不满意，可申请全额退款。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Payment',
  data() {
    return {
      packages: [
        {
          id: 1,
          name: '基础会员',
          description: '适合个人用户',
          price: 9900,
          duration: 30,
          level: 1,
          features: [
            '每日100次对话',
            '基础AI模型',
            '无广告体验',
            '优先客服支持'
          ]
        },
        {
          id: 2,
          name: '高级会员',
          description: '适合专业用户',
          price: 29900,
          duration: 90,
          level: 2,
          features: [
            '无限次对话',
            '高级AI模型',
            '优先响应',
            '专属客服',
            'API访问权限'
          ]
        }
      ],
      loading: false,
      orderLoading: false
    }
  },
  mounted() {
    this.loadPackages()
  },
  methods: {
    async loadPackages() {
      this.loading = true
      try {
        const response = await this.$api.payment.getPackages()
        if (response.data && response.data.length > 0) {
          this.packages = response.data
        }
      } catch (error) {
        console.error('获取套餐列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    async handlePurchase(pkg) {
      this.orderLoading = true
      try {
        const response = await this.$api.payment.createOrder({
          packageId: pkg.id
        })

        this.$message.success('订单创建成功')

        // TODO: 跳转到支付页面或唤起支付
        console.log('订单信息:', response.data)

        // 模拟支付成功
        setTimeout(() => {
          this.$message.success('支付成功！')
          this.orderLoading = false
        }, 2000)
      } catch (error) {
        this.$message.error(error.message || '创建订单失败')
        this.orderLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-page {
  min-height: 100vh;
  background: #0d1117;
  padding: 40px 24px;
}

.payment-container {
  max-width: 1000px;
  margin: 0 auto;
}

.payment-header {
  text-align: center;
  margin-bottom: 50px;
}

.payment-title {
  font-size: 36px;
  font-weight: 700;
  color: #e6edf3;
  margin-bottom: 12px;
}

.payment-subtitle {
  font-size: 16px;
  color: #6e7681;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 60px;
}

.package-card {
  padding: 32px;
  text-align: center;
  position: relative;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
  }
}

.package-popular {
  border-color: #58a6ff;
  box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.1);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  color: #e6edf3;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.package-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.package-name {
  font-size: 22px;
  font-weight: 700;
  color: #e6edf3;
  margin-bottom: 16px;
}

.package-price {
  margin-bottom: 16px;
}

.price {
  font-size: 42px;
  font-weight: 800;
  color: #e6edf3;
}

.period {
  font-size: 16px;
  color: #6e7681;
}

.package-description {
  color: #8b949e;
  margin-bottom: 20px;
}

.package-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  text-align: left;
}

.package-features li {
  padding: 8px 0;
  color: #6e7681;
  border-bottom: 1px solid #21262d;
}

.package-features li:last-child {
  border-bottom: none;
}

.package-btn {
  width: 100%;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-size: 16px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  color: #e6edf3;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(88, 166, 255, 0.3);
  }
}

.btn-outline {
  background: transparent;
  color: #58a6ff;
  border: 2px solid #58a6ff;

  &:hover:not(:disabled) {
    background: #58a6ff;
    color: #e6edf3;
  }
}

/* 常见问题 */
.faq-section {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 32px;
}

.faq-title {
  font-size: 24px;
  font-weight: 700;
  color: #e6edf3;
  text-align: center;
  margin-bottom: 32px;
}

.faq-list {
  display: grid;
  gap: 24px;
}

.faq-item {
  padding-bottom: 24px;
  border-bottom: 1px solid #21262d;
}

.faq-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.faq-question {
  font-size: 16px;
  font-weight: 600;
  color: #e6edf3;
  margin-bottom: 8px;
}

.faq-answer {
  color: #6e7681;
  line-height: 1.6;
}

/* 响应式 */
@media (max-width: 768px) {
  .payment-title {
    font-size: 28px;
  }

  .packages-grid {
    grid-template-columns: 1fr;
  }

  .package-card {
    padding: 24px;
  }

  .price {
    font-size: 36px;
  }
}
</style>
