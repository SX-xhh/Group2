const mysql = require('mysql2/promise');
require('dotenv').config();

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

// 初始化数据库（创建表）
async function initDB() {
  try {
    const connection = await pool.getConnection();

    // 1. 创建数据库（如果不存在）
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    // 2. 创建股票每日数据表（核心表）
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS stock_daily (
        id INT PRIMARY KEY AUTO_INCREMENT,
        symbol VARCHAR(20) NOT NULL,  # 股票代码（如AAPL）
        date DATE NOT NULL,  # 交易日期（如2024-07-28）
        open DECIMAL(10, 4) NOT NULL,  # 开盘价
        high DECIMAL(10, 4) NOT NULL,  # 最高价
        low DECIMAL(10, 4) NOT NULL,   # 最低价
        close DECIMAL(10, 4) NOT NULL, # 收盘价
        volume BIGINT NOT NULL,        # 成交量
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        # 唯一约束：同一股票同一日期的数据不重复存储
        UNIQUE KEY unique_symbol_date (symbol, date)
      )
    `);
    // 3. 创建投资组合表（如果不存在）
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS portfolio (
         id INT PRIMARY KEY AUTO_INCREMENT, #主键ID
         symbol VARCHAR(20) NOT NULL, #资产代码
         asset_type VARCHAR(20) NOT NULL, #资产类型（股票、债券、基金等)
         type VARCHAR(20) NOT NULL,  #类型（买入、卖出）
         quantity BIGINT NOT NULL,  #数量
         rmb_amount DECIMAL(10, 4), #人民币金额
         usd_amount DECIMAL(10, 4), #美元金额
         trade_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP #交易时间,
        )
      `);

    connection.release();
    console.log('数据库初始化成功：已创建 stock_daily 表');
  } catch (error) {
    console.error('数据库初始化失败：', error.message);
    throw error; // 抛出错误，终止启动
  }
}

module.exports = { pool, initDB };