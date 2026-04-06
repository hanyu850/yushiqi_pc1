/**
 * 数据库配置
 */
const { Sequelize } = require('sequelize')
const env = require('./env')

const sequelize = new Sequelize(
  env.database.database,
  env.database.username,
  env.database.password,
  {
    host: env.database.host,
    port: env.database.port,
    dialect: 'mysql',
    logging: env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    }
  }
)

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('数据库连接成功')
  } catch (error) {
    console.error('数据库连接失败:', error.message)
    if (env.NODE_ENV === 'development') {
      console.log('提示: 请确保MySQL服务已启动，并创建数据库 yushiqi_ai')
    }
  }
}

testConnection()

module.exports = sequelize
