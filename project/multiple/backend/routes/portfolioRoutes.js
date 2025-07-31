const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Get all portfolio items
router.get('/pf', portfolioController.getAllItems);

// Delete a portfolio item
router.delete('/pf/:id', portfolioController.deleteItem);

// Get the stock info by symbol
router.get('/stock/:symbol', portfolioController.getStockInfo);

// Get my assets
router.get('/myAssets', portfolioController.getMyAssets);

// Get a stock price trend
router.get('/:symbol', portfolioController.getItemTrend);

// Create a new portfolio item
router.post('/handle', portfolioController.createItem);


module.exports = router;
