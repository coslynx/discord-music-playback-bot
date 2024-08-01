const logger = require('../utils/logger');
const { getUserQueueFromDB, saveUserQueueToDB } = require('../services/discordService');

class QueueManager {
    constructor() {
        this.queues = new Map();
    }

    async getUserQueue(userId) {
        if (!this.queues.has(userId)) {
            const queue = await getUserQueueFromDB(userId);
            this.queues.set(userId, queue || []);
        }
        return this.queues.get(userId);
    }

    async addSongToQueue(userId, songUrl) {
        try {
            const queue = await this.getUserQueue(userId);
            queue.push(songUrl);
            await saveUserQueueToDB(userId, queue);
            this.queues.set(userId, queue);
            logger.info(`Added song to queue for user ${userId}: ${songUrl}`);
            return true;
        } catch (error) {
            logger.error(`Error adding song to queue for user ${userId}: ${error.message}`);
            return false;
        }
    }

    async removeSongFromQueue(userId, songUrl) {
        try {
            const queue = await this.getUserQueue(userId);
            const updatedQueue = queue.filter(song => song !== songUrl);
            await saveUserQueueToDB(userId, updatedQueue);
            this.queues.set(userId, updatedQueue);
            logger.info(`Removed song from queue for user ${userId}: ${songUrl}`);
            return true;
        } catch (error) {
            logger.error(`Error removing song from queue for user ${userId}: ${error.message}`);
            return false;
        }
    }

    async clearQueue(userId) {
        try {
            await saveUserQueueToDB(userId, []);
            this.queues.set(userId, []);
            logger.info(`Cleared queue for user ${userId}`);
            return true;
        } catch (error) {
            logger.error(`Error clearing queue for user ${userId}: ${error.message}`);
            return false;
        }
    }

    async nextSong(userId) {
        const queue = await this.getUserQueue(userId);
        if (queue.length > 0) {
            return queue[0]; // Return the next song
        }
        return null; // No songs in queue
    }

    async removeNextSong(userId) {
        const queue = await this.getUserQueue(userId);
        if (queue.length > 0) {
            const nextSong = queue.shift(); // Remove the first song
            await saveUserQueueToDB(userId, queue);
            this.queues.set(userId, queue);
            logger.info(`Removed next song from queue for user ${userId}: ${nextSong}`);
            return nextSong;
        }
        return null; // No songs to remove
    }
}

module.exports = new QueueManager();