const logger = require('../utils/logger');

// Error handler middleware
function errorHandler(err, req, res, next) {
    logger.error(`Error occurred: ${err.message}`);

    // Determine the type of error and set status code accordingly
    if (err.isJoi) {
        // Validation error from Joi
        return res.status(400).json({ status: 'error', message: err.details[0].message });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ status: 'error', message: 'Invalid token' });
    }

    // For all other types of errors
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
}

// Function to handle API errors, logging, and sending a generic response
function handleApiError(res, message) {
    logger.error(`API Error: ${message}`);
    return res.status(500).json({ status: 'error', message: 'An error occurred while processing your request.' });
}

// Export the error handling middleware and error response handler
module.exports = {
    errorHandler,
    handleApiError
};