const { CloudantV1 } = require('@ibm-cloud/cloudant');
const gainLossQuery = require('../services/gain-loss-calculator/gain-loss-service');

async function executeGainLossQuery(req, res, next) {
  if (req.body) {
    try {
	  endDate =  req.body.query.endDate
	  req.body.query.endDate = req.body.query.startDate
	  queryBody = {
		queryParams: req.body.query,
		fields: req.body.fields,
		sort: req.body.sort,
		limit: 1,
	  };
	  const startResult = await gainLossQuery.query(queryBody);
	  req.body.query.startDate = endDate
	  req.body.query.endDate = endDate
	  queryBody = {
		queryParams: req.body.query,
		fields: req.body.fields,
		sort: req.body.sort,
		limit: 100000000000,
	  };
	  const endResult = await gainLossQuery.query(queryBody);

	  value = (startResult[0].price - endResult[endResult.length-1].price)/startResult[0].price * 100;
	  value = Math.round((value + Number.EPSILON)*100)/100;
	  if (value < 0){
		value = "-" + value + "% loss in value from: " + req.body.query.startDate + " until: " + req.body.query.endDate;
	  }
	  else if (value === 0){
		value = "No change in value from: " + req.body.query.startDate + " until: " + req.body.query.endDate;
	  }
	  else{
		value = "+" + value + "% gain in value from: " + req.body.query.startDate + " until: " + req.body.query.endDate;
	  }

	  res.status(200).json(value);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Error executing query.' });
	}
  } else {
    return res.status(400).json({ error: 'No query provided in the request body.' });
  }
}

module.exports = {
  executeGainLossQuery,
};
