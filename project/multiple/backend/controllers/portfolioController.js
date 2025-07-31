const Portfolio = require('../models/portfolioModel');


// Get all portfolio items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Portfolio.getAllItems();
   
    // 时间格式化函数（处理 Date 对象）
    const formatDateTime = (dateObj) => {
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return ''; // 非有效日期对象返回空字符串
      }
     
      // 获取 UTC 时间并转换为本地时间（避免时区问题）
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getSeconds()).padStart(2, '0');
     
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // 处理数据并添加交易金额和格式化时间
    const itemsWithAmount = items.map(item => ({
      ...item,
      amount: item.quantity * item.rmb_amount,
      date: formatDateTime(item.trade_date) // 格式化时间字段
    }));

    res.status(200).json(itemsWithAmount);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving portfolio items', error: error.message });
  }
};

// Delete a portfolio item
exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const result = await Portfolio.deleteItem(itemId);
   
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
   
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting portfolio item', error: error.message });
  }
};

// Get stock info by symbol
exports.getStockInfo = async (req, res) =>  {
  try {
    const stockInfo = await Portfolio.getStockInfo(req.params.symbol);
    if (!stockInfo) {
      return res.status(404).json({ message: 'Stock info not found' });
    }

    res.status(200).json(stockInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving stock info', error: error.message });
  }
};

// Get my assets
exports.getMyAssets = async (req, res) => {
  try {
    // 获取所有买入和卖出记录
    const allItemsBuy = await Portfolio.getBuyItemBySymbol();
    const allItemsSell = await Portfolio.getSellItemBySymbol();

    // 按股票代码分组处理
    const symbols = ['AAPL', 'MSFT','HSBC'];
    const assets = symbols.map(symbol => {
      // 筛选当前股票的交易记录
      const itemsBuy = allItemsBuy.filter(item => item.symbol === symbol);
      const itemsSell = allItemsSell.filter(item => item.symbol === symbol);

      // 计算买入总数量和总金额
      const totalBuyQuantity = itemsBuy.reduce((sum, item) => sum + item.quantity, 0);
      const totalBuyAmount = itemsBuy.reduce((sum, item) => sum + (item.quantity * item.rmb_amount), 0);

      // 计算卖出总数量和总金额
      const totalSellQuantity = itemsSell.reduce((sum, item) => sum + item.quantity, 0);
      const totalSellAmount = itemsSell.reduce((sum, item) => sum + (item.quantity * item.rmb_amount), 0);

      // 计算当前持有数量
      const currentQuantity = totalBuyQuantity - totalSellQuantity;

      // 计算盈亏
      const currentPrice = itemsBuy[0] ? itemsBuy[0].rmb_amount : 0; // 最新买入价格
      const pl = currentQuantity * currentPrice + totalSellAmount - totalBuyAmount;

      return {
        symbol,
        currentQuantity,
        pl: pl.toFixed(2), // 盈亏
        currentPrice,
       // asset_type: itemsBuy[0]?.asset_type || 'unknown',
      };
    });

    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving my assets', error: error.message });
  }
};

// Get a single portfolio item
exports.getItemTrend = async (req, res) => {
  try {
    const item = await Portfolio.getItemTrend(req.params.symbol);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving portfolio item', error: error.message });
  }
};

// Add buy/sell a new portfolio item
exports.createItem = async (req, res) => {
  try {
    const newItem = await Portfolio.createItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating portfolio item', error: error.message });
  }
};
