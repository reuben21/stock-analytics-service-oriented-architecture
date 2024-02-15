const db = require('./db');
const dataConstants = require('./data-constants');

const SERVICE_NAME = 'top-bottom-performer';

function query(queryBody) {
  let { queryParams, fields, sort, limit } = queryBody;
  const formattedQueryParams = formatQueryParams(queryParams);
  if (!validateFields(fields)) {
	return;
  }
  return db.queryDb(formattedQueryParams, fields, sort, limit);
}

function validateFields(fields) {
  if (!fields) {
	return true;
  }

  for (const field of fields) {
	if (!dataConstants.FIELD_NAMES.includes(field)) {
	  console.log(`error: field ${field} not found`);
	  return false;
	}
  }
  return true;
}

function formatQueryParams(query) {
	let newQuery = {};

	if (query.startDate) {	
		newQuery.startDate = query.startDate;
	}

	if (query.endDate) {
		newQuery.endDate = query.endDate;
	}

	if (query.ticker) {
		newQuery.tickers = [query.ticker];
	}

	if (query.tickers) {
	  if (query.tickers.length > 0 && query.ticker) {
		console.log('error: cannot specify both ticker and tickers');
		return;
	  }
	  newQuery.tickers = query.tickers;
	}
	
	newQuery = fillInDefaults(newQuery);
	return newQuery;
}

function fillInDefaults(query) {
  if (!query.startDate) {
	query.startDate = dataConstants.DATE_MIN;
  }
  if (!query.endDate) {
	query.endDate = dataConstants.DATE_MAX;
  }
  if (!query.startTimestamp) {
	query.startTimestamp = dataConstants.TIMESTAMP_MIN;
  }
  if (!query.endTimestamp) {
	query.endTimestamp = dataConstants.TIMESTAMP_MAX;
  }
  if (!query.tickers) {
	query.tickers = undefined;
  }
  if (!query.priceLow) {
	query.priceLow = dataConstants.PRICE_MIN;
  }
  if (!query.priceHigh) {
	query.priceHigh = dataConstants.PRICE_MAX;
  }
  if (!query.sizeLow) {
	query.sizeLow = dataConstants.SIZE_MIN;
  }
  if (!query.sizeHigh) {
	query.sizeHigh = dataConstants.SIZE_MAX;
  }
  if (!query.exchanges) {
	query.exchanges = undefined;
  }
  if (!query.saleConditions) {
	query.saleConditions = undefined;
  }
  if (!query.isSuspicious) {
	query.isSuspicious = undefined;
  }
  return query;
}

module.exports = {
  SERVICE_NAME,
  query
};
