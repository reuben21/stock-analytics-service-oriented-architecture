const winston = require('winston');

// Create a Winston logger
const logger = winston.createLogger({
    level: 'info', // Logging level (info, warn, error, etc.)
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'your-service-name' }, // Add default metadata
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }), // Log to a file
    ],
});

// Export the logger instance
module.exports = logger;
