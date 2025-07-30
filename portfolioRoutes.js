const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Get all portfolio items
router.get('/', portfolioController.getAllItems);

// Get portfolio performance
router.get('/performance', portfolioController.getPerformance);

// Get a single portfolio item
router.get('/:id', portfolioController.getItemById);


// Get the stock info by symbol
router.get('/stock/:symbol', portfolioController.getStockInfo);


// Create a new portfolio item
// router.post('/', portfolioController.createItem);

// Update a portfolio item
// router.put('/:id', portfolioController.updateItem);

// Delete a portfolio item
// router.delete('/:id', portfolioController.deleteItem);

module.exports = router;
