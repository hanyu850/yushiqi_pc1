/**
 * 搜索路由
 */
const express = require('express')
const router = express.Router()
const searchController = require('../controllers/search.controller')

/**
 * @route GET /api/search
 * @desc 智能搜索
 */
router.get('/', searchController.search)

/**
 * @route GET /api/search/hot
 * @desc 热门搜索
 */
router.get('/hot', searchController.getHotSearch)

module.exports = router
