const winston = require('winston');
require('dotenv').config();

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({ 
            filename: 'logs/error.log',
            level: 'error',
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.log',
        }),
    ],
});

// Custom logger function to log messages with varying severity
const logMessage = (level, message) => {
    switch (level) {
        case 'info':
            logger.info(message);
            break;
        case 'warn':
            logger.warn(message);
            break;
        case 'error':
            logger.error(message);
            break;
        default:
            logger.log(level, message);
            break;
    }
};

module.exports = {
    logMessage,
    logger,
};