<template>
  <div class="chat-page">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="header-container">
        <div class="header-left">
          <span class="chat-icon">🤖</span>
          <div class="chat-info">
            <h1 class="chat-title">万小智</h1>
            <span class="chat-status">在线</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="action-btn" @click="clearChat" title="清空对话">
            <span>🗑️</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 聊天内容 -->
    <div class="chat-content" ref="chatContent">
      <div class="content-container">
        <!-- 欢迎消息 -->
        <div v-if="messages.length === 0" class="chat-welcome">
          <div class="welcome-avatar">🤖</div>
          <h2>您好！我是万小智</h2>
          <p>有什么可以帮助您的吗？</p>
          <div class="welcome-suggestions">
            <div
              v-for="(suggestion, index) in suggestions"
              :key="index"
              class="suggestion-card"
              @click="sendSuggestion(suggestion)"
            >
              <span class="suggestion-icon">💡</span>
              <span>{{ suggestion }}</span>
            </div>
          </div>
        </div>

        <!-- 消息列表 -->
        <div v-else class="messages-list">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['message-item', message.role === 'user' ? 'message-user' : 'message-assistant']"
          >
            <div class="message-avatar">
              {{ message.role === 'user' ? '👤' : '🤖' }}
            </div>
            <div class="message-content">
              <div class="message-bubble">{{ message.content }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>

          <!-- 加载中 -->
          <div v-if="isLoading" class="message-item message-assistant">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="message-bubble message-loading">
                <span class="loading-dot"></span>
                <span class="loading-dot"></span>
                <span class="loading-dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input">
      <div class="input-container">
        <div class="input-wrapper">
          <textarea
            v-model="inputMessage"
            placeholder="输入您的问题..."
            rows="1"
            @keydown.enter.exact.prevent="sendMessage"
            ref="inputTextarea"
          ></textarea>
          <button
            class="send-btn"
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isLoading"
          >
            <span v-if="!isLoading">发送</span>
            <span v-else>...</span>
          </button>
        </div>
        <div class="input-hint">
          按 Enter 发送，Shift + Enter 换行
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Chat',
  data() {
    return {
      inputMessage: '',
      messages: [],
      isLoading: false,
      currentSessionId: null,
      suggestions: [
        '你好，请介绍一下自己',
        '今天天气怎么样',
        '帮我写一段代码',
        '推荐一些好看的电影',
        '解释什么是人工智能',
        '如何学习编程'
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['isAuthenticated'])
  },
  methods: {
    async sendMessage() {
      if (!this.inputMessage.trim() || this.isLoading) {
        return
      }

      // 检查登录状态
      if (!this.isAuthenticated) {
        this.$message?.warning('请先登录')
        this.$router.push('/login')
        return
      }

      const message = this.inputMessage.trim()
      this.inputMessage = ''

      // 添加用户消息
      this.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      })

      this.scrollToBottom()

      // 发送到服务器
      this.isLoading = true
      try {
        const response = await this.$api.chat.sendMessage({
          content: message,
          sessionId: this.currentSessionId
        })

        // 添加AI回复
        this.messages.push({
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date()
        })

        this.currentSessionId = response.data.sessionId
      } catch (error) {
        console.error('发送消息失败:', error)
        // 模拟回复
        this.messages.push({
          role: 'assistant',
          content: '抱歉，我暂时无法回答这个问题。请稍后再试。',
          timestamp: new Date()
        })
      } finally {
        this.isLoading = false
        this.scrollToBottom()
      }
    },

    sendSuggestion(text) {
      this.inputMessage = text
      this.sendMessage()
    },

    clearChat() {
      if (this.messages.length === 0) return

      this.$confirm?.('确定要清空对话记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.messages = []
        this.currentSessionId = null
      }).catch(() => {})
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const content = this.$refs.chatContent
        if (content) {
          content.scrollTop = content.scrollHeight
        }
      })
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  watch: {
    inputMessage() {
      this.$nextTick(() => {
        const textarea = this.$refs.inputTextarea
        if (textarea) {
          textarea.style.height = 'auto'
          textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0d1117;
}

/* 聊天头部 */
.chat-header {
  background: #161b22;
  border-bottom: 1px solid #30363d;
  padding: 16px 0;
  flex-shrink: 0;
}

.header-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chat-icon {
  font-size: 32px;
}

.chat-info {
  display: flex;
  flex-direction: column;
}

.chat-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #e6edf3;
}

.chat-status {
  font-size: 12px;
  color: #238636;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #238636;
    border-radius: 50%;
  }
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #21262d;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;

  &:hover {
    background: #30363d;
  }
}

/* 聊天内容 */
.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
}

.content-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  min-height: 100%;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.message-item {
  display: flex;
  gap: 12px;
  animation: messageIn 0.3s ease;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: #21262d;
  border: 1px solid #30363d;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
}

.message-bubble {
  padding: 14px 18px;
  border-radius: 16px;
  line-height: 1.6;
  word-break: break-word;
  color: #e6edf3;
}

.message-assistant .message-bubble {
  background: #21262d;
  border: 1px solid #30363d;
  border-top-left-radius: 4px;
}

.message-user .message-bubble {
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  border-top-right-radius: 4px;
}

.message-time {
  font-size: 12px;
  color: #6e7681;
  margin-top: 6px;
}

.message-user .message-time {
  text-align: right;
}

/* 加载动画 */
.message-loading {
  display: flex;
  gap: 6px;
  padding: 16px 20px;
}

.loading-dot {
  width: 8px;
  height: 8px;
  background: #58a6ff;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}

.loading-dot:nth-child(1) { animation-delay: 0s; }
.loading-dot:nth-child(2) { animation-delay: 0.2s; }
.loading-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
}

/* 欢迎界面 */
.chat-welcome {
  text-align: center;
  padding: 60px 20px;
}

.welcome-avatar {
  font-size: 64px;
  margin-bottom: 24px;
}

.chat-welcome h2 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #e6edf3;
}

.chat-welcome p {
  color: #6e7681;
  margin-bottom: 40px;
}

.welcome-suggestions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-width: 500px;
  margin: 0 auto;
}

.suggestion-card {
  padding: 16px 20px;
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;

  &:hover {
    border-color: #58a6ff;
    background: #30363d;
    transform: translateY(-2px);
  }
}

.suggestion-icon {
  font-size: 18px;
  flex-shrink: 0;
}

/* 输入区域 */
.chat-input {
  background: #161b22;
  border-top: 1px solid #30363d;
  padding: 20px 0;
  flex-shrink: 0;
}

.input-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 16px;
  padding: 8px 8px 8px 20px;
  transition: all 0.3s;

  &:focus-within {
    border-color: #58a6ff;
    box-shadow: 0 0 0 4px rgba(88, 166, 255, 0.1);
  }
}

.input-wrapper textarea {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 8px;
  font-size: 15px;
  resize: none;
  outline: none;
  max-height: 120px;
  font-family: inherit;
  color: #e6edf3;

  &::placeholder {
    color: #6e7681;
  }
}

.send-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #58a6ff 0%, #a371f7 100%);
  color: #e6edf3;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(88, 166, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.input-hint {
  text-align: center;
  font-size: 12px;
  color: #6e7681;
  margin-top: 10px;
}

/* 滚动条样式 */
.chat-content::-webkit-scrollbar {
  width: 8px;
}

.chat-content::-webkit-scrollbar-track {
  background: #0d1117;
}

.chat-content::-webkit-scrollbar-thumb {
  background: #30363d;
  border-radius: 4px;

  &:hover {
    background: #484f58;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .welcome-suggestions {
    grid-template-columns: 1fr;
  }

  .message-content {
    max-width: 85%;
  }

  .header-container,
  .content-container,
  .input-container {
    padding: 0 16px;
  }

  .chat-icon {
    font-size: 28px;
  }

  .chat-title {
    font-size: 16px;
  }
}
</style>
