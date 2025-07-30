const Portfolio = require('../models/portfolioModel');

// Get all portfolio items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Portfolio.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving portfolio items', error: error.message });
  }
};

// Get a single portfolio item
exports.getItemById = async (req, res) => {
  try {
    const item = await Portfolio.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving portfolio item', error: error.message });
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

// Create a new portfolio item
exports.createItem = async (req, res) => {
  try {
    const newItem = await Portfolio.createItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating portfolio item', error: error.message });
  }
};

// Update a portfolio item
exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Portfolio.updateItem(req.params.id, req.body);
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating portfolio item', error: error.message });
  }
};

// Delete a portfolio item
exports.deleteItem = async (req, res) => {
  try {
    await Portfolio.deleteItem(req.params.id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting portfolio item', error: error.message });
  }
};

// Get portfolio performance
exports.getPerformance = async (req, res) => {
  try {
    const performance = await Portfolio.getPerformance();
    res.status(200).json(performance);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving portfolio performance', error: error.message });
  }
};
