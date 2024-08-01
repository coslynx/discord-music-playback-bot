const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

class SoundCloudService {
    constructor() {
        this.baseURL = 'https://api.soundcloud.com';
        this.clientId = process.env.SOUNDCLOUD_CLIENT_ID;
    }

    async getTrackInfo(trackId) {
        try {
            const response = await axios.get(`${this.baseURL}/tracks/${trackId}?client_id=${this.clientId}`);
            return response.data;
        } catch (error) {
            logger.error(`Error fetching track info for ID ${trackId}: ${error.message}`);
            throw new Error('Could not retrieve track info from SoundCloud');
        }
    }

    async searchTracks(query) {
        try {
            const response = await axios.get(`${this.baseURL}/tracks`, {
                params: {
                    client_id: this.clientId,
                    q: query,
                    filter: 'public',
                    limit: 10
                }
            });
            return response.data;
        } catch (error) {
            logger.error(`Error searching tracks with query "${query}": ${error.message}`);
            throw new Error('Could not search tracks on SoundCloud');
        }
    }

    async getStreamURL(trackId) {
        try {
            const track = await this.getTrackInfo(trackId);
            if (track && track.stream_url) {
                return `${track.stream_url}?client_id=${this.clientId}`;
            } else {
                throw new Error('Track stream URL not found');
            }
        } catch (error) {
            logger.error(`Error fetching stream URL for track ID ${trackId}: ${error.message}`);
            throw new Error('Could not retrieve stream URL from SoundCloud');
        }
    }

    async getUserPlaylists(userId) {
        try {
            const response = await axios.get(`${this.baseURL}/users/${userId}/playlists`, {
                params: {
                    client_id: this.clientId
                }
            });
            return response.data;
        } catch (error) {
            logger.error(`Error fetching playlists for user ID ${userId}: ${error.message}`);
            throw new Error('Could not retrieve user playlists from SoundCloud');
        }
    }
}

module.exports = new SoundCloudService();