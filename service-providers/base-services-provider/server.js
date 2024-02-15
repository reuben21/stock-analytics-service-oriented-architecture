const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require('express');
const serviceRoutes = require('./routes/service-routes');
const path = require('path');
const cors = require('cors');

const app = express();

const protocol = dotenv.config().parsed.BASE_SERVICES_PROVIDER_PROTOCOL;
const ipAddress = dotenv.config().parsed.BASE_SERVICES_PROVIDER_HOST;
const port = dotenv.config().parsed.BASE_SERVICES_PROVIDER_PORT;

const registryServerUrl = dotenv.config().parsed.REGISTRY_SERVER_URL;
const basicQueryService = require('./services/basic-query/basic-query-service');

const services = [
  {
	serviceName: basicQueryService.SERVICE_NAME,
	instanceId: generateInstanceId(),
	ipAddress: ipAddress,
	port: port,
	endpoint: `${protocol}://${ipAddress}:${port}/api/services/${basicQueryService.SERVICE_NAME}`,
  },
];

for (let service of services) {
  registerService(service);
}

function generateInstanceId() {
  return Math.floor(Math.random() * 100000);
}

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.json());
app.use('/api/services/', cors(), serviceRoutes);
app.options('*', cors())

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
