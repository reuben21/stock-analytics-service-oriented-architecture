const config = require('./config');

const axios = require('axios');

function getRegistryServicesEndpoint() {
	return config.registry_protocol + '://' + config.registry_host + ':' + config.registry_port + "/api/services";
}

async function getAllServices() {
	let response = await axios.get(getRegistryServicesEndpoint() + "/list").then((response) => {
		return response.data;
	});
	console.log("Get All Services: " + response);
	return response;
}

async function getServicesByName(serviceName) {
	let response = await axios.get(getRegistryServicesEndpoint() + "/list/" + serviceName).then((response) => {
		return response.data;
	});
	console.log("Get Services by name: " + response);
	return response;
}

module.exports = {
	getAllServices,
	getServicesByName
};
