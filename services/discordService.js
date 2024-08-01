const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { User } = require('../models/userModel');
const { Playlist } = require('../models/playlistModel');
const { Song } = require('../models/songModel');

class DiscordService {
    constructor() {
        mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => logger.info('MongoDB connected'))
            .catch(err => logger.error('MongoDB connection error:', err));
    }

    async saveUser(userId) {
        try {
            const existingUser = await User.findOne({ userId });
            if (!existingUser) {
                const newUser = new User({ userId });
                await newUser.save();
                logger.info(`User ${userId} saved to database.`);
            } else {
                logger.info(`User ${userId} already exists in database.`);
            }
        } catch (error) {
            logger.error(`Error saving user ${userId}: ${error.message}`);
            throw new Error(`Unable to save user ${userId}`);
        }
    }

    async getUserPlaylists(userId) {
        try {
            const playlists = await Playlist.find({ userId });
            return playlists;
        } catch (error) {
            logger.error(`Error fetching playlists for user ${userId}: ${error.message}`);
            throw new Error(`Could not retrieve playlists for user ${userId}`);
        }
    }

    async createPlaylist(userId, playlistName) {
        try {
            const newPlaylist = new Playlist({ userId, name: playlistName, songs: [] });
            await newPlaylist.save();
            logger.info(`Playlist ${playlistName} created for user ${userId}`);
            return newPlaylist;
        } catch (error) {
            logger.error(`Error creating playlist ${playlistName} for user ${userId}: ${error.message}`);
            throw new Error(`Could not create playlist ${playlistName}`);
        }
    }

    async addSongToPlaylist(userId, playlistName, songUrl) {
        try {
            const playlist = await Playlist.findOne({ userId, name: playlistName });
            if (playlist) {
                playlist.songs.push(songUrl);
                await playlist.save();
                logger.info(`Added song ${songUrl} to playlist ${playlistName} for user ${userId}`);
                return true;
            }
            logger.warn(`Playlist ${playlistName} not found for user ${userId}`);
            return false;
        } catch (error) {
            logger.error(`Error adding song ${songUrl} to playlist ${playlistName}: ${error.message}`);
            throw new Error(`Could not add song ${songUrl} to playlist ${playlistName}`);
        }
    }

    async removeSongFromPlaylist(userId, playlistName, songUrl) {
        try {
            const playlist = await Playlist.findOne({ userId, name: playlistName });
            if (playlist) {
                playlist.songs = playlist.songs.filter(song => song !== songUrl);
                await playlist.save();
                logger.info(`Removed song ${songUrl} from playlist ${playlistName} for user ${userId}`);
                return true;
            }
            logger.warn(`Playlist ${playlistName} not found for user ${userId}`);
            return false;
        } catch (error) {
            logger.error(`Error removing song ${songUrl} from playlist ${playlistName}: ${error.message}`);
            throw new Error(`Could not remove song ${songUrl} from playlist ${playlistName}`);
        }
    }

    async clearUserQueue(userId) {
        try {
            await Playlist.deleteMany({ userId });
            logger.info(`Cleared all playlists for user ${userId}`);
            return true;
        } catch (error) {
            logger.error(`Error clearing playlists for user ${userId}: ${error.message}`);
            throw new Error(`Could not clear playlists for user ${userId}`);
        }
    }
}

module.exports = new DiscordService();