const express = require('express');
const cors = require('cors');
const portfolioRoutes = require('./routes/portfolioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/portfolio', portfolioRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Portfolio Management API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
