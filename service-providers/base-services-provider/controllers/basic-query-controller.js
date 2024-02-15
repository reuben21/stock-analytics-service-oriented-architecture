const basicQuery = require('../services/basic-query/basic-query-service');

async function getBasicQuery(req, res, next) {
	res.status(200).render('basic_query');
}

async function executeBasicQuery(req, res, next) {
  if (req.body) {
    try {
	  const queryBody = {
		queryParams: req.body.query,
		fields: req.body.fields,
		sort: req.body.sort,
		limit: parseInt(req.body.limit),
	  };
	  console.log('Query');
	  console.log('Query body:', queryBody);
	  const result = await basicQuery.query(queryBody);

	  console.log('Query result:', result);
      
	  res.set('Content-Type', 'application/json');
	  res.set('Access-Control-Allow-Origin', '*');

	  res.status(200)	
		.json(result);

	  console.log('Query executed successfully.');
	  console.log(res);
	  return res;
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500)
		.json({ error: 'Error executing query.' });
	}
  } else {
    return res.status(400).json({ error: 'No query provided in the request body.' });
  }
}

module.exports = {
  getBasicQuery,
  executeBasicQuery,
};
