const db = require('./db');
const dataConstants = require('./data-constants');

const SERVICE_NAME = 'basic-query';

function query(queryBody) {
  console.log(`querying ${SERVICE_NAME} with query ${JSON.stringify(queryBody)}`);
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
	if (!query) {
		console.log('error: query is undefined');
		return;
	}
	let newQuery = {};

	if (query.id) {
		newQuery._ids = [ query.id ];
	}

	if (query._id) {
		if (query.id) {
			console.log('error: cannot specify both id and _id');
			return;
		}
		newQuery._ids = [ query._id ];
	}

	if (query.ids) {
		if (query.ids.length > 0 && (query.id || query._id)) {
			console.log('error: cannot specify both id and ids');
			return;
		}
		newQuery._ids = query.ids;
	}

	if (query._ids) {
		if (query._ids.length > 0 && (query.id || query._id || query.ids)) {
			console.log('error: cannot specify both id and ids');
			return;
		}
		newQuery._ids = query._ids;
	}

	if (query.rev) {
		newQuery._revs = [ query.rev ];
	}

	if (query._rev) {
		if (query.rev) {
			console.log('error: cannot specify both rev and _rev');
			return;
		}
		newQuery._revs = [ query._rev ];
	}

	if (query.revs) {
		if (query.revs.length > 0 && (query.rev || query._rev)) {
			console.log('error: cannot specify both rev and revs');
			return;
		}
		newQuery._revs = query.revs;
	}

	if (query._revs) {
		if (query._revs.length > 0 && (query.rev || query._rev || query.revs)) {
			console.log('error: cannot specify both rev and revs');
			return;
		}
		newQuery._revs = query._revs;
	}

	if (query.startTime) {
		newQuery.startTimestamp = unixTimeToMillisecondsSinceMidnight(query.startTime);
		newQuery.startDate = unixToDateString(query.startTime);
	}

	if (query.endTime) {
		newQuery.endTimestamp = unixTimeToMillisecondsSinceMidnight(query.endTime);
		newQuery.endDate = unixToDateString(query.endTime);
	}

	if (query.startDate) {	
		if (query.startTime) {
			console.log('error: cannot specify both startTime and endDate');
			return;
		}
		newQuery.startDate = query.startDate;
	}

	if (query.endDate) {
		if (query.endTime) {
			console.log('error: cannot specify both endTime and endDate');
			return;
		}
		newQuery.endDate = query.endDate;
	}

	if (query.startMillisecondsSinceMidnight) {
		if (query.startTime) {
			console.log('error: cannot specify both startTime and startMillisecondsSinceMidnight');
			return;
		}
		newQuery.startTimestamp = query.startMillisecondsSinceMidnight;
	}

	if (query.endMillisecondsSinceMidnight) {
		if (query.endTime) {
			console.log('error: cannot specify both endTime and endMillisecondsSinceMidnight');
			return;
		}
		newQuery.endTimestamp = query.endMillisecondsSinceMidnight;
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

	if (query.priceLow) {
	  newQuery.priceLow = query.priceLow * dataConstants.PRICE_MULTIPLIER;
	}

	if (query.priceHigh) {
	  newQuery.priceHigh = query.priceHigh * dataConstants.PRICE_MULTIPLIER;
	}

	if (query.sizeLow) {
	  newQuery.sizeLow = query.sizeLow;
	}

	if (query.sizeHigh) {
	  newQuery.sizeHigh = query.sizeHigh;
	}

	if (query.exchange) {
	  if (query.exchange.length > 1) {
		exchange = inverseExchangeMap[query.exchange];
		if (!exchange) {
		  console.log(`error: exchange ${query.exchange} not found`);
		  return;
		}
		newQuery.exchanges = [exchange];
	  } else if (exchangeMap[query.exchange]) {
		newQuery.exchanges = [query.exchange];
	  } else {
		console.log(`error: exchange ${query.exchange} not found`);
		return;
	  }
	}

	if (query.exchanges) {
	  if (query.exchanges.length > 0 && query.exchange) {
		console.log('error: cannot specify both exchange and exchanges');
		return;
	  }
	  let exchanges = [];
	  for (const exchange of query.exchanges) {
		if (query.exchange.length > 1) {
		  const exchange = inverseExchangeMap[query.exchange];
		  if (!exchange) {
			console.log(`error: exchange ${query.exchange} not found`);
			return;
		  }
		  exchanges.push(exchange);
		} else if (exchangeMap[query.exchange]) {
		  exchanges.push(query.exchange);
		} else {
		  console.log(`error: exchange ${query.exchange} not found`);
		  return;
		}
	  }
	  newQuery.exchanges = exchanges;
	}

	if (query.saleCondition) {
	  if (query.saleConditions.length > 4) {
		console.log('error: cannot specify more than 4 sale condition characters');
		return;
	  }
	  newQuery.saleConditions = [query.saleCondition];
	}

	if (query.saleConditions) {
	  if (query.saleConditions.length > 0 && query.saleCondition) {
		console.log('error: cannot specify both saleCondition and saleConditions');
		return;
	  }
	  for (const saleCondition of query.saleConditions) {
		if (saleCondition.length > 4) {
		  console.log('error: cannot specify more than 4 sale condition characters');
		  return;
		}
	  }
	  newQuery.saleConditions = query.saleConditions;
	}

	if (query.isSuspicious) {
	  if (dataConstants.TRUE_VALUES.includes(query.isSuspicious)) {
		newQuery.isSuspicious = [1];
	  } else if (dataConstants.FALSE_VALUES.includes(query.isSuspicious)) {
		newQuery.isSuspicious = [0];
	  } else if (dataConstants.ALL_VALUES.includes(query.isSuspicious)) {
		newQuery.isSuspicious = undefined;
	  }
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

function unixTimeToMillisecondsSinceMidnight(unixTime) {
	const date = new Date(unixTime * 1000);
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();
	return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}

function unixToDateString(unixTime) {
	const date = new Date(unixTime * 1000);
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`;
}

module.exports = {
  SERVICE_NAME,
  query
};
