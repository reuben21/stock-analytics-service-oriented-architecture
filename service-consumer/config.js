const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    consumer_host: process.env.CONSUMER_HOST,
    consumer_port: parseInt(process.env.CONSUMER_PORT),
    consumer_protocol: process.env.CONSUMER_PROTOCOL,

    registry_host: process.env.REGISTRY_HOST,
    registry_port: parseInt(process.env.REGISTRY_PORT),
    registry_protocol: process.env.REGISTRY_PROTOCOL,
};
