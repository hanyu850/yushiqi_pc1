<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content fade-in">
          <h1 class="hero-title">
            <span class="gradient-text">羽世奇 AI</span>
          </h1>
          <p class="hero-subtitle">智启未来 · 引领AI新时代</p>
          <p class="hero-description">
            体验下一代人工智能服务，包括智能搜索、自然语言对话、多语言翻译等功能
          </p>
          <div class="hero-actions">
            <router-link to="/search" class="btn btn-primary btn-large">
              <span>开始体验</span>
              <span class="btn-arrow">→</span>
            </router-link>
            <router-link to="/chat" class="btn btn-secondary btn-large">
              AI 对话
            </router-link>
          </div>
        </div>
        <div class="hero-visual float">
          <div class="ai-avatar">
            <div class="avatar-glow"></div>
            <div class="avatar-content">🤖</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特性 -->
    <section class="features-section">
      <div class="features-container">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <div class="feature-card card fade-in">
            <div class="feature-icon">🔍</div>
            <h3 class="feature-title">智能搜索</h3>
            <p class="feature-description">
              基于AI的智能搜索引擎，理解您的意图，返回最精准的结果
            </p>
            <router-link to="/search" class="feature-link">
              立即体验 →
            </router-link>
          </div>
          <div class="feature-card card fade-in">
            <div class="feature-icon">💬</div>
            <h3 class="feature-title">AI 对话</h3>
            <p class="feature-description">
              与AI进行自然语言对话，获取帮助、解答疑惑、激发创意
            </p>
            <router-link to="/chat" class="feature-link">
              开始对话 →
            </router-link>
          </div>
          <div class="feature-card card fade-in">
            <div class="feature-icon">🌐</div>
            <h3 class="feature-title">多语言支持</h3>
            <p class="feature-description">
              支持多种语言的实时翻译，打破语言障碍，连接世界
            </p>
            <a href="#" class="feature-link">
              了解更多 →
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 会员套餐 -->
    <section class="pricing-section">
      <div class="pricing-container">
        <h2 class="section-title">会员套餐</h2>
        <div class="pricing-grid">
          <div class="pricing-card card">
            <h3 class="pricing-title">基础会员</h3>
            <div class="pricing-price">
              <span class="price">¥99</span>
              <span class="period">/月</span>
            </div>
            <ul class="pricing-features">
              <li>✓ 每日100次对话</li>
              <li>✓ 基础AI模型</li>
              <li>✓ 无广告体验</li>
              <li>✓ 优先客服支持</li>
            </ul>
            <router-link to="/payment" class="btn btn-outline">立即开通</router-link>
          </div>
          <div class="pricing-card card pricing-popular">
            <div class="popular-badge">推荐</div>
            <h3 class="pricing-title">高级会员</h3>
            <div class="pricing-price">
              <span class="price">¥299</span>
              <span class="period">/季</span>
            </div>
            <ul class="pricing-features">
              <li>✓ 无限次对话</li>
              <li>✓ 高级AI模型</li>
              <li>✓ 优先响应</li>
              <li>✓ 专属客服</li>
              <li>✓ API访问权限</li>
            </ul>
            <router-link to="/payment" class="btn btn-primary">立即开通</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: #0d1117;
}

/* Hero 区域 */
.hero-section {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.1;
}

.gradient-text {
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 24px;
  color: #8b949e;
  margin-bottom: 16px;
}

.hero-description {
  font-size: 16px;
  color: #6e7681;
  margin-bottom: 32px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-large {
  padding: 14px 32px;
  font-size: 16px;
}

.btn-arrow {
  margin-left: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  color: #e6edf3;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(88, 166, 255, 0.3);
  }
}

.btn-secondary {
  background: #21262d;
  color: #e6edf3;
  border: 1px solid #30363d;

  &:hover {
    background: #30363d;
    border-color: #58a6ff;
  }
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.ai-avatar {
  position: relative;
  width: 280px;
  height: 280px;
}

.avatar-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(88, 166, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.avatar-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 140px;
  background: rgba(22, 27, 34, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  border: 2px solid rgba(88, 166, 255, 0.3);
}

/* 功能特性 */
.features-section {
  padding: 80px 24px;
  background: #161b22;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 50px;
  color: #e6edf3;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  text-align: center;
  padding: 32px 24px;
  transition: transform 0.3s ease;
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 12px;

  &:hover {
    transform: translateY(-8px);
    border-color: #58a6ff;
  }
}

.feature-icon {
  font-size: 56px;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #e6edf3;
}

.feature-description {
  color: #6e7681;
  line-height: 1.6;
  margin-bottom: 16px;
}

.feature-link {
  color: #58a6ff;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
}

/* 会员套餐 */
.pricing-section {
  padding: 80px 24px;
  background: #0d1117;
}

.pricing-container {
  max-width: 900px;
  margin: 0 auto;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.pricing-card {
  padding: 32px;
  text-align: center;
  position: relative;
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 12px;
}

.pricing-popular {
  border-color: #58a6ff;
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

.pricing-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #e6edf3;
}

.pricing-price {
  margin-bottom: 24px;
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

.pricing-features {
  list-style: none;
  margin-bottom: 24px;
  text-align: left;
  padding: 0;
}

.pricing-features li {
  padding: 6px 0;
  color: #6e7681;
}

.btn-outline {
  display: inline-block;
  padding: 12px 28px;
  border: 2px solid #58a6ff;
  color: #58a6ff;
  background: transparent;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #58a6ff;
    color: #e6edf3;
  }
}

/* 动画 */
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-actions {
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .pricing-grid {
    grid-template-columns: 1fr;
  }

  .ai-avatar {
    width: 200px;
    height: 200px;
  }

  .avatar-content {
    font-size: 100px;
  }
}
</style>
