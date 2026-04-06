<template>
  <div class="search-page">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-header">
          <h1 class="search-title">智能搜索</h1>
          <p class="search-subtitle">输入您想要搜索的内容，AI将为您提供最精准的结果</p>
        </div>
        <div class="search-bar-wrapper">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input
              ref="searchInput"
              v-model="query"
              type="text"
              placeholder="搜索 anything..."
              @keyup.enter="handleSearch"
            >
            <button class="search-btn" @click="handleSearch" :disabled="!query.trim()">
              搜索
            </button>
          </div>
        </div>

        <!-- 搜索建议 -->
        <div v-if="!hasSearched" class="search-suggestions">
          <h3 class="suggestions-title">🔥 热门搜索</h3>
          <div class="suggestions-list">
            <span
              v-for="(item, index) in hotSearch"
              :key="index"
              class="suggestion-tag"
              @click="quickSearch(item)"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="hasSearched" class="results-section">
      <div class="results-container">
        <div v-if="isLoading" class="search-loading">
          <div class="loading-spinner"></div>
          <p>正在搜索中...</p>
        </div>

        <div v-else-if="results.length > 0" class="results-content">
          <div class="results-header">
            <h2 class="results-title">找到 {{ results.length }} 个结果</h2>
            <span class="results-query">"{{ query }}"</span>
          </div>
          <div class="results-grid">
            <div
              v-for="(result, index) in results"
              :key="index"
              class="result-card"
            >
              <div class="result-icon">{{ getResultIcon(result.type) }}</div>
              <div class="result-body">
                <a :href="result.url" class="result-title" target="_blank">
                  {{ result.title }}
                </a>
                <p class="result-snippet">{{ result.snippet }}</p>
                <a :href="result.url" class="result-url" target="_blank">
                  {{ result.url }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="search-empty">
          <div class="empty-icon">🔍</div>
          <h3>未找到相关结果</h3>
          <p>试试其他关键词吧</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      query: '',
      hasSearched: false,
      isLoading: false,
      results: [],
      hotSearch: [
        'AI对话',
        '智能搜索',
        '羽世奇AI',
        '人工智能',
        '机器学习',
        '自然语言处理',
        '深度学习',
        '大语言模型'
      ]
    }
  },
  mounted() {
    this.$refs.searchInput?.focus()
  },
  methods: {
    async handleSearch() {
      if (!this.query.trim()) {
        return
      }

      this.hasSearched = true
      this.isLoading = true

      try {
        const response = await this.$api.search.search(this.query)
        this.results = response.data.results || []

        // 模拟数据（如果没有API）
        if (this.results.length === 0 && !response.data) {
          this.results = this.getMockResults()
        }
      } catch (error) {
        console.error('搜索失败:', error)
        // 使用模拟数据
        this.results = this.getMockResults()
      } finally {
        this.isLoading = false
      }
    },

    getMockResults() {
      return [
        {
          type: 'url',
          title: `${this.query} - 百度百科`,
          snippet: `${this.query}的相关信息介绍，包括基本概念、应用场景、发展历史等内容。`,
          url: 'https://baike.baidu.com'
        },
        {
          type: 'document',
          title: `${this.query}技术文档`,
          snippet: `详细的技术文档，帮助您了解${this.query}的使用方法和最佳实践。`,
          url: 'https://docs.example.com'
        },
        {
          type: 'faq',
          title: `${this.query}常见问题解答`,
          snippet: `关于${this.query}的常见问题和解答，帮助您快速解决问题。`,
          url: 'https://faq.example.com'
        }
      ]
    },

    quickSearch(keyword) {
      this.query = keyword
      this.handleSearch()
    },

    getResultIcon(type) {
      const icons = {
        url: '🔗',
        faq: '❓',
        document: '📄'
      }
      return icons[type] || '📄'
    }
  }
}
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: #0d1117;
}

/* 搜索区域 */
.search-section {
  padding: 60px 24px 40px;
  background: linear-gradient(180deg, #161b22 0%, #0d1117 100%);
  border-bottom: 1px solid #30363d;
}

.search-container {
  max-width: 900px;
  margin: 0 auto;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
}

.search-title {
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-subtitle {
  font-size: 16px;
  color: #6e7681;
}

.search-bar-wrapper {
  margin-bottom: 32px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #21262d;
  border: 2px solid #30363d;
  border-radius: 16px;
  padding: 8px 8px 8px 20px;
  transition: all 0.3s;

  &:focus-within {
    border-color: #58a6ff;
    box-shadow: 0 0 0 4px rgba(88, 166, 255, 0.1);
  }
}

.search-icon {
  font-size: 24px;
}

.search-bar input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 8px;
  font-size: 16px;
  color: #e6edf3;
  outline: none;

  &::placeholder {
    color: #6e7681;
  }
}

.search-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  color: #e6edf3;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(88, 166, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* 搜索建议 */
.search-suggestions {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 24px;
}

.suggestions-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #e6edf3;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.suggestion-tag {
  padding: 8px 20px;
  background: #30363d;
  color: #8b949e;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;

  &:hover {
    background: #58a6ff;
    color: #e6edf3;
    transform: translateY(-2px);
  }
}

/* 搜索结果区域 */
.results-section {
  padding: 40px 24px;
}

.results-container {
  max-width: 900px;
  margin: 0 auto;
}

.search-loading {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid rgba(88, 166, 255, 0.2);
  border-top-color: #58a6ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.results-content {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.results-title {
  font-size: 20px;
  font-weight: 700;
  color: #e6edf3;
}

.results-query {
  font-size: 16px;
  color: #58a6ff;
}

.results-grid {
  display: grid;
  gap: 20px;
}

.result-card {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 12px;
  transition: all 0.3s;

  &:hover {
    border-color: #58a6ff;
    transform: translateX(4px);
    box-shadow: 0 4px 20px rgba(88, 166, 255, 0.1);
  }
}

.result-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.result-body {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 16px;
  font-weight: 600;
  color: #58a6ff;
  text-decoration: none;
  display: block;
  margin-bottom: 8px;

  &:hover {
    text-decoration: underline;
  }
}

.result-snippet {
  color: #6e7681;
  line-height: 1.6;
  margin-bottom: 12px;
}

.result-url {
  color: #8b949e;
  font-size: 13px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: #58a6ff;
  }

  &::before {
    content: '🔗';
    font-size: 12px;
  }
}

/* 空状态 */
.search-empty {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.search-empty h3 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #e6edf3;
}

.search-empty p {
  color: #6e7681;
}

/* 响应式 */
@media (max-width: 768px) {
  .search-title {
    font-size: 28px;
  }

  .search-bar {
    flex-wrap: wrap;
    padding: 12px;
  }

  .search-btn {
    width: 100%;
  }

  .results-header {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
