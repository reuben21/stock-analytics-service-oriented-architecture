async function OnExecuteService() {
	var e = document.getElementById('search_results_list');
	if (e == undefined || e == null) {
		console.log("No search results list found");
		return;
	}
	var value = e.options[e.selectedIndex].value;
	if (value == undefined || value == null) {
		console.log("No search results list found");
		return;
	}

	console.log("Executing service:", value);

	const response = await fetch('/api/services/query/' + value, {
		method: 'GET',
		mode: 'cors',
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		redirect: 'follow',
	});

	if (response.status != 200) {
		console.log("Failed to execute service");
		return;
	}

	service_list = await response.json();

	if (service_list == undefined || service_list == null) {
		console.log("Failed to parse search results");
		return;
	}

	if (service_list.length == 0) {
		console.log("Noo services found");
		return;
	}	

	// open a new window with the service
	window.open(service_list[0].values.endpoint, '_blank');
}


async function OnSearch() {
    var query = document.getElementById('search_engine_input').value;
    console.log("Searching for:", query);
    
	document.getElementById('search_results_list').innerHTML = '';	
	const response = await fetch('/api/services/query/' + query, {
		method: 'GET',
		mode: 'cors',
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		redirect: 'follow',
	});

	if (response.status != 200) {
		console.log("Failed to search for services");
		return;
	}

	if (response.status == 204) {
		console.log("No services found");
		return;
	}

	service_list = await response.json();
	if (service_list == undefined || service_list == null) {
		console.log("Failed to parse search results");
		return;
	}

	if (service_list.length == 0) {
		console.log("Noo services found");
		return;
	}
	// render dom with search_engine.pug passing response as the results parameter
	for (var i = 0; i < service_list.length; i++) {
		document.getElementById('search_results_list').innerHTML += '<option value="' + service_list[i].values.instanceID + '">' + service_list[i].values.serviceName + " " + service_list[i].values.instanceID + '</option>';
	}

    return false;
}
