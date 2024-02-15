const {getAllServices, getServicesByName} = require('../utils');

async function queryAllServices(req, res) {
	serviceList = await getAllServices();
	if (serviceList == undefined || serviceList.length <= 0) {
		res.status(404).send("No services found");
		return;
	} else {
		let response = [];
		for (let i = 0; i < serviceList.length; i++) {
			let serviceName = serviceList[i].serviceName;
			if (serviceName === undefined) {
				res.status(500).send("Internal error, no services found");
				return;
			}
			if (response.indexOf(serviceName) === -1) {
				response.push(serviceName);
			}
		}
		if (response.length > 0) {
			res.status(200).send(response);
			return;
		} else {
			res.status(404).send("No services found");
			return;
		}
	}
}

async function queryServicesByName(req, res) {
	serviceName = req.params.serviceName;
	if (!serviceName) {
		res.status(400).send("No service name provided");
		return;
	}
	serviceList = await getServicesByName(serviceName);
	if (serviceList == undefined || serviceList.length <= 0) {
		res.status(404).send("No services found");
		return;
	} else {
		serviceName = serviceList[0].values.serviceName;
		if (serviceName === undefined) {
			res.status(500).send("Internal error, no services found");
			return;
		}
		res.status(200).send(serviceList);
		return;
	}
}

module.exports = {
	queryAllServices,
	queryServicesByName
};
