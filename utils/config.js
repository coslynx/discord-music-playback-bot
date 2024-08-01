require('dotenv').config();

const config = {
    discordToken: process.env.DISCORD_TOKEN,
    mongoURI: process.env.MONGODB_URI,
    youtubeAPIKey: process.env.YOUTUBE_API_KEY,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    soundcloudClientId: process.env.SOUNDCLOUD_CLIENT_ID,
    logLevel: process.env.LOG_LEVEL || 'info',
};

const validateConfig = () => {
    const requiredConfigs = [
        'discordToken',
        'mongoURI',
        'youtubeAPIKey',
        'spotifyClientId',
        'spotifyClientSecret',
        'soundcloudClientId',
    ];

    requiredConfigs.forEach((key) => {
        if (!config[key]) {
            throw new Error(`Missing configuration: ${key}`);
        }
    });
};

validateConfig();

module.exports = config;