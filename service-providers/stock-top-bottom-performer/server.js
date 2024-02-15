const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const serviceRoutes = require('./routes/service-routes');
const path = require("path");
const app = express();

const protocol = dotenv.config().parsed.TOP_BOTTOM_SERVICES_PROTOCOL;
const ipAddress = dotenv.config().parsed.TOP_BOTTOM_SERVICES_HOST;
const port = dotenv.config().parsed.TOP_BOTTOM_SERVICES_PORT;

const registryServerUrl = dotenv.config().parsed.REGISTRY_SERVER_URL;
const topBottomService = require('./services/top-bottom-performer/top-bottom-service');

const services = [
  {
	serviceName: topBottomService.SERVICE_NAME,
	instanceId: generateInstanceId(),
	ipAddress: ipAddress,
	port: port,
	endpoint: `${protocol}://${ipAddress}:${port}/api/services/${topBottomService.SERVICE_NAME}`,
  },
];

for (let service of services) {
  registerService(service);
}

function generateInstanceId() {
  return Math.floor(Math.random() * 100000);
}

app.use(bodyParser.json());
app.use('/api/services/', serviceRoutes);

app.get("/api/services/top-bottom-performer", (req,res) => {
	res.sendFile(path.join(__dirname) + '/views/top-bottom.html')
})

function registerService(service) {
	axios.post(registryServerUrl + "/register", service)
		.then(response => {
			console.log('Registration successful:', response.data);
		})
		.catch(error => {
			console.error('Registration failed:', error.message);
		});
}

function pingRegistry() {
  for (let service of services) {
	axios.put(registryServerUrl + "/heartbeat", { 
	  serviceName: service.serviceName, 
	  instanceId: service.instanceId 
	}).then(response => {
		console.log('Ping successful:', response.data);
      })
	  .catch(error => {
	    console.error('Ping failed:', error.message);
      });
  }
}

setInterval(pingRegistry, 30000);

process.on('SIGINT', () => {
  console.log('\nShutting down provider server...');
  process.exit();
});

app.listen(port, () => {
  console.log(`Provider server listening at ${protocol}://${ipAddress}:${port}`);
});
