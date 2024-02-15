require('dotenv').config({ path: `./services/volatility-tracker/.env` });
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');
const dataConstants = require('./data-constants');

const authenticator = new IamAuthenticator({
  apikey: process.env.CLOUDANT_API_KEY,
});

const cloudant = CloudantV1.newInstance({
  authenticator: authenticator,
});

const dbName = process.env.CLOUDANT_DB_NAME;

const queryDb = async (queryParams, fields, sort, limit) => {
  try {
    const selector = {
	  _id: {
		$in: queryParams._ids,
	  },
	  _rev: {
		$in: queryParams._revs,
	  },
	  date: {
		$gte: queryParams.startDate,
		$lte: queryParams.endDate,
	  },
	  ticker: {
		$in: queryParams.tickers,
	  },
      timestamp: {
        $gte: queryParams.startTimestamp,
        $lte: queryParams.endTimestamp,
      },
      price: {
        $gte: queryParams.priceLow,
        $lte: queryParams.priceHigh,
      },
      size: {
        $gte: queryParams.sizeLow,
        $lte: queryParams.sizeHigh,
      },
      exchange: {
        $in: queryParams.exchanges,
      },
      sale_condition: {
        $in: queryParams.saleConditions, 
      },
      suspicious: {
		$in: queryParams.isSuspicious,
	  },
    };

    Object.keys(selector).forEach(
      (key) => selector[key] === undefined && delete selector[key]
    );

	if (queryParams.ids === undefined || queryParams.ids.length === 0) {
	  delete selector._id;
	}

	if (queryParams.revs === undefined || queryParams.revs.length === 0) {
	  delete selector._rev;
	}
	
	if (queryParams.tickers === undefined || queryParams.tickers.length === 0) {
	  delete selector.ticker;
	}

	if (queryParams.exchanges === undefined || queryParams.exchanges.length === 0) {
	  delete selector.exchange;
	}

	if (queryParams.saleConditions === undefined || queryParams.saleConditions.length === 0) {
	  delete selector.sale_condition;
	}

	if (queryParams.isSuspicious === undefined || queryParams.isSuspicious.length === 0) {
	  delete selector.suspicious;
	}

	let query = {
	  db: dbName,
      selector: selector,
	};

	if (fields) {
	  query.fields = fields;
	} else {
	  query.fields = dataConstants.FIELD_NAMES;
	}

	if (sort) {
	  query.sort = sort;
	} else {
	  query.sort = [
		{"date": "asc"}
	  ];
	}

	if (limit) {
	  query.limit = limit;
	} else {
	  query.limit = 200;
	}

    const queryResult = await cloudant.postFind(query);
    return queryResult.result.docs;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

module.exports = {
  queryDb,
};
