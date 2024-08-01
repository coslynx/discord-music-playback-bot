const mongoose = require('mongoose');
const logger = require('../utils/logger');
require('dotenv').config();

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('Successfully connected to MongoDB');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        throw new Error('Database connection failed');
    }
};

const disconnectFromMongoDB = async () => {
    try {
        await mongoose.disconnect();
        logger.info('Successfully disconnected from MongoDB');
    } catch (error) {
        logger.error('Error disconnecting from MongoDB:', error);
        throw new Error('Failed to disconnect from database');
    }
};

const mongoConnection = {
    connect: connectToMongoDB,
    disconnect: disconnectFromMongoDB,
};

module.exports = mongoConnection;