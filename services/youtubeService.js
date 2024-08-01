const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

class YouTubeService {
    constructor() {
        this.baseURL = 'https://www.googleapis.com/youtube/v3';
        this.apiKey = process.env.YOUTUBE_API_KEY;
    }

    async searchVideos(query) {
        try {
            const response = await axios.get(`${this.baseURL}/search`, {
                params: {
                    part: 'snippet',
                    q: query,
                    type: 'video',
                    maxResults: 10,
                    key: this.apiKey,
                },
            });
            return response.data.items.map(video => ({
                id: video.id.videoId,
                title: video.snippet.title,
            }));
        } catch (error) {
            logger.error(`Error searching videos with query "${query}": ${error.message}`);
            throw new Error('Could not search videos on YouTube.');
        }
    }

    async getVideoDetails(videoId) {
        try {
            const response = await axios.get(`${this.baseURL}/videos`, {
                params: {
                    part: 'snippet,contentDetails',
                    id: videoId,
                    key: this.apiKey,
                },
            });
            if (response.data.items.length > 0) {
                const video = response.data.items[0];
                return {
                    id: video.id,
                    title: video.snippet.title,
                    description: video.snippet.description,
                    thumbnail: video.snippet.thumbnails.high.url,
                    duration: video.contentDetails.duration,
                };
            } else {
                throw new Error('Video not found.');
            }
        } catch (error) {
            logger.error(`Error fetching video details for ID ${videoId}: ${error.message}`);
            throw new Error('Could not retrieve video details from YouTube.');
        }
    }

    async getVideoStreamURL(videoId) {
        const videoDetails = await this.getVideoDetails(videoId);
        return `https://www.youtube.com/watch?v=${videoId}`; // Stream URL redirect
    }
}

module.exports = new YouTubeService();