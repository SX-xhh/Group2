const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // Change to your MySQL username
  password: 'n3u3da!',     // Change to your MySQL password
  database: 'portfolio'  // Change to your database name'
});

// Open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
  
  // // Create database if it doesn't exist
  // connection.query(
  //   `CREATE DATABASE IF NOT EXISTS portfolio_db`,
  //   (err) => {
  //     if (err) throw err;
      
  //     // Use the portfolio_db database
  //     connection.query(`USE portfolio_db`, (err) => {
  //       if (err) throw err;
        
  //       // Create portfolio_items table if it doesn't exist
  //       const createTableQuery = `
  //         CREATE TABLE IF NOT EXISTS portfolio_items (
  //           id INT AUTO_INCREMENT PRIMARY KEY,
  //           type ENUM('stock', 'bond', 'cash') NOT NULL,
  //           ticker VARCHAR(10),
  //           name VARCHAR(100) NOT NULL,
  //           quantity DECIMAL(10, 2),
  //           purchase_price DECIMAL(10, 2),
  //           value DECIMAL(10, 2),
  //           purchase_date DATE,
  //           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  //         )
  //       `;
        
  //       connection.query(createTableQuery, (err) => {
  //         if (err) throw err;
  //         console.log("Table created or already exists");
  //       });
  //     });
  //   }
  // );
});

module.exports = connection;
