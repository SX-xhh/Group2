# Investment Portfolio Project Documentation
## Project Overview
This project is an investment portfolio system that provides investors with stock market information, personal asset display, transaction history records, and other functions. The system includes front-end pages and back-end interfaces. The front-end uses HTML, JavaScript, and Tailwind CSS to build the user interface, while the back-end uses JavaScript to handle data requests and business logic.
## Functional Features
+ Stock Market Information Display: Shows basic stock information such as code, name, price, and price change percentage, along with a list of related stocks.
+ Personal Asset Overview: Displays the investor's total assets, stock value, bond value, available cash, as well as detailed information on held stocks and bonds.
+ Transaction History Records: Records the investor's transaction history, including transaction ID, stock code, transaction type, quantity, amount, and transaction time.
+ Trading Function: Supports buying and selling operations, and provides a transaction confirmation modal box to ensure the accuracy of transaction information.
## Project Structure
### Front-end Part
+ index.html: Contains the HTML structure and JavaScript code of the entire front-end page, responsible for page layout, interaction logic, and data display.
### Back-end Part
+ portfolioModel.js: Defines the model class Portfolio that interacts with the database, including methods for obtaining all assets, stock information, current prices, asset trends, creating new assets, and calculating asset performance.
+ portfolioController.js: Contains a time formatting function for formatting date objects.
### Database Part
Stock External API: https://www.alphavantage.co/query'
Obtains daily stock data. Two tables are created: stock_daily and portfolio.

## Technology Stack
### Front-end
+ HTML: Builds the page structure.
+ JavaScript: Implements interaction logic and data processing.
+ Tailwind CSS: Used to quickly build responsive and beautiful user interfaces.
+ Axios: Used to send HTTP requests and interact with the back-end for data exchange.
+ Chart.js: Used to draw stock price trend charts.
### 后端
+ Node.js: Serves as the server-side runtime environment.
+ JavaScript: Handles data requests and business logic.
+ MySQL: Uses MySQL database to store stock information, asset information, and transaction history records.
## Installation and Operation
### Front-end
Ensure that you have installed Node.js and npm. Open the terminal and navigate to the project directory. Run the following command to start the front-end page:
open 2.html
Since the front-end uses CDN resources, you can directly open the 2.html file.

### Back-end
Ensure that you have installed Node.js and npm. Open the terminal and navigate to the back-end directory of the project. Install dependencies:
npm install
Start the server:
node server.js

## Usage Instructions
+ Login and Navigation: After opening the page, users can see the sidebar navigation, including three options: Stock Market, My Assets, and Transaction History. Clicking on the corresponding navigation links can switch pages.
+ Stock Market Page: Displays basic information of current stocks and a list of related stocks. Users can click on related stocks to view their detailed information.
+ My Assets Page: Shows an overview of the investor's assets and detailed information on held stocks and bonds.
+ Transaction History Page: Displays the investor's transaction history records. Users can click the export button to export the transaction history.
+ Trading Operations: On the Stock Market page, users can choose to buy or sell, enter the transaction price and quantity, and the system will automatically calculate the transaction amount. After clicking the confirm button, a transaction confirmation modal box will pop up. Submit the transaction request after confirming the information is correct.
## Notes
Ensure that the back-end server is running normally; otherwise, the front-end page may not be able to obtain data.
The trading function needs to interact with the back-end interface; please ensure the correctness and stability of the back-end interface.
## Contributions and Feedback
If you have any suggestions for this project or find any issues, please submit Issues or Pull Requests in the project's GitHub repository. We welcome your contributions and feedback!
