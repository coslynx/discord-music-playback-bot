const { Events } = require('discord.js');
const { playSong, pauseSong, resumeSong, stopSong, skipSong } = require('../music/audioPlayer');
const logger = require('../utils/logger');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        try {
            // Handle play command
            if (message.content.startsWith('!play')) {
                const songUrl = message.content.split(' ')[1];
                const success = await playSong(message, songUrl);
                if (success) {
                    await message.channel.send(`Now playing: ${songUrl}`);
                } else {
                    await message.channel.send(`Failed to play the song: ${songUrl}`);
                }
            }

            // Handle pause command
            else if (message.content.startsWith('!pause')) {
                const success = await pauseSong(message);
                if (success) {
                    await message.channel.send('Paused the playback.');
                } else {
                    await message.channel.send('No song is currently playing.');
                }
            }

            // Handle resume command
            else if (message.content.startsWith('!resume')) {
                const success = await resumeSong(message);
                if (success) {
                    await message.channel.send('Resumed playback.');
                } else {
                    await message.channel.send('Nothing to resume.');
                }
            }

            // Handle stop command
            else if (message.content.startsWith('!stop')) {
                const success = await stopSong(message);
                if (success) {
                    await message.channel.send('Stopped playback and cleared the queue.');
                } else {
                    await message.channel.send('Failed to stop the playback.');
                }
            }

            // Handle skip command
            else if (message.content.startsWith('!skip')) {
                const success = await skipSong(message);
                if (success) {
                    await message.channel.send('Skipped to the next song.');
                } else {
                    await message.channel.send('No song to skip.');
                }
            }
        } catch (error) {
            logger.error(`Error processing message command: ${error.message}`);
            await message.channel.send('An error occurred while processing your command.');
        }
    },
};