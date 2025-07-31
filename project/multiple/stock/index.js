require('dotenv').config();
const { initDB } = require('./db/db');
const { syncAllStocks } = require('./services/syncService');

// 启动程序
async function start() {
  try {
    // 1. 初始化数据库（创建表）
    await initDB();

    // 2. 立即执行一次同步
    await syncAllStocks();

    // 3. 设置定时同步（默认1小时一次，避免触发API限制）
    const interval = parseInt(process.env.SYNC_INTERVAL) || 3600000; // 毫秒
    setInterval(syncAllStocks, interval);
    console.log(`定时同步已启动，间隔：${interval / 1000 / 60}分钟`);

    // 监听异常
    process.on('uncaughtException', (error) => {
      console.error('未捕获的异常：', error);
    });
  } catch (error) {
    console.error('程序启动失败：', error);
    process.exit(1); // 异常退出
  }
}

// 启动应用
start();