const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    // Other configuration variables
    protocol: process.env.REGISTRY_PROTOCOL,
    host: process.env.REGISTRY_HOST,
    port: parseInt(process.env.REGISTRY_PORT),

    // Redis configuration
    redisHost: process.env.REDIS_HOST,
    redisPort: parseInt(process.env.REDIS_PORT),
    redisUsername: process.env.REDIS_USERNAME,
    redisPassword: process.env.REDIS_PASSWORD
};
