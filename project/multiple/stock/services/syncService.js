const axios = require('axios');
const { pool } = require('../db/db');
require('dotenv').config();

// 从Alpha Vantage获取单只股票的每日数据
async function fetchDailyData(symbol) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.error('请在.env中配置ALPHA_VANTAGE_API_KEY（从官网获取）');
    return null;
  }

  try {
    // 调用每日时间序列接口（TIME_SERIES_DAILY）
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY', // 接口类型：每日数据
        symbol: symbol,                // 股票代码
        apikey: apiKey,                // API Key
        outputsize: 'compact'          // 数据量：compact（最近100条）/full（20年）
      }
    });

    // 解析返回数据（核心字段：日期→开盘价、收盘价等）
    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) {
      console.error('获取 ${symbol} 数据失败：${response.data.Note || response.data.Error Message}');
      return null;
    }

    // 格式化数据（将日期作为key的对象转为数组）
    const formattedData = Object.entries(timeSeries).map(([date, values]) => ({
      symbol: symbol,
      date: date, // 日期（如2024-07-26）
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    }));

    console.log(`成功获取 ${symbol} 的每日数据（共 ${formattedData.length} 条）`);
    return formattedData;
  } catch (error) {
    console.error(`获取 ${symbol} 数据失败：`, error.message);
    return null;
  }
}

// 将每日数据批量写入数据库（支持批量插入/更新）
async function saveToDB(dailyDataList) {
  if (!dailyDataList || dailyDataList.length === 0) return;

  try {
    // 构建批量插入的SQL语句和参数
    const placeholders = dailyDataList.map(() => 
      '(?, ?, ?, ?, ?, ?, ?)'
    ).join(','); // 生成 (?, ?, ...), (?, ?, ...) 格式的占位符

    // 提取所有参数（按顺序拼接）
    const params = [];
    dailyDataList.forEach(data => {
      params.push(
        data.symbol,
        data.date,
        data.open,
        data.high,
        data.low,
        data.close,
        data.volume
      );
    });

    // 执行批量插入（存在则更新，不存在则插入）
    await pool.execute(`
      INSERT INTO stock_daily (
        symbol, date, open, high, low, close, volume
      ) VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE
        open = VALUES(open),
        high = VALUES(high),
        low = VALUES(low),
        close = VALUES(close),
        volume = VALUES(volume),
        last_updated = CURRENT_TIMESTAMP
    `, params);

    console.log(`已同步 ${dailyDataList[0].symbol} 的 ${dailyDataList.length} 条每日数据`);
  } catch (error) {
    console.error(`写入 ${dailyDataList[0].symbol} 数据失败：`, error.message);
  }
}

// 批量同步多只股票的每日数据
async function syncAllStocks() {
  const symbols = (process.env.STOCK_SYMBOLS || 'AAPL').split(','); // 从配置获取股票列表
  console.log(`开始同步股票每日数据：${symbols.join(', ')}`);

  // 逐个同步（避免触发API频率限制）
  for (const symbol of symbols) {
    const data = await fetchDailyData(symbol.trim()); // 去除空格
    if (data) {
      await saveToDB(data);
      // 延迟12秒（API限制：每分钟最多5次请求 → 每次间隔≥12秒）
      await new Promise(resolve => setTimeout(resolve, 12000));
    }
  }
}

module.exports = { syncAllStocks };