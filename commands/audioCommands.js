const { CommandInteraction } = require('discord.js');
const { validate } = require('class-validator');
const logger = require('../utils/logger');
const { playSong, pauseSong, resumeSong, stopSong, skipSong } = require('../music/audioPlayer');
const { setVolume } = require('../music/volumeControl');
const { getUserQueue, clearQueue } = require('../music/queueManager');

class AudioCommands {
    constructor(client) {
        this.client = client;
    }

    async executeCommand(interaction) {
        try {
            const commandName = interaction.commandName;

            switch (commandName) {
                case 'play':
                    await this.play(interaction);
                    break;
                case 'pause':
                    await this.pause(interaction);
                    break;
                case 'resume':
                    await this.resume(interaction);
                    break;
                case 'stop':
                    await this.stop(interaction);
                    break;
                case 'skip':
                    await this.skip(interaction);
                    break;
                case 'volume':
                    await this.volume(interaction);
                    break;
                case 'queue':
                    await this.queue(interaction);
                    break;
                case 'clear':
                    await this.clear(interaction);
                    break;
                default:
                    await interaction.reply('Unknown command');
            }
        } catch (error) {
            logger.error('Error executing audio command: ', error);
            await interaction.reply('An error occurred while executing the command.');
        }
    }

    async play(interaction) {
        const songUrl = interaction.options.getString('url');
        const validationErrors = await validate({ url: songUrl });
        if (validationErrors.length > 0) {
            return interaction.reply('Invalid URL provided.');
        }

        const success = await playSong(interaction, songUrl);
        if (success) {
            await interaction.reply(`Now playing: ${songUrl}`);
        } else {
            await interaction.reply(`Failed to play the song: ${songUrl}`);
        }
    }

    async pause(interaction) {
        const success = await pauseSong(interaction);
        if (success) {
            await interaction.reply('Paused the playback.');
        } else {
            await interaction.reply('No song is currently playing.');
        }
    }

    async resume(interaction) {
        const success = await resumeSong(interaction);
        if (success) {
            await interaction.reply('Resumed playback.');
        } else {
            await interaction.reply('Nothing to resume.');
        }
    }

    async stop(interaction) {
        const success = await stopSong(interaction);
        if (success) {
            await interaction.reply('Stopped playback and cleared the queue.');
        } else {
            await interaction.reply('Failed to stop the playback.');
        }
    }

    async skip(interaction) {
        const success = await skipSong(interaction);
        if (success) {
            await interaction.reply('Skipped to the next song.');
        } else {
            await interaction.reply('No song to skip.');
        }
    }

    async volume(interaction) {
        const volume = interaction.options.getInteger('level');
        if (volume < 0 || volume > 100) {
            return interaction.reply('Volume level must be between 0 and 100.');
        }

        const success = await setVolume(volume, interaction);
        if (success) {
            await interaction.reply(`Volume set to ${volume}.`);
        } else {
            await interaction.reply('Failed to set volume.');
        }
    }

    async queue(interaction) {
        const queue = await getUserQueue(interaction.user.id);
        if (queue.length === 0) {
            await interaction.reply('The queue is currently empty.');
        } else {
            await interaction.reply(`Current queue: ${queue.join(', ')}`);
        }
    }

    async clear(interaction) {
        const success = await clearQueue(interaction.user.id);
        if (success) {
            await interaction.reply('Cleared the queue.');
        } else {
            await interaction.reply('Failed to clear the queue.');
        }
    }
}

module.exports = {
    AudioCommands
};