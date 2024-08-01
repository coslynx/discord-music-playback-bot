const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

class SpotifyService {
    constructor() {
        this.baseURL = 'https://api.spotify.com/v1';
        this.clientId = process.env.SPOTIFY_CLIENT_ID;
        this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async authenticate() {
        try {
            const response = await axios.post('https://accounts.spotify.com/api/token', 
                new URLSearchParams({
                    grant_type: 'client_credentials'
                }).toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
                    }
                }
            );
            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
            logger.info('Spotify access token retrieved successfully.');
        } catch (error) {
            logger.error(`Authentication failed: ${error.message}`);
            throw new Error('Could not authenticate with Spotify.');
        }
    }

    async getAccessToken() {
        if (!this.accessToken || Date.now() >= this.tokenExpiry) {
            await this.authenticate();
        }
        return this.accessToken;
    }

    async searchTracks(query) {
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios.get(`${this.baseURL}/search`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    q: query,
                    type: 'track',
                    limit: 10
                }
            });
            return response.data.tracks.items;
        } catch (error) {
            logger.error(`Error searching for tracks with query "${query}": ${error.message}`);
            throw new Error('Could not search tracks on Spotify.');
        }
    }

    async getTrackInfo(trackId) {
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios.get(`${this.baseURL}/tracks/${trackId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return response.data;
        } catch (error) {
            logger.error(`Error fetching track info for ID ${trackId}: ${error.message}`);
            throw new Error('Could not retrieve track info from Spotify.');
        }
    }

    async getTrackPreview(trackId) {
        try {
            const trackInfo = await this.getTrackInfo(trackId);
            return trackInfo.preview_url || 'No preview available for this track.';
        } catch (error) {
            logger.error(`Error getting track preview for ID ${trackId}: ${error.message}`);
            throw new Error('Could not retrieve track preview from Spotify.');
        }
    }
}

module.exports = new SpotifyService();