// prevend default form submission
async function OnQuerySubmit(event) {
	console.log("OnQuerySubmit");
	event.preventDefault();

	let stock_tickers = document.getElementById("stock_tickers_input").value;
	if (stock_tickers == "") {
		stock_tickers = [];
	} else {
	  stock_tickers = stock_tickers.replace(/\s/g, '');
	  stock_tickers = stock_tickers.split(",");
	}
	if (stock_tickers.length == 1 && stock_tickers[0] == "") {
		stock_tickers = [];
	}
	console.log(stock_tickers);
	  
	let start_date = document.getElementById("start_date_input").value;
	console.log(start_date);
	let end_date = document.getElementById("end_date_input").value;
	console.log(end_date);
	let start_timestamp = document.getElementById("start_time_input").value;
	console.log(start_timestamp);
	let end_timestamp = document.getElementById("end_time_input").value;
	console.log(end_timestamp);
	let min_price = document.getElementById("min_price_input").value;
	console.log(min_price);
	let max_price = document.getElementById("max_price_input").value;
	console.log(max_price);
	let min_volume = document.getElementById("min_volume_input").value;
	console.log(min_volume);
	let max_volume = document.getElementById("max_volume_input").value;
	console.log(max_volume);
	let exchanges = document.getElementById("exchanges_input").value;
	console.log(exchanges);

	let sale_conditions = document.getElementById("sale_conditions_input").value;
	console.log(sale_conditions);

	let is_suspicious = document.getElementById("is_suspicious_input").value;
	if (is_suspicious == undefined || is_suspicious == "" || is_suspicious == 0) {
		is_suspicious = "all";
	}
	if (is_suspicious == 1) {
		is_suspicious = true;
	}
	if (is_suspicious == 2) {
		is_suspicious = false;
	}

	console.log(is_suspicious);

	let fields = document.getElementById("fields_input").value;

	let sort_by = document.getElementById("sort_by_input").value;
	let sort_order = document.getElementById("sort_order_input").value;

	let limit = document.getElementById("limit_input").value;

	let body_content = {
			query: {
				tickers: stock_tickers,
				startDate: start_date,
				endDate: end_date,
				startMillisecondsSinceMidnight: start_timestamp,
				endMillisecondsSinceMidnight: end_timestamp,
				priceLow: min_price,
				priceHigh: max_price,
				sizeLow: min_volume,
				sizeHigh: max_volume,
				exchanges: exchanges,
				saleConditions: sale_conditions,
				isSuspicious: is_suspicious,
			},
			fields: fields,
			sort: [],
			limit: limit,
		};

	if (body_content.query.tickers.length == 0)
		delete body_content.query.tickers;
	if (body_content.query.startDate == "")
		delete body_content.query.startDate;
	if (body_content.query.endDate == "")
		delete body_content.query.endDate;
	if (body_content.query.startMillisecondsSinceMidnight == "")
		delete body_content.query.startMillisecondsSinceMidnight;
	if (body_content.query.endMillisecondsSinceMidnight == "")
		delete body_content.query.endMillisecondsSinceMidnight;
	if (body_content.query.priceLow == "")
		delete body_content.query.priceLow;
	if (body_content.query.priceHigh == "")
		delete body_content.query.priceHigh;	
	if (body_content.query.sizeLow == "")
		delete body_content.query.sizeLow;
	if (body_content.query.sizeHigh == "")
		delete body_content.query.sizeHigh;
	if (body_content.query.exchanges == "")
		delete body_content.query.exchanges;	
	if (body_content.query.saleConditions == "")
		delete body_content.query.saleConditions;
	if (body_content.query.isSuspicious == "all")
		delete body_content.query.isSuspicious;
	
	console.log("Sending query..." + JSON.stringify(body_content));
  try{
	fetch("http://127.0.0.1:8080/api/services/basic-query/query", {
		method: "POST",
		mode: "cors",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body_content),
	}).then(response => {
		console.log("got response");
		if (response.ok) {
			return response.json();
	    } else {
		    throw new Error('Server returned non-OK status');
	    }
	}).then(data => {
		console.log(data);
  
		if (data == undefined || data == null || data == "") {
			console.log("Error in response: ");
			return;
		}

		if (data.length == 0) {
			console.log("No results found.");
			return;
		}

		let exchanges = document.getElementById('exchanges_input');

		for (var i = 0; i < data.length; i++) {
			console.log(data[i]);
			data[i].date = data[i].date.substring(0, 4) + "-" + data[i].date.substring(4, 6) + "-" + data[i].date.substring(6, 8);
			document.getElementById('query_results_list').innerHTML += 
			'<option value="' + data[i]._id + '"> Datetime: ' + 
			new Date(data[i].timestamp) + "    Symbol: " + data[i].ticker.toUpperCase() + "    Price: $" + Math.round((data[i].price/10000)*100)/100 + "    Sale Volume: " + data[i].size + "    " + exchanges.options[0].value + "    Suspiscious: " + data[i].suspicious + '</option>';
		}
	}).catch(error => {
	  console.error('Fetch error:', error);
	});

  } catch (error) {
	  console.log("unexpected error");
	  console.log(error);
  }
  console.log("done");
  return await new Promise(r => setTimeout(r, 2000));
}
