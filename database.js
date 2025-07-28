const mysql = require("mysql2/promise");

async function createStockTradingDB() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'n3u3da!'
    });

    // 创建数据库
    await connection.execute('CREATE DATABASE IF NOT EXISTS user_details');
    console.log('数据库创建成功');

    // 使用非预编译查询切换到创建的数据库
    await connection.query('USE user_details');
    console.log('已切换到 user_details 数据库');

    // 创建交易明细表（核心表）
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS trade_details (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        stock_id INT,
        user_name VARCHAR(10) NOT NULL,
        trade_type ENUM('buy', 'sell') ,
        trade_quantity DECIMAL(10, 2) ,
        trade_price DECIMAL(10, 2) ,
        total_amount DECIMAL(10, 2),
        rate DECIMAL(5, 2) DEFAULT 0.00,
        trade_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('交易明细表创建成功');
    // await connection.execute(`
    //   create table if not exists porfolio (
    //     porfolio_id INT PRIMARY KEY AUTO_INCREMENT,
    //     asset_type ENUM('stock', 'fund') NOT NULL,
    //     stock_id INT NOT NULL,
    //     asset_amount DECIMAL(10, 2) NOT NULL,
    //     current_price DECIMAL(10, 2) NOT NULL,
    //     high_price DECIMAL(10, 2) NOT NULL,
    //     low_price DECIMAL(10, 2) NOT NULL,
    //     open_price DECIMAL(10, 2) NOT NULL,
    //     close_price DECIMAL(10, 2) NOT NULL)
    // `)
    // console.log('股票表创建成功');
    

    // 关闭连接
    await connection.end();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('数据库操作出错:', error);
  }
}

// 执行数据库创建和初始化
createStockTradingDB();
