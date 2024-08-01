const { Events } = require('discord.js');
const { playSong, pauseSong, resumeSong, stopSong, skipSong } = require('../music/audioPlayer');
const logger = require('../utils/logger');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        try {
            const { channelId, member } = newState;

            if (oldState.channelId !== channelId && channelId !== null) {
                logger.info(`${member.user.tag} joined the voice channel.`);
                // Here you might want to handle joining a specific channel.
            }

            if (oldState.channelId !== channelId && oldState.channelId !== null) {
                logger.info(`${member.user.tag} left the voice channel.`);
                // Handle logic for when a user leaves.
            }
        } catch (error) {
            logger.error(`Error in voice state update event: ${error}`);
        }
    },
};

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

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
        if (message.content.startsWith('!pause')) {
            const success = await pauseSong(message);
            if (success) {
                await message.channel.send('Paused the playback.');
            } else {
                await message.channel.send('No song is currently playing.');
            }
        }

        // Handle resume command
        if (message.content.startsWith('!resume')) {
            const success = await resumeSong(message);
            if (success) {
                await message.channel.send('Resumed playback.');
            } else {
                await message.channel.send('Nothing to resume.');
            }
        }

        // Handle stop command
        if (message.content.startsWith('!stop')) {
            const success = await stopSong(message);
            if (success) {
                await message.channel.send('Stopped playback and cleared the queue.');
            } else {
                await message.channel.send('Failed to stop the playback.');
            }
        }

        // Handle skip command
        if (message.content.startsWith('!skip')) {
            const success = await skipSong(message);
            if (success) {
                await message.channel.send('Skipped to the next song.');
            } else {
                await message.channel.send('No song to skip.');
            }
        }
    },
};