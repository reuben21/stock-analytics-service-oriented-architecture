const Stock = require("../model/StockSchema");

// Express route for the controller
const openingTimeTopStockPerformer = async (req, res) => {
  try {
    // Convert date string to integer
    const dateInt = parseInt(req.query.date);

    const morningOpeningStart = 33480000;
    const morningOpeningEnd = 37080000;

    // Find stocks during morning opening and group by ticker
    const stocks = await Stock.find({
      date: dateInt,
      timestamp: { $gte: morningOpeningStart, $lt: morningOpeningEnd },
    });

    // Group and calculate average price and total size
    const groupedStocks = stocks.reduce((accumulator, stock) => {
      const ticker = stock.ticker;

      if (!accumulator[ticker]) {
        accumulator[ticker] = {
          count: 1,
          average_price: stock.price,
          total_size: stock.size,
        };
      } else {
        accumulator[ticker].count += 1;
        accumulator[ticker].average_price += stock.price;
        accumulator[ticker].total_size += stock.size;
      }

      return accumulator;
    }, {});
    //
    // // Calculate average price
    Object.keys(groupedStocks).forEach((ticker) => {
      const stockData = groupedStocks[ticker];
      stockData.average_price /= stockData.count;
    });
    //
    // // Sort by average price
    const sortedStocksArray = Object.entries(groupedStocks);
    sortedStocksArray.sort((a, b) => b[1].average_price - a[1].average_price);
    const slicedStocks = sortedStocksArray
      .slice(0, 10)
      .map(([ticker, data]) => ({
        ticker,
        average_price: data.average_price,
        total_size: data.total_size,
      }));

    // Respond with the result
    res.status(200).json(slicedStocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const closingTimeTopStockPerformer = async (req, res) => {
  try {
    // Convert date string to integer
    const dateInt = parseInt(req.query.date);

    const morningOpeningStart = 55080000;
    const morningOpeningEnd = 58680000;

    // Find stocks during morning opening and group by ticker
    const stocks = await Stock.find({
      date: dateInt,
      timestamp: { $gte: morningOpeningStart, $lt: morningOpeningEnd },
    });

    // Group and calculate average price and total size
    const groupedStocks = stocks.reduce((accumulator, stock) => {
      const ticker = stock.ticker;

      if (!accumulator[ticker]) {
        accumulator[ticker] = {
          count: 1,
          average_price: stock.price,
          total_size: stock.size,
        };
      } else {
        accumulator[ticker].count += 1;
        accumulator[ticker].average_price += stock.price;
        accumulator[ticker].total_size += stock.size;
      }

      return accumulator;
    }, {});
    //
    // // Calculate average price
    Object.keys(groupedStocks).forEach((ticker) => {
      const stockData = groupedStocks[ticker];
      stockData.average_price /= stockData.count;
    });
    //
    // // Sort by average price
    const sortedStocksArray = Object.entries(groupedStocks);
    sortedStocksArray.sort((a, b) => b[1].average_price - a[1].average_price);
    const slicedStocks = sortedStocksArray
      .slice(0, 10)
      .map(([ticker, data]) => ({
        ticker,
        average_price: data.average_price,
        total_size: data.total_size,
      }));

    // Respond with the result
    res.status(200).json(slicedStocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  openingTimeTopStockPerformer,
  closingTimeTopStockPerformer,
};
