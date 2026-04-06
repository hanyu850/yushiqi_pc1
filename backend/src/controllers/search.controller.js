/**
 * 搜索控制器
 */
const axios = require('axios')

/**
 * 智能搜索
 */
exports.search = async (req, res, next) => {
  try {
    const { q } = req.query

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        code: 400,
        message: '搜索关键词不能为空'
      })
    }

    const query = q.trim()

    // TODO: 接入实际的搜索服务
    // 可以使用搜索引擎API（如Google、Bing）或AI增强搜索

    // 模拟搜索结果
    const results = [
      {
        type: 'url',
        title: `${query} - 相关信息`,
        snippet: `关于"${query}"的详细介绍，包括基本概念、应用场景等内容。`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`
      },
      {
        type: 'document',
        title: `${query}技术文档`,
        snippet: `详细的技术文档，帮助您了解${query}的使用方法和最佳实践。`,
        url: `https://docs.example.com/${encodeURIComponent(query)}`
      },
      {
        type: 'faq',
        title: `${query}常见问题解答`,
        snippet: `关于${query}的常见问题和解答，帮助您快速解决问题。`,
        url: `https://faq.example.com/${encodeURIComponent(query)}`
      }
    ]

    res.json({
      code: 200,
      data: {
        query,
        results
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * 热门搜索
 */
exports.getHotSearch = async (req, res, next) => {
  try {
    // TODO: 可以从数据库或缓存中获取实际的热门搜索词

    const hotSearch = [
      'AI对话',
      '智能搜索',
      '羽世奇AI',
      '人工智能',
      '机器学习',
      '自然语言处理',
      '深度学习',
      '大语言模型'
    ]

    res.json({
      code: 200,
      data: hotSearch
    })
  } catch (error) {
    next(error)
  }
}
