const { CloudantV1 } = require('@ibm-cloud/cloudant');
const volitilityQuery = require('../services/volatility-tracker/volatility-service');

async function executeVolatilityQuery(req, res, next) {
  if (req.body) {
		try {
			queryBody = {
			  queryParams: req.body.query,
			  fields: req.body.fields,
			  sort: req.body.sort,
			  limit: 100000000000,
			};
			const result = await volitilityQuery.query(queryBody);
			avgPrice = 0;
			result.forEach(i => {
				i.price = i.price/10000
				avgPrice += i.price;
			});
			avgPrice = avgPrice / result.length;
			
			diffSum = 0;
			result.forEach(i => {
				i.price = i.price - avgPrice;
				i.price = i.price * i.price;
				diffSum += i.price;
			});
			variance = diffSum / result.length;
			standardDeviation = Math.sqrt(variance)

			returnValue = "The standard deviation indicates that the stock price of: " + req.body.query.ticker + " usually deviates from its average stock price by $" + Math.round((standardDeviation+Number.EPSILON)*100)/100;
	  
			res.status(200).json(returnValue);
		  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Error executing query.' });
	}
  } else {
    return res.status(400).json({ error: 'No query provided in the request body.' });
  }
}

module.exports = {
	executeVolatilityQuery,
};
