// config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    protocol: process.env.PROTOCOL,
    host: process.env.HOST,
    port: process.env.PORT,
    serviceName: process.env.SERVICE_NAME,
    serviceVersion: process.env.SERVICE_VERSION,
    instanceId: process.env.INSTANCE_ID,
    serviceRegistryUrl: process.env.SERVICE_REGISTRY_URL,
    healthCheckInterval: process.env.HEALTH_CHECK_INTERVAL
};
