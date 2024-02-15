const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	cloudant_url: process.env.CLOUDANT_URL,
	cloudant_api_key: process.env.CLOUDANT_API_KEY,
	cloudant_db_name: process.env.CLOUDANT_DB_NAME,

	service_name: process.env.SERVICE_NAME,
	service_host: process.env.SERVICE_HOST,
	service_port: process.env.SERVICE_PORT,
	service_protocol: process.env.SERVICE_PROTOCOL,
};
