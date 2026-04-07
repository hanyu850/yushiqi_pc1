<template>
  <div class="xiaozhi-home">
    <!-- 顶部导航 -->
    <header class="top-header">
      <div class="header-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>万小智</el-breadcrumb-item>
          <el-breadcrumb-item>新建应用</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 首屏区域 -->
      <section class="hero-section">
        <div class="hero-container">
          <img class="hero-logo" src="https://img.alicdn.com/imgextra/i4/O1CN01dZMdFz1Nfw0D5fQV9_!!6000000001598-2-tps-390-345.png" alt="万小智" />
          <div class="hero-text">
            <h1 class="hero-title">一键生成网站，轻松<span class="highlight">发布上线</span></h1>
            <p class="hero-subtitle">超高试用额度，尽情调试打磨，先体验后付费</p>
          </div>
          <a href="https://wanwang.aliyun.com/website/xiaozhi" target="_blank" class="guide-btn">
            了解万小智
          </a>
        </div>
      </section>

      <!-- AI对话区域 -->
      <section class="ai-chat-section">
        <div class="chat-container">
          <!-- 模式切换 -->
          <div class="mode-tabs">
            <div class="mode-tab active">
              <span class="mode-icon">💡</span>
              <div class="mode-info">
                <span class="mode-title">创意模式</span>
                <span class="mode-desc">AI主导，功能扩展性强，持续进化</span>
              </div>
            </div>
          </div>

          <!-- 智能输入区域 -->
          <div class="input-wrapper">
            <div v-if="!currentTemplate" class="normal-input">
              <el-input
                ref="normalInput"
                v-model="userInput"
                type="textarea"
                :rows="4"
                placeholder="描述你想要创建的网站，例如：我需要创建一个品牌官网，用于品牌展示，配色符合我们的品牌形象..."
                resize="none"
              />
            </div>
            <template-input
              v-else
              ref="templateInput"
              :template="currentTemplate"
              @input="handleTemplateInput"
            />
          </div>

          <!-- 清除模板按钮 -->
          <div v-if="currentTemplate" class="clear-template">
            <el-button size="small" type="text" @click="clearTemplate">
              <i class="el-icon-close"></i>
              清除模板
            </el-button>
          </div>

          <!-- 快速模板 - 始终显示 -->
          <div class="quick-templates" :class="{ 'has-template': currentTemplate }">
            <div class="template-header">
              <span class="template-title">快速开始</span>
              <span class="template-subtitle">选择模板快速创建</span>
            </div>
            <div class="template-list">
              <div
                v-for="(template, index) in templates"
                :key="index"
                class="template-item"
                :class="{ active: currentTemplate === template.template }"
                @click="selectTemplate(template)"
              >
                <div class="template-icon">{{ template.icon }}</div>
                <div class="template-info">
                  <h4 class="template-name">{{ template.name }}</h4>
                  <p class="template-desc">{{ template.shortDesc }}</p>
                </div>
                <i class="el-icon-arrow-right template-arrow" :class="{ 'active': currentTemplate === template.template }"></i>
              </div>
            </div>
          </div>

          <!-- 颜色选择器 -->
          <div class="picker-section color-picker-section">
            <div class="section-label">选择配色</div>
            <div class="color-options">
              <div
                v-for="(color, index) in colorOptions"
                :key="'color-' + index"
                class="color-item"
                :class="{ active: selectedColor === index }"
                :style="{ backgroundColor: color.value }"
                @click="selectColor(index)"
              >
                <span v-if="color.label" class="color-label">{{ color.label }}</span>
                <i v-if="selectedColor === index" class="el-icon-check color-check"></i>
              </div>
            </div>
          </div>

          <!-- 风格选择 -->
          <div class="picker-section style-picker-section">
            <div class="section-label">选择风格</div>
            <div class="style-options">
              <div
                v-for="(style, index) in styleOptions"
                :key="'style-' + index"
                class="style-item"
                :class="{ active: selectedStyle === index }"
                @click="selectStyle(index)"
              >
                <div class="style-icon">{{ style.icon }}</div>
                <span class="style-name">{{ style.name }}</span>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button class="quick-start-btn" @click="handleQuickStart">
              <i class="el-icon-magic-stick"></i>
              智能推荐
            </el-button>
            <el-button type="primary" class="create-btn" :loading="isSending" @click="handleSend">
              <i class="el-icon-s-promotion"></i>
              开始创建
            </el-button>
          </div>
        </div>
      </section>

      <!-- 精选案例 -->
      <section class="cases-section">
        <div class="cases-header">
          <h2 class="section-title">精选案例</h2>
          <div class="category-tabs">
            <span
              v-for="(cat, index) in categories"
              :key="'cat-' + index"
              class="category-tab"
              :class="{ active: activeCategory === index }"
              @click="activeCategory = index"
            >
              {{ cat }}
            </span>
          </div>
        </div>
        <div class="cases-grid">
          <div class="case-card" v-for="(item, index) in cases" :key="'case-' + index">
            <div class="case-preview">
              <img :src="item.preview" :alt="item.title" />
              <div class="case-overlay">
                <el-button type="primary" size="small" icon="el-icon-view">预览</el-button>
              </div>
            </div>
            <div class="case-info">
              <h4 class="case-title">{{ item.title }}</h4>
              <span class="case-views">{{ item.views }}次预览</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 文件上传区域 -->
      <section class="upload-section">
        <div class="upload-container">
          <el-upload
            class="upload-area"
            drag
            action="#"
            :auto-upload="false"
            :accept="'.pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.xlsx,.xls'"
            :on-change="handleFileChange"
          >
            <i class="el-icon-upload"></i>
            <div class="upload-text">
              <p>文件拖动到此处即可上传</p>
              <p class="upload-hint">支持的文件格式：PDF、Word 文档（DOC、DOCX）、图片、ZIP压缩包等</p>
            </div>
          </el-upload>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import TemplateInput from '@/components/TemplateInput.vue'

export default {
  name: 'Home',
  components: {
    TemplateInput
  },
  data() {
    return {
      userInput: '',
      isSending: false,
      activeCategory: 0,
      selectedColor: 0,
      selectedStyle: 0,
      currentTemplate: '', // 当前选中的模板
      templateContent: '', // 模板解析后的内容

      // 颜色选项
      colorOptions: [
        { value: '#1677ff', label: '蓝', name: 'blue' },
        { value: '#722ed1', label: '紫', name: 'purple' },
        { value: '#fa8c16', label: '橙', name: 'orange' },
        { value: '#52c41a', label: '绿', name: 'green' },
        { value: '#f5222d', label: '红', name: 'red' },
        { value: '#13c2c2', label: '青', name: 'cyan' },
        { value: '#eb2f96', label: '粉', name: 'pink' },
        { value: '#2f54eb', label: '深蓝', name: 'deepblue' }
      ],

      // 风格选项
      styleOptions: [
        { name: '现代简约', icon: '🎨', value: 'modern' },
        { name: '商务专业', icon: '💼', value: 'business' },
        { name: '创意时尚', icon: '✨', value: 'creative' },
        { name: '科技感', icon: '🚀', value: 'tech' },
        { name: '温馨自然', icon: '🌿', value: 'nature' },
        { name: '高端奢华', icon: '💎', value: 'luxury' }
      ],

      // 快速模板
      templates: [
        {
          icon: '🏢',
          name: '品牌官网',
          shortDesc: '展示品牌形象和产品服务',
          template: '我需要创建一个品牌官网，用于 [[品牌展示]] ，品牌名称为 [此处输入品牌] ，主营业务为 [此处输入主营业务] ，请帮我创建~'
        },
        {
          icon: '🛒',
          name: '电商网站',
          shortDesc: '在线销售商品',
          template: '我需要创建一个电商网站，用于 [[商品展示和在线销售]] ，我的品牌名为 [此处输入品牌] ，主营产品为 [此处输入主营产品] ，请帮我设计和实现一个用户友好的电商平台~'
        },
        {
          icon: '🎨',
          name: '工作室网站',
          shortDesc: '展示工作室业务',
          template: '我需要创建一个工作室品牌网站，用于 [[工作室业务展示]] ，我的工作室名称为 [此处输入名称] ，主营业务为 [此处输入主营业务] ，请帮我创建~'
        },
        {
          icon: '📰',
          name: '资讯网站',
          shortDesc: '行业资讯分享',
          template: '我需要创建一个资讯网站，用于 [[行业资讯展示]] ，我的品牌名为 [此处输入品牌名] ，主营业务为 [此处输入主营业务] ，请帮我启动搭建~'
        }
      ],

      // 案例分类
      categories: [
        '全部',
        '企业品牌',
        '电商零售',
        '生活服务',
        '餐饮美食',
        '教育培训',
        '医疗健康',
        '政府与公共事业',
        '个人主页',
        '活动页'
      ],

      // 案例数据
      cases: [
        { title: '创意数字机构', views: 52, preview: 'https://via.placeholder.com/300x200/1677ff/ffffff?text=创意数字机构' },
        { title: '简白时尚女装', views: 55, preview: 'https://via.placeholder.com/300x200/722ed1/ffffff?text=简白时尚女装' },
        { title: '未莱文化传媒', views: 51, preview: 'https://via.placeholder.com/300x200/fa8c16/ffffff?text=未莱文化传媒' },
        { title: '儿童教育培训中心', views: 43, preview: 'https://via.placeholder.com/300x200/52c41a/ffffff?text=儿童教育培训' },
        { title: '建站云平台', views: 34, preview: 'https://via.placeholder.com/300x200/13c2c2/ffffff?text=建站云平台' },
        { title: '智信金融服务', views: 20, preview: 'https://via.placeholder.com/300x200/2f54eb/ffffff?text=智信金融' },
        { title: 'SKIN北欧护肤', views: 33, preview: 'https://via.placeholder.com/300x200/eb2f96/ffffff?text=SKIN护肤' },
        { title: '高端室内设计', views: 13, preview: 'https://via.placeholder.com/300x200/f5222d/ffffff?text=室内设计' }
      ]
    }
  },
  methods: {
    // 选择模板
    selectTemplate(template) {
      if (this.currentTemplate === template.template) {
        // 如果点击已选中的模板，则取消选择
        this.clearTemplate()
      } else {
        this.currentTemplate = template.template
        this.$nextTick(() => {
          if (this.$refs.templateInput) {
            this.$refs.templateInput.$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        })
      }
    },

    // 清除模板
    clearTemplate() {
      this.currentTemplate = ''
      this.userInput = ''
    },

    // 模板输入变化
    handleTemplateInput(content) {
      this.userInput = content
    },

    // 选择颜色
    selectColor(index) {
      this.selectedColor = index
      console.log('已选择配色:', this.colorOptions[index].label)
    },

    // 选择风格
    selectStyle(index) {
      this.selectedStyle = index
      console.log('已选择风格:', this.styleOptions[index].name)
    },

    // 智能推荐
    handleQuickStart() {
      const input = this.userInput.toLowerCase()

      // 根据关键词智能推荐
      if (input.includes('品牌') || input.includes('展示')) {
        this.selectedColor = 0
        this.selectedStyle = 1
      } else if (input.includes('电商') || input.includes('购物')) {
        this.selectedColor = 2
        this.selectedStyle = 2
      } else if (input.includes('工作室') || input.includes('设计')) {
        this.selectedColor = 1
        this.selectedStyle = 0
      } else if (input.includes('科技') || input.includes('互联网')) {
        this.selectedColor = 0
        this.selectedStyle = 3
      } else if (input.includes('儿童') || input.includes('教育')) {
        this.selectedColor = 3
        this.selectedStyle = 4
      } else {
        this.selectedColor = Math.floor(Math.random() * this.colorOptions.length)
        this.selectedStyle = 0
      }

      const colorName = this.colorOptions[this.selectedColor].label
      const styleName = this.styleOptions[this.selectedStyle].name

      this.$message({
        message: `已为您推荐最佳配色（${colorName}）和风格（${styleName}）！`,
        type: 'success',
        duration: 2000
      })
    },

    // 开始创建
    handleSend() {
      // 获取输入内容
      let input = this.userInput.trim()

      // 如果使用模板输入组件，获取其内容
      if (this.$refs.templateInput) {
        input = this.$refs.templateInput.getFinalContent()
      }

      // 验证：非空，5-500字
      if (!input) {
        this.$message.warning('请输入您的建站需求')
        return
      }
      if (input.length < 5) {
        this.$message.warning('请输入您的建站需求（至少5个字）')
        return
      }
      if (input.length > 500) {
        this.$message.warning('需求描述不能超过500字')
        return
      }

      const colorName = this.colorOptions[this.selectedColor].label
      const styleName = this.styleOptions[this.selectedStyle].name
      const colorValue = this.colorOptions[this.selectedColor].value

      this.isSending = true
      setTimeout(() => {
        this.isSending = false
        this.$notify({
          title: '创建成功',
          message: `正在为您创建网站（配色：${colorName}，风格：${styleName}）...`,
          type: 'success',
          duration: 3000
        })
      }, 1500)
    },

    // 文件上传
    handleFileChange(file) {
      this.$message.success(`已选择文件：${file.name}`)
    }
  }
}
</script>

<style lang="scss">
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style lang="scss" scoped>
.xiaozhi-home {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 顶部导航 */
.top-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 12px 24px;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* 主内容 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 40px;
}

/* 首屏区域 */
.hero-section {
  background: #fff;
  padding: 32px 32px 24px;
  margin-bottom: 16px;
  border-radius: 8px;
}

.hero-container {
  display: flex;
  align-items: center;
  gap: 24px;
}

.hero-logo {
  width: 100px;
  height: auto;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 28px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  margin-bottom: 8px;
  line-height: 1.3;
}

.highlight {
  color: #1677ff;
}

.hero-subtitle {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.guide-btn {
  padding: 8px 20px;
  border: 1px solid #1677ff;
  color: #1677ff;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
  white-space: nowrap;

  &:hover {
    background: #1677ff;
    color: #fff;
  }
}

/* AI对话区域 */
.ai-chat-section {
  background: #fff;
  padding: 24px 32px 32px;
  margin-bottom: 16px;
  border-radius: 8px;
}

.chat-container {
  max-width: 800px;
  margin: 0 auto;
}

.mode-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.mode-tab {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: linear-gradient(135deg, rgba(22, 119, 255, 0.1) 0%, rgba(22, 119, 255, 0.05) 100%);
  border: 1px solid rgba(22, 119, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;

  .mode-icon {
    font-size: 20px;
  }

  .mode-info {
    display: flex;
    flex-direction: column;
  }

  .mode-title {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
  }

  .mode-desc {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
}

/* 输入区域 */
.input-wrapper {
  margin-bottom: 16px;
}

.normal-input {
  ::v-deep .el-textarea__inner {
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    padding: 16px;
    font-size: 14px;
    transition: all 0.3s;

    &:focus {
      border-color: #1677ff;
      box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
    }
  }
}

.clear-template {
  text-align: right;
  margin-bottom: 12px;

  .el-button--text {
    color: rgba(0, 0, 0, 0.45);

    &:hover {
      color: #f5222d;
    }
  }
}

/* 快速模板 */
.quick-templates {
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.3s;

  &.has-template {
    padding: 12px 16px;
    background: rgba(22, 119, 255, 0.03);
    border: 1px solid rgba(22, 119, 255, 0.15);
  }
}

.template-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.template-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
}

.template-subtitle {
  margin-left: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.template-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #1677ff;
    box-shadow: 0 2px 8px rgba(22, 119, 255, 0.1);
    transform: translateX(4px);
  }

  &.active {
    border-color: #1677ff;
    background: rgba(22, 119, 255, 0.05);
    box-shadow: 0 2px 8px rgba(22, 119, 255, 0.15);
  }

  .template-icon {
    font-size: 28px;
    flex-shrink: 0;
  }

  .template-info {
    flex: 1;
    min-width: 0;
  }

  .template-name {
    font-size: 13px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
    margin-bottom: 4px;
  }

  .template-desc {
    font-size: 11px;
    color: rgba(0, 0, 0, 0.45);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .template-arrow {
    color: rgba(0, 0, 0, 0.25);
    transition: all 0.3s;

    &.active {
      color: #1677ff;
      transform: rotate(90deg);
    }
  }

  &:hover .template-arrow:not(.active) {
    color: #1677ff;
    transform: translateX(4px);
  }
}

/* 选择器区域通用样式 */
.picker-section {
  margin-bottom: 20px;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 10px;
}

/* 颜色选择器 */
.color-picker-section {
  padding-top: 4px;
}

.color-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.color-item {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  &.active {
    border-color: #fff;
    box-shadow: 0 0 0 3px #1677ff, 0 4px 12px rgba(22, 119, 255, 0.3);
    transform: scale(1.05);
  }

  .color-label {
    font-size: 11px;
    color: #fff;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .color-check {
    color: #fff;
    font-size: 16px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
}

/* 风格选择 */
.style-picker-section {
  padding-top: 4px;
}

.style-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.style-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  min-width: 68px;
  background: #fafafa;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #69b1ff;
    background: rgba(22, 119, 255, 0.05);
    transform: translateY(-2px);
  }

  &.active {
    border-color: #1677ff;
    background: rgba(22, 119, 255, 0.1);
    box-shadow: 0 2px 8px rgba(22, 119, 255, 0.15);
  }

  .style-icon {
    font-size: 22px;
  }

  .style-name {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);

    .style-item.active & {
      color: #1677ff;
      font-weight: 600;
    }
  }
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.quick-start-btn {
  background: linear-gradient(135deg, #1677ff 0%, #722ed1 100%);
  border: none;
  color: #fff;
  padding: 10px 24px;
  border-radius: 6px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
}

.create-btn {
  padding: 10px 32px;
  border-radius: 6px;
  background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
  border: none;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
}

/* 精选案例 */
.cases-section {
  background: #fff;
  padding: 32px;
  margin-bottom: 16px;
  border-radius: 8px;
}

.cases-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  margin-bottom: 16px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-tab {
  padding: 6px 16px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  background: #f5f5f5;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: #1677ff;
  }

  &.active {
    background: #1677ff;
    color: #fff;
  }
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.case-card {
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.case-preview {
  position: relative;
  aspect-ratio: 3/2;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .case-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover .case-overlay {
    opacity: 1;
  }
}

.case-info {
  padding: 12px;
}

.case-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.case-views {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

/* 文件上传 */
.upload-section {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
}

.upload-container {
  max-width: 600px;
  margin: 0 auto;
}

.upload-area {
  ::v-deep .el-upload-dragger {
    width: 100%;
    height: 200px;
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    background: #fafafa;

    &:hover {
      border-color: #1677ff;
    }
  }

  .el-icon-upload {
    font-size: 48px;
    color: rgba(0, 0, 0, 0.25);
    margin-bottom: 16px;
  }

  .upload-text {
    p {
      margin: 0;
      color: rgba(0, 0, 0, 0.88);
      font-size: 14px;

      &.upload-hint {
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        margin-top: 8px;
      }
    }
  }
}

/* 响应式 */
@media (max-width: 1024px) {
  .cases-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
    text-align: center;
  }

  .hero-title {
    font-size: 22px;
  }

  .color-options {
    justify-content: center;
  }

  .style-options {
    flex-wrap: wrap;
    justify-content: center;
  }

  .action-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .quick-start-btn,
  .create-btn {
    width: 100%;
  }

  .template-list {
    grid-template-columns: 1fr;
  }

  .cases-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .category-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }
}
</style>
