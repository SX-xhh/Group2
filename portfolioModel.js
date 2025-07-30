const db = require('../config/db');
const axios = require('axios');

class Portfolio {
  // Get all portfolio items
  static getAllItems() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM portfolio_items', (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Get a single portfolio item
  static getItemById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM portfolio_items WHERE id = ?', [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  //Get stock info by symbol
  static getStockInfo(symbol) {
    return new Promise((resolve, reject) => {
      //db.query(`SELECT open, high, low, close,volume FROM stock_daily WHERE symbol = `${symbol}` ORDER BY date DESC LIMIT 1;`, [symbol], (err, results) => {
      db.query('SELECT open, high, low, close,volume FROM stock_daily WHERE symbol = "AAPL" ORDER BY date DESC LIMIT 1;', [symbol], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  }


  // Create a new portfolio item
  static createItem(item) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO portfolio_items SET ?', item, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve({ id: results.insertId, ...item });
        }
      });
    });
  }

  // Update a portfolio item
  static updateItem(id, item) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE portfolio_items SET ? WHERE id = ?', [item, id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve({ id, ...item });
        }
      });
    });
  }

  // Delete a portfolio item
  static deleteItem(id) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM portfolio_items WHERE id = ?', [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Fetch current price from external API
  static async fetchCurrentPrice(ticker) {
    try {
      const response = await axios.get(`https://c4rm9elh30.execute-api.us-east-1.amazonaws.com/default/cachedPriceData?ticker=${ticker}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching price data:', error);
      throw error;
    }
  }

  // Get portfolio performance data
  static async getPerformance() {
    try {
      const items = await this.getAllItems();
      const performanceData = [];
      let totalInitialValue = 0;
      let totalCurrentValue = 0;
      
      for (const item of items) {
        if (item.type === 'stock' && item.ticker) {
          try {
            const priceData = await this.fetchCurrentPrice(item.ticker);
            const currentPrice = priceData.price || 0;
            const currentValue = currentPrice * item.quantity;
            const initialValue = item.purchase_price * item.quantity;
            
            totalInitialValue += initialValue;
            totalCurrentValue += currentValue;
            
            const performance = initialValue > 0 ? 
              ((currentValue - initialValue) / initialValue) * 100 : 0;
            
            performanceData.push({
              id: item.id,
              name: item.name,
              ticker: item.ticker,
              type: item.type,
              quantity: item.quantity,
              purchase_price: item.purchase_price,
              current_price: currentPrice,
              current_value: currentValue,
              initial_value: initialValue,
              performance: performance.toFixed(2)
            });
          } catch (err) {
            console.error(`Error fetching data for ${item.ticker}:`, err);
            performanceData.push({
              id: item.id,
              name: item.name,
              ticker: item.ticker,
              type: item.type,
              quantity: item.quantity,
              purchase_price: item.purchase_price,
              current_price: 0,
              current_value: 0,
              initial_value: item.purchase_price * item.quantity,
              performance: 0,
              error: "Failed to fetch price data"
            });
          }
        } else {
          // For non-stock assets or stocks without tickers
          const value = item.value || 0;
          totalCurrentValue += value;
          totalInitialValue += value;
          
          performanceData.push({
            id: item.id,
            name: item.name,
            type: item.type,
            value: value,
            current_value: value,
            initial_value: value,
            performance: 0
          });
        }
      }
      
      const overallPerformance = totalInitialValue > 0 ? 
        ((totalCurrentValue - totalInitialValue) / totalInitialValue) * 100 : 0;
      
      return {
        items: performanceData,
        summary: {
          totalInitialValue,
          totalCurrentValue,
          overallPerformance: overallPerformance.toFixed(2)
        }
      };
    } catch (error) {
      console.error('Error calculating performance:', error);
      throw error;
    }
  }
}

module.exports = Portfolio;
