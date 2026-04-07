<template>
  <div class="smart-input-wrapper">
    <div class="smart-input-content" @click="handleWrapperClick">
      <span
        v-for="(part, index) in parts"
        :key="index"
        class="content-part"
      >
        <!-- 普通文本 -->
        <span v-if="part.type === 'text'" class="normal-text">{{ part.content }}</span>

        <!-- [[]] 说明文字 - 稍微深点的浅蓝 -->
        <span v-else-if="part.type === 'desc'" class="placeholder-desc">{{ part.content }}</span>

        <!-- [] 输入占位符 - 浅色浅蓝，可点击输入 -->
        <template v-else-if="part.type === 'input'">
          <!-- 未输入状态：显示占位符提示 -->
          <span
            v-if="!part.isEditing && !part.userValue"
            class="placeholder-input"
            @click.stop="startEdit(index)"
          >
            {{ part.placeholder }}
          </span>
          <!-- 编辑状态：显示输入框 -->
          <input
            v-if="part.isEditing"
            :ref="'input-' + index"
            v-model="part.tempValue"
            class="inline-input"
            @click.stop
            @blur="endEdit(index)"
            @keyup.enter="endEdit(index)"
            @keyup.esc="cancelEdit(index)"
          />
          <!-- 已输入状态：显示用户输入的内容，可再次编辑 -->
          <span
            v-if="!part.isEditing && part.userValue"
            class="user-input"
            @click.stop="startEdit(index)"
          >
            {{ part.userValue }}
          </span>
        </template>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TemplateInput',
  props: {
    template: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      parts: []
    }
  },
  watch: {
    template: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.parseTemplate(newVal)
        }
      }
    }
  },
  methods: {
    // 解析模板为多个部分
    parseTemplate(template) {
      if (!template) {
        this.parts = []
        return
      }

      const parts = []
      let currentIndex = 0
      // 匹配 [[]] 或 []
      const regex = /\[\[([^\]]+)\]\]|\[([^\]]+)\]/g
      let lastIndex = 0
      let match

      while ((match = regex.exec(template)) !== null) {
        // 添加前面的普通文本
        if (match.index > lastIndex) {
          const text = template.substring(lastIndex, match.index)
          if (text) {
            parts.push({
              type: 'text',
              content: text
            })
          }
        }

        // 添加匹配到的占位符
        if (match[1]) {
          // [[]] 说明文字
          parts.push({
            type: 'desc',
            content: match[1]
          })
        } else if (match[2]) {
          // [] 输入占位符
          parts.push({
            type: 'input',
            placeholder: match[2],
            userValue: '',
            tempValue: '',
            isEditing: false
          })
        }

        lastIndex = regex.lastIndex
      }

      // 添加剩余的文本
      if (lastIndex < template.length) {
        const text = template.substring(lastIndex)
        if (text) {
          parts.push({
            type: 'text',
            content: text
          })
        }
      }

      this.parts = parts
    },

    // 开始编辑占位符
    startEdit(index) {
      const part = this.parts[index]
      part.isEditing = true
      part.tempValue = part.userValue || ''
      this.$nextTick(() => {
        const ref = this.$refs['input-' + index]
        if (ref && ref[0]) {
          ref[0].focus()
          // 如果没有值，全选；如果有值，光标放最后
          if (!part.userValue) {
            ref[0].select()
          } else {
            ref[0].setSelectionRange(part.tempValue.length, part.tempValue.length)
          }
        }
      })
    },

    // 结束编辑
    endEdit(index) {
      const part = this.parts[index]
      part.isEditing = false
      // 如果有输入内容，保存
      if (part.tempValue.trim()) {
        part.userValue = part.tempValue.trim()
      } else {
        part.userValue = ''
      }
      part.tempValue = ''
      this.emitChange()
    },

    // 取消编辑
    cancelEdit(index) {
      const part = this.parts[index]
      part.isEditing = false
      part.tempValue = ''
    },

    // 点击包装器
    handleWrapperClick() {
      // 可以在这里添加全局点击处理
    },

    // 触发变化事件
    emitChange() {
      const content = this.getContent()
      this.$emit('input', content)
    },

    // 获取最终内容
    getContent() {
      return this.parts.map(part => {
        if (part.type === 'text') {
          return part.content
        } else if (part.type === 'desc') {
          return part.content
        } else if (part.type === 'input') {
          return part.userValue || part.placeholder
        }
        return ''
      }).join('')
    },

    // 暴露给父组件的方法
    getFinalContent() {
      return this.getContent()
    }
  }
}
</script>

<style lang="scss" scoped>
.smart-input-wrapper {
  width: 100%;
}

.smart-input-content {
  min-height: 60px;
  max-height: 300px;
  overflow-y: auto;
  padding: 16px;
  font-size: 14px;
  line-height: 1.8;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fff;
  transition: all 0.3s;
  cursor: text;

  &:hover {
    border-color: #b8b8b8;
  }

  &:focus-within {
    outline: none;
    border-color: #1677ff;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
  }
}

.content-part {
  display: inline;
}

// 普通文本
.normal-text {
  color: rgba(0, 0, 0, 0.88);
}

// [[]] 说明文字 - 稍微深点的浅蓝
.placeholder-desc {
  color: #1677ff;
  font-weight: 500;
  user-select: none;
}

// [] 输入占位符 - 浅色浅蓝，可点击
.placeholder-input {
  display: inline-block;
  min-width: 60px;
  padding: 2px 8px;
  margin: 0 2px;
  background: rgba(22, 119, 255, 0.06);
  border: 1px dashed #69b1ff;
  border-radius: 4px;
  color: #1677ff;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    background: rgba(22, 119, 255, 0.1);
    border-color: #1677ff;
  }
}

// 内联输入框
.inline-input {
  min-width: 80px;
  max-width: 200px;
  padding: 2px 8px;
  margin: 0 2px;
  border: 1px solid #1677ff;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  color: #1677ff;
  background: #fff;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: rgba(22, 119, 255, 0.4);
  }
}

// 用户输入后的内容 - 稍微深点的浅蓝
.user-input {
  display: inline-block;
  padding: 2px 6px;
  margin: 0 2px;
  color: #1677ff;
  font-weight: 500;
  background: rgba(22, 119, 255, 0.08);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    background: rgba(22, 119, 255, 0.12);
  }
}

// 滚动条样式
.smart-input-content::-webkit-scrollbar {
  width: 6px;
}

.smart-input-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.smart-input-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;

  &:hover {
    background: #a8a8a8;
  }
}
</style>
