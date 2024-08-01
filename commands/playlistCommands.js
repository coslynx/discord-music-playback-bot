const { CommandInteraction } = require('discord.js');
const { validate } = require('class-validator');
const logger = require('../utils/logger');
const { getUserPlaylists, createPlaylist, addSongToPlaylist, removeSongFromPlaylist, clearPlaylist } = require('../music/playlistManager');

class PlaylistCommands {
    constructor(client) {
        this.client = client;
    }

    async executeCommand(interaction) {
        try {
            const commandName = interaction.commandName;

            switch (commandName) {
                case 'create':
                    await this.createPlaylist(interaction);
                    break;
                case 'add':
                    await this.addSong(interaction);
                    break;
                case 'remove':
                    await this.removeSong(interaction);
                    break;
                case 'clear':
                    await this.clearPlaylist(interaction);
                    break;
                case 'view':
                    await this.viewPlaylists(interaction);
                    break;
                default:
                    await interaction.reply('Unknown command');
            }
        } catch (error) {
            logger.error('Error executing playlist command: ', error);
            await interaction.reply('An error occurred while executing the command.');
        }
    }

    async createPlaylist(interaction) {
        const playlistName = interaction.options.getString('name');
        const validationErrors = await validate({ name: playlistName });
        if (validationErrors.length > 0) {
            return interaction.reply('Invalid playlist name provided.');
        }

        const success = await createPlaylist(interaction.user.id, playlistName);
        if (success) {
            await interaction.reply(`Playlist created: ${playlistName}`);
        } else {
            await interaction.reply(`Failed to create playlist: ${playlistName}`);
        }
    }

    async addSong(interaction) {
        const playlistName = interaction.options.getString('playlist');
        const songUrl = interaction.options.getString('url');

        const validationErrors = await validate({ url: songUrl });
        if (validationErrors.length > 0) {
            return interaction.reply('Invalid URL provided.');
        }

        const success = await addSongToPlaylist(interaction.user.id, playlistName, songUrl);
        if (success) {
            await interaction.reply(`Added to playlist '${playlistName}': ${songUrl}`);
        } else {
            await interaction.reply(`Failed to add song to playlist '${playlistName}': ${songUrl}`);
        }
    }

    async removeSong(interaction) {
        const playlistName = interaction.options.getString('playlist');
        const songUrl = interaction.options.getString('url');

        const success = await removeSongFromPlaylist(interaction.user.id, playlistName, songUrl);
        if (success) {
            await interaction.reply(`Removed from playlist '${playlistName}': ${songUrl}`);
        } else {
            await interaction.reply(`Failed to remove song from playlist '${playlistName}': ${songUrl}`);
        }
    }

    async clearPlaylist(interaction) {
        const playlistName = interaction.options.getString('playlist');

        const success = await clearPlaylist(interaction.user.id, playlistName);
        if (success) {
            await interaction.reply(`Cleared the playlist '${playlistName}'.`);
        } else {
            await interaction.reply(`Failed to clear the playlist '${playlistName}'.`);
        }
    }

    async viewPlaylists(interaction) {
        const playlists = await getUserPlaylists(interaction.user.id);
        if (playlists.length === 0) {
            await interaction.reply(`You have no playlists.`);
        } else {
            await interaction.reply(`Your playlists: ${playlists.join(', ')}`);
        }
    }
}

module.exports = {
    PlaylistCommands
};