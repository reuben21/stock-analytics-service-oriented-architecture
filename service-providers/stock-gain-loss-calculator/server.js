const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const serviceRoutes = require('./routes/service-routes');

const app = express();
const path = require("path");
const protocol = dotenv.config().parsed.GAIN_LOSS_SERVICES_PROTOCOL;
const ipAddress = dotenv.config().parsed.GAIN_LOSS_SERVICES_HOST;
const port = dotenv.config().parsed.GAIN_LOSS_SERVICES_PORT;

const registryServerUrl = dotenv.config().parsed.REGISTRY_SERVER_URL;
const gainLossService = require('./services/gain-loss-calculator/gain-loss-service');

const services = [
  {
	serviceName: gainLossService.SERVICE_NAME,
	instanceId: generateInstanceId(),
	ipAddress: ipAddress,
	port: port,
	endpoint: `${protocol}://${ipAddress}:${port}/api/services/${gainLossService.SERVICE_NAME}`,
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

app.get("/api/services/gain-loss-calculator", (req,res) => {
	res.sendFile(path.join(__dirname) + '/views/gain-loss.html')
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
